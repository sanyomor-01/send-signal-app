import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'
import { decrypt } from '@/lib/encryption'

// POST /api/campaigns/[id]/execute — database-driven campaign execution (no Redis)
// This route is called by a cron or scheduled trigger to process queued messages
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params

  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: session.userId, status: { in: ['RUNNING', 'SCHEDULED'] } },
      include: {
        whatsappAccount: true,
        template: true,
      },
    })

    if (!campaign) return errorResponse('Campaign not found or not in runnable state', 404)

    // Mark as running
    await prisma.campaign.update({ where: { id }, data: { status: 'RUNNING', startedAt: new Date() } })

    // Get next batch of QUEUED messages (database-driven queue — no Redis)
    const queuedMessages = await prisma.message.findMany({
      where: {
        campaignId: id,
        status: 'QUEUED',
        direction: 'OUTBOUND',
      },
      take: campaign.batchSize,
      include: { lead: true },
      orderBy: { queuedAt: 'asc' },
    })

    if (queuedMessages.length === 0) {
      // Campaign is complete
      await prisma.campaign.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      })
      await prisma.activityLog.create({
        data: {
          userId: session.userId,
          campaignId: id,
          eventType: 'CAMPAIGN_COMPLETED',
          description: `Campaign completed: "${campaign.name}"`,
        },
      })
      return successResponse({ processed: 0, status: 'completed' })
    }

    // Decrypt access token for WhatsApp API — never exposed to client
    const accessToken = decrypt(campaign.whatsappAccount.accessTokenEncrypted)
    const phoneNumberId = campaign.whatsappAccount.phoneNumberId

    let processed = 0
    let failed = 0

    for (const msg of queuedMessages) {
      try {
        // Re-check campaign status (may have been paused)
        const current = await prisma.campaign.findUnique({ where: { id }, select: { status: true } })
        if (current?.status === 'PAUSED' || current?.status === 'CANCELLED') {
          break
        }

        // Mark as sending
        await prisma.message.update({ where: { id: msg.id }, data: { status: 'SENDING', sendingAt: new Date() } })

        // Send via WhatsApp Business API — server-side only
        const waResponse = await fetch(
          `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: msg.lead.phoneNumber,
              type: 'text',
              text: { body: msg.renderedBody ?? '' },
            }),
          }
        )

        const waJson = await waResponse.json()

        if (waResponse.ok && waJson.messages?.[0]?.id) {
          const waMessageId = waJson.messages[0].id
          await prisma.message.update({
            where: { id: msg.id },
            data: { status: 'SENT', whatsappMessageId: waMessageId, sentAt: new Date() },
          })
          await prisma.campaignLead.update({
            where: { id: msg.campaignLeadId ?? '' },
            data: { status: 'SENT', processedAt: new Date() },
          })
          await prisma.messageEvent.create({
            data: { messageId: msg.id, eventType: 'sent', eventPayloadJson: waJson, occurredAt: new Date() },
          })
          await prisma.campaign.update({ where: { id }, data: { totalSent: { increment: 1 } } })
          await prisma.lead.update({ where: { id: msg.leadId }, data: { status: 'CONTACTED' } })
          processed++
        } else {
          const failureReason = waJson.error?.message ?? 'WhatsApp API error'
          await prisma.message.update({
            where: { id: msg.id },
            data: { status: 'FAILED', failureReason, retryCount: { increment: 1 }, lastRetryAt: new Date() },
          })
          await prisma.campaign.update({ where: { id }, data: { totalFailed: { increment: 1 } } })
          failed++
        }

        // Rate limiting — respect batch delay
        if (campaign.delayInSeconds > 0) {
          await new Promise((resolve) => setTimeout(resolve, campaign.delayInSeconds * 1000))
        }
      } catch (msgErr) {
        console.error(`Failed to send message ${msg.id}:`, msgErr)
        await prisma.message.update({
          where: { id: msg.id },
          data: { status: 'FAILED', failureReason: 'Internal execution error', retryCount: { increment: 1 } },
        })
        failed++
      }
    }

    return successResponse({ processed, failed, status: 'batch_complete' })
  } catch (err) {
    return serverErrorResponse(err)
  }
}
