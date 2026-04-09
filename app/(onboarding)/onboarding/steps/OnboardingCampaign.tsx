'use client'

import { useState } from 'react'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { OnboardingData } from '../page'

interface Props {
  data: OnboardingData
  onNext: (data?: Partial<OnboardingData>) => void
}

export function OnboardingCampaign({ data, onNext }: Props) {
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
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div style={{ maxWidth: '30rem', width: '100%' }}>
      <h2 style={{ fontSize: 'var(--font-headline-medium-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.5rem' }}>
        Launch your first campaign
      </h2>
      <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 2rem', lineHeight: 1.6 }}>
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

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button id="campaign-skip-btn" variant="secondary" onClick={() => onNext()}>Skip for now</Button>
        <Button
          id="campaign-launch-btn"
          variant="primary"
          fullWidth
          disabled={!canLaunch}
          loading={loading}
          onClick={() => setConfirmOpen(true)}
        >
          Launch campaign →
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
