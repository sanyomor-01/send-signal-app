'use client'

import { useActionState, useState, Suspense } from 'react'
import Link from 'next/link'
import { resetPassword } from '../actions'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { useSearchParams, useRouter } from 'next/navigation'

type FormState = { error?: Record<string, string[]> } | null

function Requirement({ satisfied, text }: { satisfied: boolean, text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: satisfied ? 'var(--color-success, #00992a)' : 'var(--color-on-surface-variant)' }}>
      {satisfied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid currentColor' }} />
      )}
      <span>{text}</span>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ width: '100%', maxWidth: '23rem', textAlign: 'center', padding: '2rem', color: 'var(--color-on-surface-variant)' }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const [state, action, pending] = useActionState<FormState, FormData>(resetPassword, null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const isLengthValid = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  if (!token) {
    return (
      <div style={{ width: '100%', maxWidth: '23rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'var(--font-headline-small-size)',
          fontWeight: 'var(--font-headline-small-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 1rem',
        }}>
          Invalid Request
        </h1>
        <p style={{
          fontSize: 'var(--font-body-large-reg-size)',
          color: 'var(--color-on-surface-variant)',
          lineHeight: 1.5,
          margin: '0 0 2rem',
        }}>
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button variant="primary" fullWidth size="lg" type="button" onClick={() => router.push('/forgot-password')}>
          Request new link
        </Button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '23rem' }}>
      {/* Logo (mobile) */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16" style={{ marginLeft: '2px' }}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
        <span style={{ fontSize: 'var(--font-title-large-size)', fontWeight: 600, color: 'var(--color-on-surface)' }}>
          Send Signal
        </span>
      </Link>

      <h1 style={{
        fontSize: 'var(--font-headline-small-size)',
        fontWeight: 'var(--font-headline-small-weight)',
        color: 'var(--color-on-surface)',
        margin: '0 0 0.75rem',
        textAlign: 'center',
      }}>
        Set new password
      </h1>

      <p style={{
        fontSize: 'var(--font-body-medium-size)',
        color: 'var(--color-on-surface-variant)',
        textAlign: 'center',
        margin: '0 0 2rem',
        lineHeight: 1.5,
      }}>
        Please enter your new password below.
      </p>

      {state?.error?.token && (
        <div style={{
          padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255, 0, 0, 0.1)',
          color: 'red', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center',
        }}>
          {state.error.token[0]}
        </div>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="hidden" name="token" value={token} />

        <FormField id="password" label="New Password" required error={state?.error?.password?.[0]}>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            autoComplete="new-password" 
            error={state?.error?.password?.[0]} 
            value={password}
            onChange={handlePasswordChange}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            maxHeight: password.length > 0 ? '150px' : '0px',
            opacity: password.length > 0 ? 1 : 0,
            marginTop: password.length > 0 ? '0.625rem' : '0px',
          }}>
            <Requirement satisfied={isLengthValid} text="Password must be at least 8 characters" />
            <Requirement satisfied={hasNumber} text="Password must contain a number" />
            <Requirement satisfied={hasSpecial} text="Password must contain a special character" />
          </div>
        </FormField>

        <Button id="reset-btn" type="submit" variant="primary" fullWidth loading={pending} size="lg">
          Reset password
        </Button>
      </form>
    </div>
  )
}
