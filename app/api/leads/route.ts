import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizePhoneNumber } from '@/lib/utils'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse, parsePagination, buildPaginatedResponse } from '@/lib/api'
import { z } from 'zod'

// GET /api/leads — paginated, filtered list
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const params = request.nextUrl.searchParams
  const { page, pageSize, skip } = parsePagination(params)
  const search = params.get('search') ?? ''
  const status = params.get('status') ?? ''
  const tagId = params.get('tagId') ?? ''

  const where: Record<string, unknown> = {
    userId: session.userId,
    deletedAt: null,
  }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (status) where.status = status
  if (tagId) where.tagAssignments = { some: { tagId } }

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        tagAssignments: { include: { tag: { select: { id: true, name: true, color: true } } } },
      },
    }),
  ])

  return successResponse(buildPaginatedResponse(leads, total, page, pageSize))
}

// POST /api/leads — create single lead
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await request.json()

    const schema = z.object({
      phoneNumber: z.string().min(1, 'Phone number required'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      source: z.string().optional(),
      optIn: z.boolean().optional().default(false),
      notes: z.string().optional(),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const { phoneNumber: raw, ...rest } = result.data
    const phoneNumber = normalizePhoneNumber(raw)
    if (!phoneNumber) return errorResponse('Invalid phone number — must be a valid E.164 format', 422)

    const lead = await prisma.lead.create({
      data: { ...rest, phoneNumber, userId: session.userId },
    })

    return successResponse(lead, 'Lead created', 201)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return errorResponse('A lead with this phone number already exists', 409)
    }
    return serverErrorResponse(err)
  }
}
