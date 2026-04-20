import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUnsubscribeMessage } from '@/lib/utils'
import { successResponse, serverErrorResponse } from '@/lib/api'

// GET /api/webhooks/whatsapp/[userId] — Meta webhook verification
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe') {
    // Find a matching whatsapp account for THIS user with this verify token
    const accounts = await prisma.whatsappAccount.findMany({
      where: { userId, isActive: true },
      select: { id: true, webhookVerifyTokenEncrypted: true },
    })

    const { decrypt } = await import('@/lib/encryption')
    const matched = accounts.find((a) => {
      if (!a.webhookVerifyTokenEncrypted) return false
      try {
        return decrypt(a.webhookVerifyTokenEncrypted) === token
      } catch {
        return false
      }
    })

    if (matched) {
      return new Response(challenge, { status: 200 })
    }
  }

  return new Response('Forbidden', { status: 403 })
}

// POST /api/webhooks/whatsapp/[userId] — receive delivery events and inbound messages
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  try {
    const body = await request.json()
    const entries = body?.entry ?? []

    for (const entry of entries) {
      const changes = entry.changes ?? []
      for (const change of changes) {
        const value = change.value ?? {}
        const messages = value.messages ?? []
        const statuses = value.statuses ?? []

        // ── Handle delivery status updates ───────────────
        for (const status of statuses) {
          const waMessageId = status.id
          const statusType: string = status.status // sent, delivered, read, failed

          const message = await prisma.message.findUnique({ 
            where: { whatsappMessageId: waMessageId },
            include: { whatsappAccount: true }
          })
          
          if (!message || message.whatsappAccount.userId !== userId) continue

          const STATUS_ORDER = ['QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'READ', 'REPLIED']
          const currentIdx = STATUS_ORDER.indexOf(message.status)
          const newStatusMap: Record<string, string> = { sent: 'SENT', delivered: 'DELIVERED', read: 'READ', failed: 'FAILED' }
          const newStatus = newStatusMap[statusType]
          const newIdx = newStatus ? STATUS_ORDER.indexOf(newStatus) : -1

          if (newStatus && (newIdx > currentIdx || newStatus === 'FAILED')) {
            await prisma.message.update({
              where: { id: message.id },
              data: {
                status: newStatus as 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
                ...(newStatus === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
                ...(newStatus === 'READ' ? { readAt: new Date() } : {}),
                ...(newStatus === 'FAILED' ? { failureReason: status.errors?.[0]?.title ?? 'Delivery failed' } : {}),
              },
            })

            await prisma.messageEvent.create({
              data: {
                messageId: message.id,
                eventType: statusType,
                eventPayloadJson: status,
                occurredAt: new Date(),
              },
            })

            if (message.campaignId) {
              const counterField = { DELIVERED: 'totalDelivered', READ: 'totalRead' }[newStatus]
              if (counterField) {
                await prisma.campaign.update({
                  where: { id: message.campaignId },
                  data: { [counterField]: { increment: 1 } },
                })
              }
            }
          }
        }

        // ── Handle inbound messages ───────────────────────
        for (const inboundMsg of messages) {
          const waMessageId = inboundMsg.id
          const from = inboundMsg.from
          const text: string = inboundMsg.text?.body ?? ''
          const timestamp = parseInt(inboundMsg.timestamp ?? '0', 10)

          const existing = await prisma.message.findUnique({ where: { whatsappMessageId: waMessageId } })
          if (existing) continue

          const lead = await prisma.lead.findFirst({ 
            where: { phoneNumber: `+${from}`, userId } 
          })
          if (!lead) continue

          if (isUnsubscribeMessage(text)) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: { unsubscribed: true, unsubscribedAt: new Date(), status: 'UNSUBSCRIBED', optIn: false },
            })
            await prisma.activityLog.create({
              data: {
                userId: lead.userId,
                leadId: lead.id,
                eventType: 'LEAD_UNSUBSCRIBED',
                description: `Lead unsubscribed via keyword: "${text.trim()}"`,
              },
            })
          } else {
            const outbound = await prisma.message.findFirst({
              where: { leadId: lead.id, direction: 'OUTBOUND', status: { in: ['SENT', 'DELIVERED', 'READ'] } },
              orderBy: { sentAt: 'desc' },
            })
            if (outbound) {
              await prisma.message.update({
                where: { id: outbound.id },
                data: { status: 'REPLIED', repliedAt: new Date() },
              })
              if (outbound.campaignId) {
                await prisma.campaign.update({
                  where: { id: outbound.campaignId },
                  data: { totalReplied: { increment: 1 } },
                })
              }
            }
            await prisma.activityLog.create({
              data: {
                userId: lead.userId,
                leadId: lead.id,
                eventType: 'REPLY_RECEIVED',
                description: `Reply received from ${lead.phoneNumber}: "${text.slice(0, 100)}"`,
              },
            })
          }

          const whatsappAccount = await prisma.whatsappAccount.findFirst({
            where: { userId, isActive: true },
          })

          if (whatsappAccount) {
            const inboundRecord = await prisma.message.create({
              data: {
                userId,
                whatsappAccountId: whatsappAccount.id,
                leadId: lead.id,
                direction: 'INBOUND',
                status: 'REPLIED',
                whatsappMessageId: waMessageId,
                renderedBody: text,
                repliedAt: timestamp ? new Date(timestamp * 1000) : new Date(),
              },
            })

            const conversation = await prisma.conversation.upsert({
              where: {
                userId_leadId_whatsappAccountId: {
                  userId,
                  leadId: lead.id,
                  whatsappAccountId: whatsappAccount.id,
                },
              },
              update: { lastMessageAt: new Date() },
              create: {
                userId,
                leadId: lead.id,
                whatsappAccountId: whatsappAccount.id,
                source: 'WEBHOOK',
                lastMessageAt: new Date(),
              },
            })

            await prisma.conversationMessage.create({
              data: {
                conversationId: conversation.id,
                leadId: lead.id,
                messageId: inboundRecord.id,
                direction: 'INBOUND',
                body: text,
                whatsappMessageId: waMessageId,
                receivedAt: new Date(),
              },
            })
          }
        }
      }
    }
    return successResponse(null, 'OK')
  } catch (err) {
    return serverErrorResponse(err)
  }
}
