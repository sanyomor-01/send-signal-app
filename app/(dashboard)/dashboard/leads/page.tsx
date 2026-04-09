import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, EMPTY_STATES } from '@/components/ui/EmptyState'

export const metadata: Metadata = { title: 'Leads' }

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const session = await getSession()
  if (!session) return null

  const { page: pageStr, search = '', status = '' } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const pageSize = 25
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { userId: session.userId, deletedAt: null }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (status) where.status = status

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where, skip, take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { tagAssignments: { include: { tag: { select: { id: true, name: true, color: true } } } } },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div style={{ padding: '2rem', maxWidth: '80rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.25rem' }}>Leads</h1>
          <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
            {total.toLocaleString()} total leads
          </p>
        </div>
        <Link href="/dashboard/leads/import" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
            border: 'none', cursor: 'pointer',
            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
            fontSize: 'var(--font-label-large-size)', fontWeight: 500,
          }}>
            + Import leads
          </button>
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name, phone, email..."
          style={{
            flex: 1, padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
            border: '1.5px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)',
            fontSize: 'var(--font-body-medium-size)', fontFamily: 'inherit',
          }}
        />
        <select
          name="status"
          defaultValue={status}
          style={{
            padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
            border: '1.5px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)',
            fontSize: 'var(--font-body-medium-size)', fontFamily: 'inherit',
          }}
        >
          <option value="">All statuses</option>
          {['NEW', 'CONTACTED', 'REPLIED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED'].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <button type="submit" style={{
          padding: '0.5rem 1rem', borderRadius: '0.5rem',
          border: '1.5px solid var(--color-outline-variant)',
          backgroundColor: 'var(--color-surface-container)', cursor: 'pointer',
          fontSize: 'var(--font-label-large-size)', fontFamily: 'inherit', color: 'var(--color-on-surface)',
        }}>Filter</button>
      </form>

      {/* Table */}
      <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        {leads.length === 0 ? (
          <EmptyState
            {...EMPTY_STATES.leads}
            action={{ label: 'Import leads', href: '/dashboard/leads/import' }}
          />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body-medium-size)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container)' }}>
                    {['Name', 'Phone', 'Email', 'Status', 'Tags', 'Opt-in', 'Added'].map((h) => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem', textAlign: 'left',
                        fontWeight: 600, color: 'var(--color-on-surface-variant)',
                        fontSize: 'var(--font-label-large-size)',
                        borderBottom: '1px solid var(--color-outline-variant)',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead.id} style={{ borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/dashboard/leads/${lead.id}`} style={{ textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 500 }}>
                          {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {lead.phoneNumber}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)' }}>
                        {lead.email || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Badge status={lead.status} size="sm" />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {lead.tagAssignments.map((ta) => (
                            <span key={ta.tag.id} style={{
                              padding: '0.15rem 0.5rem', borderRadius: '999px',
                              backgroundColor: 'var(--color-surface-container-high)',
                              color: 'var(--color-on-surface-variant)',
                              fontSize: 'var(--font-label-small-size)', fontWeight: 500,
                            }}>{ta.tag.name}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: lead.optIn ? 'var(--color-success)' : 'var(--color-on-surface-variant)' }}>
                        {lead.optIn ? '✓ Yes' : 'No'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid var(--color-outline-variant)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)',
              }}>
                <span>Page {page} of {totalPages} ({total.toLocaleString()} total)</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {page > 1 && (
                    <Link href={`?page=${page - 1}&search=${search}&status=${status}`} style={{
                      padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                      border: '1px solid var(--color-outline-variant)',
                      textDecoration: 'none', color: 'var(--color-on-surface)',
                      fontSize: 'var(--font-label-medium-size)',
                    }}>← Prev</Link>
                  )}
                  {page < totalPages && (
                    <Link href={`?page=${page + 1}&search=${search}&status=${status}`} style={{
                      padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                      border: '1px solid var(--color-outline-variant)',
                      textDecoration: 'none', color: 'var(--color-on-surface)',
                      fontSize: 'var(--font-label-medium-size)',
                    }}>Next →</Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
