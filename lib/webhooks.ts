import * as crypto from 'crypto'

export function verifyMetaWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.META_APP_SECRET
  if (!appSecret || appSecret.length < 16) {
    throw new Error('META_APP_SECRET must be set to verify WhatsApp webhooks')
  }

  if (!signatureHeader?.startsWith('sha256=')) return false

  const expected = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex')
  const provided = signatureHeader.slice('sha256='.length)

  const expectedBuffer = Buffer.from(expected, 'hex')
  const providedBuffer = Buffer.from(provided, 'hex')
  if (expectedBuffer.length !== providedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

export function getConfiguredAppUrl(): string {
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    throw new Error('APP_URL or NEXT_PUBLIC_APP_URL must be configured')
  }

  const parsed = new URL(appUrl)
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('APP_URL must use HTTPS in production')
  }

  return parsed.origin
}
