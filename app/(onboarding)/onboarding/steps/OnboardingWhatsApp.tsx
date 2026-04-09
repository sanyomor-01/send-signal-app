'use client'

import { useState } from 'react'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface Props {
  onNext: (data?: Partial<OnboardingData>) => void
}

export function OnboardingWhatsApp({ onNext }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState({
    accountName: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    webhookVerifyToken: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to connect account')
        return
      }
      onNext({ whatsappAccountId: json.data.id })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '30rem', width: '100%' }}>
      <h2 style={{ fontSize: 'var(--font-headline-medium-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.5rem' }}>
        Connect your WhatsApp account
      </h2>
      <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 2rem', lineHeight: 1.6 }}>
        Enter your WhatsApp Business API credentials. These are stored securely and never exposed to the browser.
      </p>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--color-error-container)',
          color: 'var(--color-on-error-container)',
          fontSize: 'var(--font-body-medium-size)',
          marginBottom: '1rem',
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormField id="accountName" label="Account display name" required>
          <Input id="accountName" name="accountName" value={fields.accountName} onChange={handleChange} placeholder="My Business" required />
        </FormField>

        <FormField id="phoneNumberId" label="Phone Number ID" required hint="Found in your Meta Business Manager">
          <Input id="phoneNumberId" name="phoneNumberId" value={fields.phoneNumberId} onChange={handleChange} placeholder="1234567890" required />
        </FormField>

        <FormField id="businessAccountId" label="WhatsApp Business Account ID" required>
          <Input id="businessAccountId" name="businessAccountId" value={fields.businessAccountId} onChange={handleChange} placeholder="9876543210" required />
        </FormField>

        <FormField id="accessToken" label="Permanent access token" required hint="Never shared with the browser">
          <Input id="accessToken" name="accessToken" value={fields.accessToken} onChange={handleChange} type="password" placeholder="EAABw..." required />
        </FormField>

        <FormField id="webhookVerifyToken" label="Webhook verify token" hint="Optional — for receiving delivery receipts">
          <Input id="webhookVerifyToken" name="webhookVerifyToken" value={fields.webhookVerifyToken} onChange={handleChange} placeholder="my-secret-token" />
        </FormField>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button id="wa-skip-btn" type="button" variant="secondary" onClick={() => onNext()} style={{ flex: '0 0 auto' }}>
            Skip for now
          </Button>
          <Button id="wa-connect-btn" type="submit" variant="primary" loading={loading} fullWidth>
            Connect account
          </Button>
        </div>
      </form>
    </div>
  )
}
