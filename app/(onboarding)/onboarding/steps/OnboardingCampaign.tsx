'use client'

import { useState } from 'react'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { OnboardingData } from '../page'

interface Props {
  data: OnboardingData
  onNext: (data?: Partial<OnboardingData>) => void
  onBack: () => void
}

export function OnboardingCampaign({ data, onNext, onBack }: Props) {
  const [name, setName] = useState('My first campaign')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const recipientCount = data.importedLeadIds?.length ?? 0

  const canLaunch = !!(data.whatsappAccountId && data.templateId && recipientCount > 0)

  const handleLaunch = async () => {
    setConfirmOpen(false)
    setLoading(true)
    setError(null)
    const controller = new AbortController()

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name,
          whatsappAccountId: data.whatsappAccountId,
          templateId: data.templateId,
          leadIds: data.importedLeadIds,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to create campaign')
        return
      }
      onNext({ campaignId: json.data.id })
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

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
        <h1 style={{
          fontSize: 'var(--font-headline-medium-size)',
          fontWeight: 'var(--font-headline-medium-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          Welcome to Send Signal
        </h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <OnboardingProgress stepIndex={5} />
        </div>

        <h3 style={{
          fontSize: 'var(--font-title-large-size)',
          fontWeight: 'var(--font-title-large-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          Launch your first campaign
        </h3>
        <p style={{ fontSize: 'var(--font-body-medium-reg-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          Review your setup and confirm before sending.
        </p>

        {/* Summary */}
        <div style={{
          borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)',
          overflow: 'hidden', marginBottom: '1.5rem',
        }}>
          {[
            { label: 'WhatsApp account', value: data.whatsappAccountId ? '✅ Connected' : '⚠️ Not set', ok: !!data.whatsappAccountId },
            { label: 'Template', value: data.templateId ? '✅ Ready' : '⚠️ Not set', ok: !!data.templateId },
            { label: 'Recipients', value: recipientCount > 0 ? `${recipientCount} leads` : '⚠️ No leads', ok: recipientCount > 0 },
          ].map(({ label, value, ok }, i) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.875rem 1rem',
              borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : 'none',
              backgroundColor: 'var(--color-surface)',
            }}>
              <span style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>{label}</span>
              <span style={{ fontSize: 'var(--font-body-medium-size)', fontWeight: 600, color: ok ? 'var(--color-success)' : 'var(--color-warning)' }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <FormField id="campaign-name" label="Campaign name" required>
            <Input id="campaign-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" required />
          </FormField>
        </div>

        {error && (
          <p style={{ color: 'var(--color-error)', fontSize: 'var(--font-body-medium-size)', marginBottom: '1rem' }}>{error}</p>
        )}

        {!canLaunch && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.5rem',
            backgroundColor: 'var(--color-warning-container)',
            color: 'var(--color-on-warning-container)',
            fontSize: 'var(--font-body-medium-size)',
            marginBottom: '1rem',
          }}>
            Complete the previous steps before launching a campaign.
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Button id="campaign-back-btn" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          id="campaign-launch-btn"
          variant="primary"
          disabled={!canLaunch}
          loading={loading}
          onClick={() => setConfirmOpen(true)}
        >
          Launch campaign
        </Button>
      </div>

      {/* Safety confirmation dialog — required by skills.md */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleLaunch}
        title="Confirm campaign launch"
        description={`You are about to send messages to ${recipientCount} lead${recipientCount === 1 ? '' : 's'}. This action cannot be undone. Are you sure?`}
        confirmLabel={`Send to ${recipientCount} leads`}
        variant="primary"
        loading={loading}
      />
    </div>
  )
}
