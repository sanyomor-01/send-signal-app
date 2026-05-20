'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '../actions'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { LogoIcon } from '@/components/brand/LogoIcon'

type FormState = { error?: Record<string, string[]>, success?: boolean, email?: string } | null

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, null)

  if (state?.success) {
    return (
      <div style={{ width: '100%', maxWidth: '23rem', textAlign: 'center' }}>
        <div style={{
          width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'var(--color-primary-container)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" width="24" height="24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>

        <h1 style={{
          fontSize: 'var(--font-headline-small-size)',
          fontWeight: 'var(--font-headline-small-weight)',
          color: 'var(--color-on-surface)',
          margin: '0 0 1rem',
        }}>
          Check your email
        </h1>

        <p style={{
          fontSize: 'var(--font-body-large-reg-size)',
          color: 'var(--color-on-surface-variant)',
          lineHeight: 1.5,
          margin: '0 0 2rem',
        }}>
          We&apos;ve sent a password reset link to <br />
          <strong style={{ color: 'var(--color-on-surface)' }}>{state.email}</strong>
        </p>

        <Button id="back-to-sign-in" variant="primary" fullWidth size="lg" type="button" onClick={() => router.push('/sign-in')}>
          Back to sign in
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
          <LogoIcon size={18} color="white" strokeWidth={2.2} />
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
        Reset your password
      </h1>

      <p style={{
        fontSize: 'var(--font-body-medium-size)',
        color: 'var(--color-on-surface-variant)',
        textAlign: 'center',
        margin: '0 0 2rem',
        lineHeight: 1.5,
      }}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormField id="email" label="Email address" required error={state?.error?.email?.[0]}>
          <Input id="email" name="email" type="email" required autoComplete="email" error={state?.error?.email?.[0]} placeholder="name@company.com" />
        </FormField>

        <Button id="reset-btn" type="submit" variant="primary" fullWidth loading={pending} size="lg">
          Send reset link
        </Button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
        <Link href="/sign-in" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
