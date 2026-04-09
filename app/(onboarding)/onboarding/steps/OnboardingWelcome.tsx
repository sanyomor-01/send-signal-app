import { Button } from '@/components/ui/Button'

interface Props {
  onNext: () => void
}

export function OnboardingWelcome({ onNext }: Props) {
  return (
    <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'center' }}>
      <div style={{
        width: '5rem', height: '5rem', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary-container), var(--color-primary))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', margin: '0 auto 2rem',
      }}>📡</div>

      <h1 style={{
        fontSize: 'var(--font-display-small-size)',
        fontWeight: 'var(--font-display-small-weight)',
        color: 'var(--color-on-surface)',
        margin: '0 0 1rem',
        lineHeight: 1.2,
      }}>
        Welcome to Send Signal
      </h1>
      <p style={{
        fontSize: 'var(--font-body-large-reg-size)',
        color: 'var(--color-on-surface-variant)',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
      }}>
        We&apos;ll get you set up in just a few minutes. You&apos;ll connect your WhatsApp account,
        import your leads, create your first message template, and launch your first campaign.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1rem', marginBottom: '2.5rem', textAlign: 'left',
      }}>
        {[
          { icon: '📥', title: 'Import leads', desc: 'Bring in contacts from a CSV file' },
          { icon: '📝', title: 'Create templates', desc: 'Build reusable messages with placeholders' },
          { icon: '📢', title: 'Launch campaigns', desc: 'Send personalized messages at scale' },
          { icon: '📊', title: 'Track results', desc: 'Monitor delivery, reads & replies' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontWeight: 600, fontSize: 'var(--font-title-small-size)', color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>{desc}</div>
          </div>
        ))}
      </div>

      <Button id="onboarding-welcome-next" variant="primary" size="lg" onClick={onNext}>
        Let&apos;s get started →
      </Button>
    </div>
  )
}
