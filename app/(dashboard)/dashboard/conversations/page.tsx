import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EmptyState, EMPTY_STATES } from '@/components/ui/EmptyState'

export const metadata: Metadata = { title: 'Conversations' }

export default async function ConversationsPage() {
  const session = await getSession()
  if (!session) return null

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.userId },
    orderBy: { lastMessageAt: 'desc' },
    take: 50,
    include: {
      lead: { select: { firstName: true, lastName: true, phoneNumber: true, status: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { body: true, direction: true, createdAt: true },
      },
    },
  })

  return (
    <div style={{ padding: '2rem', maxWidth: '50rem' }}>
      <h1 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 1.5rem' }}>Conversations</h1>

      <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        {conversations.length === 0 ? (
          <EmptyState {...EMPTY_STATES.conversations} />
        ) : (
          conversations.map((conv, i) => {
            const lastMsg = conv.messages[0]
            const leadData = conv.lead
            const name = [leadData.firstName, leadData.lastName].filter(Boolean).join(' ') || leadData.phoneNumber
            return (
              <Link key={conv.id} href={`/dashboard/conversations/${conv.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  cursor: 'pointer', transition: 'background-color 0.15s ease',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-container)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent' }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: 'var(--color-primary-container)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--font-title-small-size)',
                  }}>
                    {name[0]?.toUpperCase() ?? '?'}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-on-surface)', fontSize: 'var(--font-body-medium-size)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                      {conv.lastMessageAt && (
                        <span style={{ fontSize: 'var(--font-label-small-size)', color: 'var(--color-on-surface-variant)', flexShrink: 0, marginLeft: '0.5rem' }}>
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p style={{
                        margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {lastMsg.direction === 'OUTBOUND' ? 'You: ' : ''}{lastMsg.body ?? ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
