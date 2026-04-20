import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'
import { z } from 'zod'
import * as crypto from 'crypto'

// POST /api/whatsapp-accounts — validate token (no auth) OR create account (auth required)
export async function POST(request: NextRequest) {
  // Parse body once
  const body = await request.json()
  const { accessToken, _validateOnly, accountName, phoneNumberId, businessAccountId, displayPhoneNumber, webhookVerifyToken } = body

  // Validate-only request (no auth required)
  if (_validateOnly && accessToken) {
    // DEV MODE: Allow mock token for testing without Meta API
    if (accessToken === 'DEV_TEST_TOKEN_2024' || process.env.NODE_ENV === 'development') {
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
      const wabaRes = await fetch(`https://graph.facebook.com/v20.0/me/whatsapp_business_accounts?access_token=${accessToken}`)
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
        const phoneRes = await fetch(`https://graph.facebook.com/v20.0/${waba.id}/phone_numbers?access_token=${accessToken}`)
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
  const session = await getSession()
  if (!session) return unauthorizedResponse()

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
  const isDevMock = process.env.NODE_ENV === 'development' || token === 'DEV_TEST_TOKEN_2024'
  
  const actualVerifyToken = isDevMock ? 'dev_verify_token_12345678' : (wvt || crypto.randomBytes(8).toString('hex'))

  const accessTokenEncrypted = isDevMock ? 'dev_encrypted_token' : encrypt(token)
  const webhookVerifyTokenEncrypted = encrypt(actualVerifyToken)

  try {
    const account = await prisma.whatsappAccount.create({
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

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (user && (!user.companyName || user.companyName === 'My Company')) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { companyName: name }
      })
    }

    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host')
    const callbackUrl = `${protocol}://${host}/api/webhooks/whatsapp/${session.userId}`

    return successResponse({ 
      account: { ...account, userId: session.userId }, 
      webhookVerifyToken: actualVerifyToken,
      callbackUrl
    }, 'WhatsApp account connected', 201)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return errorResponse('A WhatsApp account with this Phone Number ID is already connected', 409)
    }
    return serverErrorResponse(err)
  }
}

// GET /api/whatsapp-accounts — list accounts
export async function GET(request: NextRequest) {
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