import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from '@/lib/api'
import { z } from 'zod'

// PATCH /api/campaigns/[id] — update campaign status (pause/resume/cancel)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params

  try {
    const body = await request.json()

    const schema = z.object({
      action: z.enum(['pause', 'resume', 'cancel']).optional(),
      name: z.string().optional(),
      description: z.string().optional(),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: session.userId, deletedAt: null },
    })
    if (!campaign) return notFoundResponse('Campaign')

    let newStatus = campaign.status
    let eventType: string | null = null

    if (result.data.action === 'pause') {
      if (campaign.status !== 'RUNNING') return errorResponse('Only running campaigns can be paused', 400)
      newStatus = 'PAUSED'
      eventType = 'CAMPAIGN_PAUSED'
    } else if (result.data.action === 'resume') {
      if (campaign.status !== 'PAUSED') return errorResponse('Only paused campaigns can be resumed', 400)
      newStatus = 'RUNNING'
    } else if (result.data.action === 'cancel') {
      if (['COMPLETED', 'CANCELLED', 'FAILED'].includes(campaign.status)) {
        return errorResponse('Campaign cannot be cancelled in its current state', 400)
      }
      newStatus = 'CANCELLED'
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        status: newStatus,
        ...(result.data.name ? { name: result.data.name } : {}),
        ...(result.data.description !== undefined ? { description: result.data.description } : {}),
      },
    })

    if (eventType) {
      await prisma.activityLog.create({
        data: {
          userId: session.userId,
          campaignId: id,
          eventType: eventType as 'CAMPAIGN_PAUSED',
          description: `Campaign ${result.data.action}d: "${campaign.name}"`,
        },
      })
    }

    return successResponse(updated)
  } catch (err) {
    return serverErrorResponse(err)
  }
}

// DELETE /api/campaigns/[id] — soft delete
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params
  const campaign = await prisma.campaign.findFirst({ where: { id, userId: session.userId, deletedAt: null } })
  if (!campaign) return notFoundResponse('Campaign')
  if (campaign.status === 'RUNNING') return errorResponse('Pause the campaign before deleting', 400)

  await prisma.campaign.update({ where: { id }, data: { deletedAt: new Date() } })
  return successResponse(null, 'Campaign deleted')
}

// GET /api/campaigns/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params
  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.userId, deletedAt: null },
    include: {
      template: { select: { name: true, body: true } },
      whatsappAccount: { select: { accountName: true, displayPhoneNumber: true } },
      campaignLeads: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { lead: { select: { firstName: true, lastName: true, phoneNumber: true } } },
      },
    },
  })

  if (!campaign) return notFoundResponse('Campaign')
  return successResponse(campaign)
}
