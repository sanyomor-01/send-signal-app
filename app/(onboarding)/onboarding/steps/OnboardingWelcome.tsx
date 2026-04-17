import { Button } from '@/components/ui/Button'

interface Props {
  onNext: () => void
}

const TOTAL_STEPS = 5

export function OnboardingWelcome({ onNext }: Props) {
  return (
    <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'left' }}>

      <h1 style={{
        fontSize: 'var(--font-headline-medium-size)',
        fontWeight: 'var(--font-headline-medium-weight)',
        color: 'var(--color-on-surface)',
        margin: '0 0 1rem',
        lineHeight: 1.2,
      }}>
        Welcome to Send Signal
      </h1>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        width: '100%',
      }}>
        {Array.from({ length: TOTAL_STEPS + 1 }, (_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Circle with number */}
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: i === 0 ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              border: i === 0 ? 'none' : '1px solid var(--color-outline-variant)',
            }}>
              {i}
            </div>
            {/* Connecting line (except after last circle) */}
            {i < TOTAL_STEPS && (
              <div style={{
                width: '2rem',
                height: '2px',
                backgroundColor: 'var(--color-outline-variant)',
              }} />
            )}
          </div>
        ))}
      </div>

      <h3 style={{
        fontSize: 'var(--font-title-large-size)',
        fontWeight: 'var(--font-title-large-weight)',
        color: 'var(--color-on-surface-variant)',
        margin: '0 0 1rem',
        lineHeight: 1.2,
      }}>
        Let&apos;s get you set up
      </h3>
      <p style={{
        fontSize: 'var(--font-body-medium-reg-size)',
        color: 'var(--color-on-surface-variant)',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
      }}>
        We&apos;ll guide you through connecting your account,
        importing leads, creating message templates, and launching your first campaign.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1rem', marginBottom: '2.5rem', textAlign: 'left',
      }}>
        {[
          { title: 'Import leads', desc: 'Bring in contacts from a CSV file' },
          { title: 'Create templates', desc: 'Build reusable messages with placeholders' },
          { title: 'Launch campaigns', desc: 'Send personalized messages at scale' },
          { title: 'Track results', desc: 'Monitor delivery, reads & replies' },
        ].map(({ title, desc }) => (
          <div key={title} style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--font-title-small-size)', color: 'var(--color-on-surface)', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>{desc}</div>
          </div>
        ))}
      </div>

      <Button id="onboarding-welcome-next" variant="primary" size="lg" onClick={onNext}>
        Next →
      </Button>
    </div>
  )
}
