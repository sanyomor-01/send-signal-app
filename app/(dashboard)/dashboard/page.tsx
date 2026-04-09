import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const [totalLeads, totalCampaigns, recentLogs, activeCampaigns] = await Promise.all([
    prisma.lead.count({ where: { userId: session.userId, deletedAt: null } }),
    prisma.campaign.count({ where: { userId: session.userId, deletedAt: null } }),
    prisma.activityLog.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { lead: { select: { firstName: true, lastName: true, phoneNumber: true } } },
    }),
    prisma.campaign.findMany({
      where: { userId: session.userId, status: { in: ['RUNNING', 'SCHEDULED', 'PAUSED'] } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, name: true, status: true, totalSent: true, totalRecipients: true },
    }),
  ])

  const totalMessagesSent = await prisma.message.count({
    where: { userId: session.userId, direction: 'OUTBOUND', status: { in: ['SENT', 'DELIVERED', 'READ'] } },
  })

  const statCards = [
    { label: 'Total leads', value: totalLeads.toLocaleString(), icon: '👥', href: '/dashboard/leads' },
    { label: 'Campaigns', value: totalCampaigns.toLocaleString(), icon: '📢', href: '/dashboard/campaigns' },
    { label: 'Messages sent', value: totalMessagesSent.toLocaleString(), icon: '💬', href: '/dashboard/messages' },
    { label: 'Active campaigns', value: activeCampaigns.length.toString(), icon: '🚀', href: '/dashboard/campaigns' },
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      <h1 style={{
        fontSize: 'var(--font-headline-large-size)',
        fontWeight: 'var(--font-headline-large-weight)',
        color: 'var(--color-on-surface)',
        margin: '0 0 0.5rem',
      }}>
        Dashboard
      </h1>
      <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 2rem' }}>
        Welcome back! Here&apos;s an overview of your activity.
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(({ label, value, icon, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(255,91,4,0.1)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-outline-variant)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
              <div style={{
                fontSize: 'var(--font-headline-small-size)',
                fontWeight: 700,
                color: 'var(--color-on-surface)',
                lineHeight: 1,
                marginBottom: '0.375rem',
              }}>{value}</div>
              <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Active campaigns */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'var(--font-title-large-size)', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>Active campaigns</h2>
            <Link href="/dashboard/campaigns" style={{ fontSize: 'var(--font-label-large-size)', color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{
            borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)', overflow: 'hidden',
          }}>
            {activeCampaigns.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-medium-size)' }}>
                No active campaigns
              </div>
            ) : (
              activeCampaigns.map((c, i) => (
                <div key={c.id} style={{
                  padding: '0.875rem 1rem',
                  borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>
                      {c.totalSent}/{c.totalRecipients} sent
                    </p>
                  </div>
                  <Badge status={c.status} size="sm" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'var(--font-title-large-size)', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>Recent activity</h2>
          </div>
          <div style={{
            borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)', overflow: 'hidden',
          }}>
            {recentLogs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-medium-size)' }}>
                No activity yet
              </div>
            ) : (
              recentLogs.map((log, i) => (
                <div key={log.id} style={{
                  padding: '0.875rem 1rem',
                  borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none',
                }}>
                  <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface)' }}>{log.description}</p>
                  <p style={{ margin: 0, fontSize: 'var(--font-label-small-size)', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
