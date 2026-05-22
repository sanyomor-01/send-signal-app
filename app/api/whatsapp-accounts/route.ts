import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'
import { getConfiguredAppUrl } from '@/lib/webhooks'
import { consumeRateLimit, getClientIp } from '@/lib/rate-limit'
import { z } from 'zod'
import * as crypto from 'crypto'

const ALLOW_META_MOCKS = process.env.NODE_ENV !== 'production' && process.env.ALLOW_META_MOCKS === 'true'

// POST /api/whatsapp-accounts — validate token (no auth) OR create account (auth required)
export async function POST(request: NextRequest) {
  // Parse body once
  const body = await request.json()
  const { accessToken, _validateOnly, accountName, phoneNumberId, businessAccountId, displayPhoneNumber, webhookVerifyToken } = body

  const session = await getSession()
  if (!session) return unauthorizedResponse()

  // Validate-only request (no auth required)
  if (_validateOnly && accessToken) {
    const ip = getClientIp(request.headers)
    const limited = consumeRateLimit(`wa-validate:${ip}:${session.userId}`, { limit: 10, windowMs: 15 * 60 * 1000 })
    if (!limited.allowed) {
      return errorResponse(`Too many validation attempts. Try again in ${limited.retryAfterSeconds} seconds.`, 429)
    }

    // DEV MODE: Allow mock token for testing without Meta API
    if (ALLOW_META_MOCKS && accessToken === 'DEV_TEST_TOKEN_2024') {
      return successResponse({
        phoneNumbers: [
          {
            phoneNumberId: 'PN_TEST_001',
            displayPhoneNumber: '+1 555-0123',
            verifiedName: "Test Business",
            businessAccountId: 'WABA_TEST_001'
          },
          {
            phoneNumberId: 'PN_TEST_002',
            displayPhoneNumber: '+1 555-0456',
            verifiedName: "Test Business 2",
            businessAccountId: 'WABA_TEST_001'
          }
        ]
      })
    }

    try {
      const wabaRes = await fetch('https://graph.facebook.com/v20.0/me/whatsapp_business_accounts', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const wabaData = await wabaRes.json()
      
      if (!wabaRes.ok) {
        return errorResponse(wabaData.error?.message || 'Invalid Token. Please check your Meta Business permissions.', 401)
      }

      interface MetaPhoneNumber {
        id: string
        display_phone_number: string
        verified_name: string
      }

      interface DiscoveryPhoneNumber {
        phoneNumberId: string
        displayPhoneNumber: string
        verifiedName: string
        businessAccountId: string
      }

      const phoneNumbers: DiscoveryPhoneNumber[] = []

      for (const waba of (wabaData.data as { id: string }[])) {
        const phoneRes = await fetch(`https://graph.facebook.com/v20.0/${waba.id}/phone_numbers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const phoneData = await phoneRes.json()
        
        if (phoneRes.ok) {
          (phoneData.data as MetaPhoneNumber[]).forEach((p) => {
            phoneNumbers.push({
              phoneNumberId: p.id,
              displayPhoneNumber: p.display_phone_number,
              verifiedName: p.verified_name,
              businessAccountId: waba.id,
            })
          })
        }
      }

      return successResponse({ phoneNumbers })
    } catch (err) {
      return serverErrorResponse(err)
    }
  }

  // Account creation (requires auth)
  // Validate required fields for account creation
  const schema = z.object({
    accountName: z.string().min(1, 'Account name required'),
    phoneNumberId: z.string().min(1, 'Phone Number ID required'),
    businessAccountId: z.string().min(1, 'Business Account ID required'),
    accessToken: z.string().min(1, 'Access token required'),
    displayPhoneNumber: z.string().optional(),
    webhookVerifyToken: z.string().optional(),
  })

  const result = schema.safeParse({ accountName, phoneNumberId, businessAccountId, accessToken, displayPhoneNumber, webhookVerifyToken })
  if (!result.success) return errorResponse('Validation failed', 400, result.error.flatten())

  const { accountName: name, phoneNumberId: pnId, businessAccountId: baId, accessToken: token, displayPhoneNumber: dpn, webhookVerifyToken: wvt } = result.data

  // DEV MODE: Skip Meta API call and create mock account
  const isDevMock = ALLOW_META_MOCKS && token === 'DEV_TEST_TOKEN_2024'

  try {
    const existing = await prisma.whatsappAccount.findUnique({
      where: { phoneNumberId: pnId }
    })

    let account;
    let actualVerifyToken = '';

    if (existing) {
      if (existing.userId !== session.userId) {
        return errorResponse('A WhatsApp account with this Phone Number ID is already connected to another user', 409)
      }

      // Reuse the existing verify token so they don't have to change it in the Meta Developer portal
      if (existing.webhookVerifyTokenEncrypted) {
        try {
          actualVerifyToken = decrypt(existing.webhookVerifyTokenEncrypted)
        } catch {
          actualVerifyToken = isDevMock ? 'dev_verify_token_12345678' : (wvt || crypto.randomBytes(8).toString('hex'))
        }
      } else {
        actualVerifyToken = isDevMock ? 'dev_verify_token_12345678' : (wvt || crypto.randomBytes(8).toString('hex'))
      }

      const accessTokenEncrypted = isDevMock ? 'dev_encrypted_token' : encrypt(token)
      const webhookVerifyTokenEncrypted = encrypt(actualVerifyToken)

      account = await prisma.whatsappAccount.update({
        where: { phoneNumberId: pnId },
        data: {
          accountName: name,
          businessAccountId: baId,
          accessTokenEncrypted,
          webhookVerifyTokenEncrypted,
          displayPhoneNumber: dpn,
          isActive: true,
        },
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
    } else {
      actualVerifyToken = isDevMock ? 'dev_verify_token_12345678' : (wvt || crypto.randomBytes(8).toString('hex'))
      const accessTokenEncrypted = isDevMock ? 'dev_encrypted_token' : encrypt(token)
      const webhookVerifyTokenEncrypted = encrypt(actualVerifyToken)

      account = await prisma.whatsappAccount.create({
        data: {
          userId: session.userId,
          accountName: name,
          phoneNumberId: pnId,
          businessAccountId: baId,
          accessTokenEncrypted,
          webhookVerifyTokenEncrypted,
          displayPhoneNumber: dpn,
        },
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
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (user && (!user.companyName || user.companyName === 'My Company')) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { companyName: name }
      })
    }

    const callbackUrl = `${getConfiguredAppUrl()}/api/webhooks/whatsapp/${session.userId}`

    return successResponse({ 
      account: { ...account, userId: session.userId }, 
      webhookVerifyToken: actualVerifyToken,
      callbackUrl
    }, 'WhatsApp account connected', existing ? 200 : 201)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return errorResponse('A WhatsApp account with this Phone Number ID is already connected', 409)
    }
    return serverErrorResponse(err)
  }
}

// GET /api/whatsapp-accounts — list accounts
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
    },
  })

  return successResponse(accounts)
}
