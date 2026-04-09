'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/(auth)/actions'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', exact: true },
  { href: '/dashboard/leads', label: 'Leads', icon: '👥' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: '📢' },
  { href: '/dashboard/templates', label: 'Templates', icon: '📝' },
  { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
  { href: '/dashboard/conversations', label: 'Conversations', icon: '💭' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
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
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', flexShrink: 0,
          }}>📡</div>
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

      {/* Bottom — settings & sign out */}
      <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid var(--color-outline-variant)' }}>
        <Link href="/dashboard/settings" style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.5rem 0.75rem', borderRadius: '0.5rem', textDecoration: 'none',
          fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)',
        }}>
          <span style={{ fontSize: '1rem', width: '1.25rem', textAlign: 'center' }}>⚙️</span>
          Settings
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1rem', width: '1.25rem', textAlign: 'center' }}>↩</span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
