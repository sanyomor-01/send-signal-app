import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { extractPlaceholders } from '@/lib/utils'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse, parsePagination, buildPaginatedResponse } from '@/lib/api'
import { z } from 'zod'

// GET /api/templates
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const params = request.nextUrl.searchParams
  const { page, pageSize, skip } = parsePagination(params)
  const includeArchived = params.get('archived') === 'true'

  const where = {
    userId: session.userId,
    deletedAt: null,
    ...(includeArchived ? {} : { isArchived: false }),
  }

  const [total, templates] = await Promise.all([
    prisma.template.count({ where }),
    prisma.template.findMany({ where, skip, take: pageSize, orderBy: { updatedAt: 'desc' } }),
  ])

  return successResponse(buildPaginatedResponse(templates, total, page, pageSize))
}

// POST /api/templates
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await request.json()

    const schema = z.object({
      name: z.string().min(1, 'Name is required').max(100),
      body: z.string().min(1, 'Message body is required'),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const { name, body: templateBody } = result.data

    // Extract and store placeholder schema
    const placeholders = extractPlaceholders(templateBody)
    const placeholderSchemaJson = { placeholders }

    const template = await prisma.template.create({
      data: {
        userId: session.userId,
        name,
        body: templateBody,
        placeholderSchemaJson,
        previewExampleJson: {
          firstName: 'Alex',
          lastName: 'Smith',
          fullName: 'Alex Smith',
          source: 'Instagram',
        },
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        eventType: 'TEMPLATE_CREATED',
        description: `Template created: "${name}"`,
      },
    })

    return successResponse(template, 'Template created', 201)
  } catch (err) {
    return serverErrorResponse(err)
  }
}
