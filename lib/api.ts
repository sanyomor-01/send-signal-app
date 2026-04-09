import { NextResponse } from 'next/server'

export type ApiSuccessResponse<T = unknown> = {
  success: true
  data: T
  message?: string
}

export type ApiErrorResponse = {
  success: false
  error: string
  details?: unknown
}

// ── Standardized response builders ───────────────

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, data, message } satisfies ApiSuccessResponse<T>,
    { status }
  )
}

export function errorResponse(
  error: string,
  status = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { success: false, error, details } satisfies ApiErrorResponse,
    { status }
  )
}

export function unauthorizedResponse(): NextResponse {
  return errorResponse('Unauthorized', 401)
}

export function notFoundResponse(resource = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404)
}

export function serverErrorResponse(err?: unknown): NextResponse {
  console.error('[Server Error]', err)
  return errorResponse('Internal server error', 500)
}

// ── Pagination helpers ────────────────────────────

export type PaginationParams = {
  page: number
  pageSize: number
  skip: number
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)))
  return { page, pageSize, skip: (page - 1) * pageSize }
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return {
    items: data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    },
  }
}
