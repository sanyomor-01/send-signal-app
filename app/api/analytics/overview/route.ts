import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - 6)

    const messages = await prisma.message.findMany({
      where: {
        userId: session.userId,
        direction: 'OUTBOUND',
        createdAt: { gte: start },
      },
      select: {
        createdAt: true,
        status: true,
      },
    })

    const buckets = new Map<string, { date: string; sent: number; delivered: number; replied: number }>()
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      buckets.set(key, {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sent: 0,
        delivered: 0,
        replied: 0,
      })
    }

    for (const message of messages) {
      const key = message.createdAt.toISOString().slice(0, 10)
      const bucket = buckets.get(key)
      if (!bucket) continue
      if (['SENT', 'DELIVERED', 'READ', 'REPLIED'].includes(message.status)) bucket.sent += 1
      if (['DELIVERED', 'READ', 'REPLIED'].includes(message.status)) bucket.delivered += 1
      if (message.status === 'REPLIED') bucket.replied += 1
    }

    return successResponse({ points: [...buckets.values()] })
  } catch (err) {
    return serverErrorResponse(err)
  }
}
