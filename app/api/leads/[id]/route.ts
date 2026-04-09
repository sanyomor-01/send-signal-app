import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizePhoneNumber } from '@/lib/utils'
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from '@/lib/api'
import { z } from 'zod'

// GET /api/leads/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params
  const lead = await prisma.lead.findFirst({
    where: { id, userId: session.userId, deletedAt: null },
    include: {
      tagAssignments: { include: { tag: true } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      messages: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  if (!lead) return notFoundResponse('Lead')
  return successResponse(lead)
}

// PATCH /api/leads/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params

  try {
    const body = await request.json()

    const schema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      phoneNumber: z.string().optional(),
      source: z.string().optional(),
      optIn: z.boolean().optional(),
      notes: z.string().optional(),
      status: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED']).optional(),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const data: Record<string, unknown> = { ...result.data }

    if (data.phoneNumber) {
      const normalized = normalizePhoneNumber(data.phoneNumber as string)
      if (!normalized) return errorResponse('Invalid phone number', 422)
      data.phoneNumber = normalized
    }

    const existing = await prisma.lead.findFirst({ where: { id, userId: session.userId, deletedAt: null } })
    if (!existing) return notFoundResponse('Lead')

    const lead = await prisma.lead.update({ where: { id }, data })
    return successResponse(lead)
  } catch (err) {
    return serverErrorResponse(err)
  }
}

// DELETE /api/leads/[id] — soft delete
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const { id } = await params
  const existing = await prisma.lead.findFirst({ where: { id, userId: session.userId, deletedAt: null } })
  if (!existing) return notFoundResponse('Lead')

  await prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } })
  return successResponse(null, 'Lead deleted')
}
