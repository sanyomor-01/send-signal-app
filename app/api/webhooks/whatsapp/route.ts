import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse } from '@/lib/api'

export const runtime = 'nodejs'

// GET /api/webhooks/whatsapp - legacy Meta webhook verification.
// New WhatsApp account connections use the tenant-scoped callback URL.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const mode = params.get('hub.mode')
  const token = params.get('hub.verify_token')
  const challenge = params.get('hub.challenge')

  if (mode === 'subscribe') {
    const accounts = await prisma.whatsappAccount.findMany({
      where: { isActive: true },
      select: { id: true, webhookVerifyTokenEncrypted: true },
    })

    const { decrypt } = await import('@/lib/encryption')
    const matched = accounts.find((a) => {
      if (!a.webhookVerifyTokenEncrypted) return false
      try {
        return decrypt(a.webhookVerifyTokenEncrypted) === token
      } catch {
        return false
      }
    })

    if (matched) {
      return new Response(challenge, { status: 200 })
    }
  }

  return new Response('Forbidden', { status: 403 })
}

// POST /api/webhooks/whatsapp - disabled to avoid cross-tenant message attribution.
export async function POST() {
  return errorResponse(
    'Tenant-scoped webhook URL required. Use /api/webhooks/whatsapp/[userId].',
    410
  )
}
