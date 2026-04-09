import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, EMPTY_STATES } from '@/components/ui/EmptyState'

export const metadata: Metadata = { title: 'Campaigns' }

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const session = await getSession()
  if (!session) return null

  const { page: pageStr, status = '' } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { userId: session.userId, deletedAt: null }
  if (status) where.status = status

  const [total, campaigns] = await Promise.all([
    prisma.campaign.count({ where }),
    prisma.campaign.findMany({
      where, skip, take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: { template: { select: { name: true } } },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div style={{ padding: '2rem', maxWidth: '80rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.25rem' }}>Campaigns</h1>
          <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>{total} campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/create" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
            fontSize: 'var(--font-label-large-size)', fontWeight: 500,
          }}>+ New campaign</button>
        </Link>
      </div>

      {/* Status filter */}
      <form method="GET" style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['', 'DRAFT', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            type="submit"
            name="status"
            value={s}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: '999px',
              border: `1.5px solid ${status === s ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
              backgroundColor: status === s ? 'var(--color-primary-container)' : 'var(--color-surface)',
              color: status === s ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              fontSize: 'var(--font-label-medium-size)', cursor: 'pointer', fontWeight: status === s ? 600 : 400,
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </form>

      <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        {campaigns.length === 0 ? (
          <EmptyState {...EMPTY_STATES.campaigns} action={{ label: 'Create campaign', href: '/dashboard/campaigns/create' }} />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body-medium-size)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container)' }}>
                    {['Campaign', 'Template', 'Status', 'Sent', 'Delivered', 'Read', 'Replied', 'Created'].map((h) => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem', textAlign: 'left',
                        fontWeight: 600, color: 'var(--color-on-surface-variant)',
                        fontSize: 'var(--font-label-large-size)',
                        borderBottom: '1px solid var(--color-outline-variant)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/dashboard/campaigns/${c.id}`} style={{ textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 500 }}>
                          {c.name}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)' }}>{c.template.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><Badge status={c.status} size="sm" /></td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)' }}>{c.totalSent}/{c.totalRecipients}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)' }}>{c.totalDelivered}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)' }}>{c.totalRead}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)' }}>{c.totalReplied}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
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
                  {page > 1 && <Link href={`?page=${page - 1}&status=${status}`} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-outline-variant)', textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: 'var(--font-label-medium-size)' }}>← Prev</Link>}
                  {page < totalPages && <Link href={`?page=${page + 1}&status=${status}`} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-outline-variant)', textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: 'var(--font-label-medium-size)' }}>Next →</Link>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
