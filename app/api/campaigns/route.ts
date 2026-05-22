import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderTemplate } from '@/lib/utils'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse, parsePagination, buildPaginatedResponse } from '@/lib/api'
import { z } from 'zod'

const CampaignStatusFilter = z.enum([
  'DRAFT',
  'SCHEDULED',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
])

// GET /api/campaigns
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const params = request.nextUrl.searchParams
  const { page, pageSize, skip } = parsePagination(params)
  const status = params.get('status') ?? ''

  if (status) {
    const parsedStatus = CampaignStatusFilter.safeParse(status)
    if (!parsedStatus.success) return errorResponse('Invalid campaign status filter', 400)
  }

  const where: Record<string, unknown> = { userId: session.userId, deletedAt: null }
  if (status) where.status = status

  const [total, campaigns] = await Promise.all([
    prisma.campaign.count({ where }),
    prisma.campaign.findMany({
      where, skip, take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: { template: { select: { name: true } }, whatsappAccount: { select: { displayPhoneNumber: true, accountName: true } } },
    }),
  ])

  return successResponse(buildPaginatedResponse(campaigns, total, page, pageSize))
}

// POST /api/campaigns - create campaign with idempotent lead enrollment
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await request.json()

    const schema = z.object({
      name: z.string().min(1, 'Name required'),
      whatsappAccountId: z.string().uuid(),
      templateId: z.string().uuid(),
      leadIds: z.array(z.string().uuid()).optional(),
      scheduledAt: z.string().datetime().optional(),
      batchSize: z.number().int().min(1).max(100).optional().default(10),
      delayInSeconds: z.number().int().min(1).optional().default(5),
      description: z.string().optional(),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const { name, whatsappAccountId, templateId, leadIds, scheduledAt, batchSize, delayInSeconds, description } = result.data

    const [account, template] = await Promise.all([
      prisma.whatsappAccount.findFirst({ where: { id: whatsappAccountId, userId: session.userId } }),
      prisma.template.findFirst({ where: { id: templateId, userId: session.userId, deletedAt: null, isArchived: false } }),
    ])

    if (!account) return errorResponse('WhatsApp account not found', 404)
    if (!template) return errorResponse('Template not found', 404)

    let eligibleLeads: Array<{ id: string }> = []
    if (leadIds && leadIds.length > 0) {
      eligibleLeads = await prisma.lead.findMany({
        where: {
          id: { in: leadIds },
          userId: session.userId,
          deletedAt: null,
          optIn: true,
          unsubscribed: false,
        },
        select: { id: true },
      })
    }

    const campaign = await prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          userId: session.userId,
          whatsappAccountId,
          templateId,
          name,
          description,
          status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          batchSize,
          delayInSeconds,
          totalRecipients: eligibleLeads.length,
        },
      })

      if (eligibleLeads.length > 0) {
        await tx.campaignLead.createMany({
          data: eligibleLeads.map((lead) => ({
            campaignId: campaign.id,
            leadId: lead.id,
            status: 'QUEUED',
          })),
          skipDuplicates: true,
        })

        const leads = await tx.lead.findMany({
          where: { id: { in: eligibleLeads.map((lead) => lead.id) } },
        })

        const campaignLeads = await tx.campaignLead.findMany({
          where: { campaignId: campaign.id },
        })
        const campaignLeadMap = new Map(campaignLeads.map((campaignLead) => [campaignLead.leadId, campaignLead.id]))

        await tx.message.createMany({
          data: leads.map((lead) => ({
            userId: session.userId,
            whatsappAccountId,
            campaignId: campaign.id,
            leadId: lead.id,
            campaignLeadId: campaignLeadMap.get(lead.id) ?? null,
            direction: 'OUTBOUND',
            status: 'QUEUED',
            templateSnapshot: { id: template.id, name: template.name, body: template.body },
            renderedBody: renderTemplate(template.body, {
              firstName: lead.firstName,
              lastName: lead.lastName,
              source: lead.source,
            }),
            queuedAt: new Date(),
          })),
          skipDuplicates: true,
        })

        await tx.campaign.update({
          where: { id: campaign.id },
          data: { totalQueued: eligibleLeads.length },
        })
      }

      await tx.activityLog.create({
        data: {
          userId: session.userId,
          campaignId: campaign.id,
          eventType: 'CAMPAIGN_CREATED',
          description: `Campaign created: "${name}" with ${eligibleLeads.length} recipients`,
        },
      })

      return tx.campaign.findUniqueOrThrow({ where: { id: campaign.id } })
    })

    return successResponse(campaign, 'Campaign created', 201)
  } catch (err) {
    return serverErrorResponse(err)
  }
}
