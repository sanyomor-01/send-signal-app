'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', exact: true },
  { href: '/dashboard/leads', label: 'Leads', icon: '👥' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: '📢' },
  { href: '/dashboard/templates', label: 'Templates', icon: '📝' },
  { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
  { href: '/dashboard/conversations', label: 'Conversations', icon: '💭' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside style={{
      width: '15rem',
      flexShrink: 0,
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-outline-variant)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14" style={{ marginLeft: '2px' }}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--color-on-surface)', fontSize: 'var(--font-title-medium-size)' }}>
            Send Signal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.75rem 0.625rem' }} aria-label="Main navigation">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {NAV_ITEMS.map(({ href, label, icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: 'var(--font-body-medium-size)',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    backgroundColor: active ? 'var(--color-primary-container)' : 'transparent',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span style={{ fontSize: '1rem', width: '1.25rem', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
