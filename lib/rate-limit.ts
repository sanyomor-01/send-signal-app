type Bucket = {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as {
  sendSignalRateLimitBuckets?: Map<string, Bucket>
}

const buckets = globalForRateLimit.sendSignalRateLimitBuckets ?? new Map<string, Bucket>()
globalForRateLimit.sendSignalRateLimitBuckets = buckets

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || headers.get('x-real-ip') || 'unknown'
}

export function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true }
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  return { allowed: true }
}
