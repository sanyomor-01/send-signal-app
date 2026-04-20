'use client'

import { useState, useMemo } from 'react'
import { FormField, Input, Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { OnboardingData } from '../page'
import { extractPlaceholders } from '@/lib/utils'

interface Props {
  onNext: (data?: Partial<OnboardingData>) => void
  onBack: () => void
}

const PLACEHOLDERS = ['{firstName}', '{lastName}', '{fullName}', '{source}']

export function OnboardingTemplate({ onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [body, setBody] = useState('Hi {firstName}, I wanted to reach out about...')

  const placeholders = useMemo(() => extractPlaceholders(body), [body])

  const preview = useMemo(() => {
    return body
      .replace(/\{firstName\}/g, 'Alex')
      .replace(/\{lastName\}/g, 'Smith')
      .replace(/\{fullName\}/g, 'Alex Smith')
      .replace(/\{source\}/g, 'Instagram')
  }, [body])

  const insertPlaceholder = (ph: string) => {
    setBody((b) => b + ph)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !body.trim()) {
      setError('Name and message body are required')
      return
    }
    setError(null)
    setLoading(true)
    const controller = new AbortController()

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ name, body }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to save template')
        return
      }
      onNext({ templateId: json.data.id })
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
          <OnboardingProgress stepIndex={4} />
        </div>

        <h3 style={{
          fontSize: 'var(--font-title-large-size)',
          fontWeight: 'var(--font-title-large-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          Create your first template
        </h3>
        <p style={{ fontSize: 'var(--font-body-medium-reg-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          Build a reusable message. Use placeholders like <code style={{ backgroundColor: 'var(--color-surface-container)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.8em' }}>{'{firstName}'}</code> to personalize each message.
        </p>

        <form id="tmpl-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormField id="tmpl-name" label="Template name" required>
            <Input id="tmpl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Initial outreach" required />
          </FormField>

          <div>
            <FormField id="tmpl-body" label="Message body" required>
              <Textarea id="tmpl-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message..." rows={5} style={{ fontFamily: 'inherit' }} required />
            </FormField>
            {/* Placeholder buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {PLACEHOLDERS.map((ph) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => insertPlaceholder(ph)}
                  style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: placeholders.includes(ph.replace(/[{}]/g, '')) ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
                    color: placeholders.includes(ph.replace(/[{}]/g, '')) ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                    fontSize: 'var(--font-label-medium-size)',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                  }}
                >
                  {ph}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{
            borderRadius: '0.75rem',
            border: '1px solid var(--color-outline-variant)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '0.625rem 1rem',
              backgroundColor: 'var(--color-surface-container)',
              fontSize: 'var(--font-label-medium-size)',
              fontWeight: 600,
              color: 'var(--color-on-surface-variant)',
              borderBottom: '1px solid var(--color-outline-variant)',
            }}>
              Preview (with sample data)
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-surface)',
              fontSize: 'var(--font-body-large-reg-size)',
              color: 'var(--color-on-surface)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {preview}
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-error)' }}>{error}</p>
          )}
        </form>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Button id="tmpl-back-btn" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button id="tmpl-save-btn" type="submit" form="tmpl-form" variant="primary" loading={loading}>
          Save template
        </Button>
      </div>
    </div>
  )
}
