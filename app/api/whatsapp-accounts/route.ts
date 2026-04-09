import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'
import { z } from 'zod'

// POST /api/whatsapp-accounts — create connected WhatsApp account
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await request.json()

    const schema = z.object({
      accountName: z.string().min(1, 'Account name required'),
      phoneNumberId: z.string().min(1, 'Phone Number ID required'),
      businessAccountId: z.string().min(1, 'Business Account ID required'),
      accessToken: z.string().min(1, 'Access token required'),
      webhookVerifyToken: z.string().optional(),
    })

    const result = schema.safeParse(body)
    if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

    const { accountName, phoneNumberId, businessAccountId, accessToken, webhookVerifyToken } = result.data

    // Encrypt credentials before storage — never stored in plaintext
    const accessTokenEncrypted = encrypt(accessToken)
    const webhookVerifyTokenEncrypted = webhookVerifyToken ? encrypt(webhookVerifyToken) : null

    const account = await prisma.whatsappAccount.create({
      data: {
        userId: session.userId,
        accountName,
        phoneNumberId,
        businessAccountId,
        accessTokenEncrypted,
        ...(webhookVerifyTokenEncrypted ? { webhookVerifyTokenEncrypted } : {}),
      },
      // Return without sensitive fields
      select: {
        id: true,
        accountName: true,
        displayPhoneNumber: true,
        businessAccountId: true,
        phoneNumberId: true,
        isActive: true,
        createdAt: true,
      },
    })

    return successResponse(account, 'WhatsApp account connected', 201)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return errorResponse('A WhatsApp account with this Phone Number ID is already connected', 409)
    }
    return serverErrorResponse(err)
  }
}

// GET /api/whatsapp-accounts
export async function GET() {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  const accounts = await prisma.whatsappAccount.findMany({
    where: { userId: session.userId, isActive: true },
    select: {
      id: true,
      accountName: true,
      displayPhoneNumber: true,
      businessAccountId: true,
      phoneNumberId: true,
      isActive: true,
      createdAt: true,
      // Never return accessTokenEncrypted or webhookVerifyTokenEncrypted
    },
  })

  return successResponse(accounts)
}
