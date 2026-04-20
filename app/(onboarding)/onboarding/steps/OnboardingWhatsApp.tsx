'use client'

import { useState } from 'react'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { OnboardingData } from '../page'

interface Props {
  onNext: (data?: Partial<OnboardingData>) => void
  onBack: () => void
}

type StepState = 'A' | 'B' | 'C'

interface PhoneNumber {
  phoneNumberId: string
  displayPhoneNumber: string
  verifiedName: string
  businessAccountId: string
}

export function OnboardingWhatsApp({ onNext, onBack }: Props) {
  const [state, setState] = useState<StepState>('A')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State A fields
  const [accessToken, setAccessToken] = useState('')
  const [showToken, setShowToken] = useState(false)

  // State B fields
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
  const [selectedNumberId, setSelectedNumberId] = useState('')

  // State C fields
  const [webhookData, setWebhookData] = useState<{ callbackUrl: string; verifyToken: string } | null>(null)
  const [connectedAccountId, setConnectedAccountId] = useState<string>('')

  const handleValidateToken = async () => {
    if (!accessToken) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, _validateOnly: true }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Invalid Token. Please check your Meta Business permissions.')
        return
      }
      setPhoneNumbers(json.data.phoneNumbers)
      setState('B')
    } catch {
      setError('Connection failed. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectNumber = async (phoneNumberId: string) => {
    const selected = phoneNumbers.find(p => p.phoneNumberId === phoneNumberId)
    if (!selected) return

    setSelectedNumberId(phoneNumberId)
    setError(null)
    setLoading(true)
    const controller = new AbortController()

    try {
      const res = await fetch('/api/whatsapp-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          accountName: selected.verifiedName || selected.displayPhoneNumber,
          phoneNumberId: selected.phoneNumberId,
          businessAccountId: selected.businessAccountId,
          accessToken: accessToken,
          displayPhoneNumber: selected.displayPhoneNumber,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to save account details.')
        return
      }

      const callbackUrl = `${window.location.origin}/api/webhooks/whatsapp/${json.data.account.userId || 'user-id'}`
      
      setWebhookData({
        callbackUrl: json.data.callbackUrl || callbackUrl,
        verifyToken: json.data.webhookVerifyToken,
      })
      
      setConnectedAccountId(json.data.account.id)
      setState('C')
    } catch {
      setError('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Optional: show a toast
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
          <OnboardingProgress stepIndex={2} />
        </div>

        <h3 style={{
          fontSize: 'var(--font-title-large-size)',
          fontWeight: 'var(--font-title-large-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          Connect your WhatsApp account
        </h3>
        <p style={{ fontSize: 'var(--font-body-medium-reg-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          {state === 'A' && "Enter your Permanent Access Token from Meta Business Settings to auto-discover your account details."}
          {state === 'B' && "Select the WhatsApp Business Number you want to use with Send Signal."}
          {state === 'C' && "Final step! Copy these details into your Meta Developer Portal to enable message tracking."}
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

        {/* State A: Initial Entry */}
        {state === 'A' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <FormField 
              id="accessToken" 
              label="Permanent Access Token" 
              required 
              hint="Use a System User Token. Ensure it has whatsapp_business_messaging permissions."
            >
              <div style={{ position: 'relative' }}>
                <Input 
                  id="accessToken" 
                  name="accessToken" 
                  type={showToken ? 'text' : 'password'} 
                  value={accessToken} 
                  onChange={(e) => setAccessToken(e.target.value)} 
                  placeholder="EAABw..." 
                  required 
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-on-surface-variant)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </FormField>
          </div>
        )}

        {/* State B: Validation & Selection */}
        {state === 'B' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="spinner" style={{ border: '3px solid var(--color-surface-variant)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' }} />
                <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>Fetching your account details...</p>
              </div>
            ) : (
              <FormField id="phoneNumber" label="Select your Business Number" required>
                <select
                  id="phoneNumber"
                  value={selectedNumberId}
                  onChange={(e) => handleSelectNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    fontSize: 'var(--font-body-medium-size)',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="" disabled>Choose a number</option>
                  {phoneNumbers.map((p) => (
                    <option key={p.phoneNumberId} value={p.phoneNumberId}>
                      {p.verifiedName} — {p.displayPhoneNumber}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
          </div>
        )}

        {/* State C: Webhook Configuration */}
        {state === 'C' && webhookData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface-container-low)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: 'var(--font-label-medium-size)', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
                  Callback URL
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input id="callback-url" readOnly value={webhookData.callbackUrl} style={{ flex: 1, backgroundColor: 'var(--color-surface-variant)', fontSize: '0.875rem' }} />
                  <Button variant="secondary" onClick={() => copyToClipboard(webhookData.callbackUrl)} style={{ padding: '0 0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: 'var(--font-label-medium-size)', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
                  Verify Token
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input id="verify-token" readOnly value={webhookData.verifyToken} style={{ flex: 1, backgroundColor: 'var(--color-surface-variant)', fontSize: '0.875rem' }} />
                  <Button variant="secondary" onClick={() => copyToClipboard(webhookData.verifyToken)} style={{ padding: '0 0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </Button>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)', fontStyle: 'italic' }}>
              Paste these into the WhatsApp Configuration in your Meta App Dashboard.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
        <Button 
          id="wa-back-btn" 
          type="button" 
          variant="secondary" 
          onClick={state === 'A' ? onBack : () => setState(state === 'C' ? 'B' : 'A')} 
          style={{ flex: '0 0 auto' }}
        >
          Back
        </Button>
        <Button 
          id="wa-next-btn" 
          type="button" 
          variant="primary" 
          loading={loading} 
          size="md"
          onClick={state === 'A' ? handleValidateToken : state === 'B' ? undefined : () => onNext({ whatsappAccountId: connectedAccountId })}
          disabled={state === 'B' && !selectedNumberId}
        >
          {state === 'A' ? 'Connect' : state === 'C' ? 'Next →' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
