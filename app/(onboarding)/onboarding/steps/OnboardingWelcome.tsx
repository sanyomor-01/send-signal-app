import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'

interface Props {
  onNext: () => void
  onBack?: () => void
}

export function OnboardingWelcome({ onNext }: Props) {
  return (
    <div style={{ 
      maxWidth: '36rem', 
      width: '100%', 
      textAlign: 'left', 
      minHeight: '34rem', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '2rem',
      borderRadius: '1rem',
      border: '1px solid var(--color-outline-variant)',
      backgroundColor: 'var(--color-surface)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h1 style={{
            fontSize: 'var(--font-headline-medium-size)',
            fontWeight: 'var(--font-headline-medium-weight)',
            color: 'var(--color-on-surface)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Welcome to Send Signal
          </h1>
        </div>

         <div style={{ marginBottom: '1.5rem' }}>
          <OnboardingProgress stepIndex={1} />
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
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-outline-variant)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontWeight: 600, fontSize: 'var(--font-title-small-size)', color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}>{title}</div>
              <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-low)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
        <Button id="onboarding-welcome-back" variant="secondary" size="md" disabled>
          Back
        </Button>
        <Button id="onboarding-welcome-next" variant="primary" size="md" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
