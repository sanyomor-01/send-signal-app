'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { OnboardingData } from '../page'

interface Props {
  onNext: (data?: Partial<OnboardingData>) => void
  onBack: () => void
}

type ImportResult = {
  imported: number
  duplicates: number
  invalid: number
  invalidRows: Array<{ row: number; phone: string; reason: string }>
  leadIds: string[]
}

export function OnboardingImport({ onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    const controller = new AbortController()

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/leads/import', { method: 'POST', body: formData, signal: controller.signal })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Import failed')
        return
      }
      setResult(json.data)
    } catch {
      setError('Something went wrong during import.')
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
          <OnboardingProgress stepIndex={3} />
        </div>

        <h3 style={{
          fontSize: 'var(--font-title-large-size)',
          fontWeight: 'var(--font-title-large-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          Import your leads
        </h3>
        <p style={{ fontSize: 'var(--font-body-medium-reg-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          Upload a CSV file. At minimum, include a phone number column. Phone numbers will be validated and normalized to E.164 format.
        </p>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
            borderRadius: '0.75rem',
            padding: '2.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: file ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
            transition: 'all 0.2s ease',
            marginBottom: '1.5rem',
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} id="csv-file" aria-label="Select CSV file" />
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{file ? '✅' : '📁'}</div>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-on-surface)', fontSize: 'var(--font-body-large-size)', lineHeight: 1.4 }}>
            {file ? file.name : 'Click to select a CSV file'}
          </p>
          {!file && (
            <p style={{ margin: '0.25rem 0 0', fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>
              CSV format with phone, firstName, lastName, email columns
            </p>
          )}
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.5rem',
            backgroundColor: 'var(--color-error-container)',
            color: 'var(--color-on-error-container)',
            fontSize: 'var(--font-body-medium-size)',
            marginBottom: '1rem',
          }}>{error}</div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)',
            overflow: 'hidden', marginBottom: '1.5rem',
          }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-container)', display: 'flex', gap: '1.5rem' }}>
              {[
                { label: 'Imported', value: result.imported, color: 'var(--color-success)' },
                { label: 'Duplicates', value: result.duplicates, color: 'var(--color-warning)' },
                { label: 'Invalid', value: result.invalid, color: 'var(--color-error)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-headline-small-size)', fontWeight: 700, color }}>{value}</div>
                  <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>{label}</div>
                </div>
              ))}
            </div>
            {result.invalidRows.length > 0 && (
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-outline-variant)' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: 'var(--font-label-large-size)', color: 'var(--color-error)' }}>
                  Invalid rows
                </p>
                {result.invalidRows.slice(0, 5).map((r) => (
                  <p key={r.row} style={{ margin: '0.25rem 0', fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>
                    Row {r.row}: {r.phone} — {r.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Button id="import-back-btn" variant="secondary" onClick={onBack}>
          Back
        </Button>
        {!result ? (
          <Button id="import-btn" variant="primary" loading={loading} onClick={handleImport} disabled={!file}>
            Import leads
          </Button>
        ) : (
          <Button id="import-next-btn" variant="primary" onClick={() => onNext({ importedLeadIds: result.leadIds })}>
            Continue with {result.imported} leads
          </Button>
        )}
      </div>
    </div>
  )
}
