import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Props {
  onBack?: () => void
}

export function OnboardingIntro(_props: Props) {
  const _unused = _props
  const sections = [
    { href: '/dashboard/leads', icon: '👥', title: 'Leads', desc: 'View, filter, and manage all your contacts' },
    { href: '/dashboard/campaigns', icon: '📢', title: 'Campaigns', desc: 'Create, monitor, and control message campaigns' },
    { href: '/dashboard/templates', icon: '📝', title: 'Templates', desc: 'Manage reusable message templates' },
    { href: '/dashboard/analytics', icon: '📊', title: 'Analytics', desc: 'Track delivery, read rates, and conversions' },
  ]

  return (
    <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'center' }}>
      <div style={{
        width: '4rem', height: '4rem', borderRadius: '50%',
        background: 'var(--color-success-container)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', margin: '0 auto 1.5rem',
      }}>🎉</div>

      <h2 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.75rem' }}>
        You&apos;re all set!
      </h2>
      <p style={{ fontSize: 'var(--font-body-large-reg-size)', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: '2rem' }}>
        Here&apos;s a quick overview of your dashboard.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '2rem', textAlign: 'left' }}>
        {sections.map(({ href, icon, title, desc }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.125rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(255,91,4,0.1)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-outline-variant)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-title-small-size)', color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>{title}</div>
              <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <Button id="onboarding-finish-btn" variant="primary" size="lg" fullWidth>
          Enter dashboard
        </Button>
      </Link>
    </div>
  )
}
