import type { Metadata } from 'next'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, EMPTY_STATES } from '@/components/ui/EmptyState'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; direction?: string }>
}) {
  const session = await getSession()
  if (!session) return null

  const { page: pageStr, status = '', direction = '' } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const pageSize = 30
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { userId: session.userId }
  if (status) where.status = status
  if (direction) where.direction = direction

  const [total, messages] = await Promise.all([
    prisma.message.count({ where }),
    prisma.message.findMany({
      where, skip, take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { firstName: true, lastName: true, phoneNumber: true } },
        campaign: { select: { name: true } },
      },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div style={{ padding: '2rem', maxWidth: '80rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.25rem' }}>Messages</h1>
        <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>{total.toLocaleString()} total messages</p>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select name="status" defaultValue={status} style={{ padding: '0.5rem 0.875rem', borderRadius: '0.5rem', border: '1.5px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: 'var(--font-body-medium-size)', fontFamily: 'inherit' }}>
          <option value="">All statuses</option>
          {['QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'READ', 'REPLIED', 'FAILED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="direction" defaultValue={direction} style={{ padding: '0.5rem 0.875rem', borderRadius: '0.5rem', border: '1.5px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: 'var(--font-body-medium-size)', fontFamily: 'inherit' }}>
          <option value="">Both directions</option>
          <option value="OUTBOUND">Outbound</option>
          <option value="INBOUND">Inbound</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1.5px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container)', cursor: 'pointer', fontSize: 'var(--font-label-large-size)', fontFamily: 'inherit', color: 'var(--color-on-surface)' }}>Filter</button>
      </form>

      <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        {messages.length === 0 ? (
          <EmptyState {...EMPTY_STATES.messages} />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body-medium-size)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container)' }}>
                    {['Lead', 'Direction', 'Status', 'Campaign', 'Message', 'Sent at'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-large-size)', borderBottom: '1px solid var(--color-outline-variant)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr key={m.id} style={{ borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/dashboard/leads/${m.leadId}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                          {[m.lead.firstName, m.lead.lastName].filter(Boolean).join(' ') || m.lead.phoneNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: 'var(--font-label-medium-size)', color: m.direction === 'OUTBOUND' ? 'var(--color-primary)' : 'var(--color-success)', fontWeight: 600 }}>
                          {m.direction === 'OUTBOUND' ? '↑ Out' : '↓ In'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}><Badge status={m.status} size="sm" /></td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)' }}>{m.campaign?.name ?? '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)', maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.renderedBody ?? '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap' }}>
                        {m.sentAt ? new Date(m.sentAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
                <span>Page {page} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {page > 1 && <Link href={`?page=${page - 1}&status=${status}&direction=${direction}`} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-outline-variant)', textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: 'var(--font-label-medium-size)' }}>← Prev</Link>}
                  {page < totalPages && <Link href={`?page=${page + 1}&status=${status}&direction=${direction}`} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-outline-variant)', textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: 'var(--font-label-medium-size)' }}>Next →</Link>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
