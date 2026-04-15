'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '../actions'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

type FormState = { error?: Record<string, string[]> } | null

export default function SignUpPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, null)

  return (
    <div style={{ width: '100%', maxWidth: '26rem' }}>
      {/* Logo (mobile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
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
      </div>

      <h1 style={{
        fontSize: 'var(--font-headline-medium-size)',
        fontWeight: 'var(--font-headline-medium-weight)',
        color: 'var(--color-on-surface)',
        margin: '0 0 0.5rem',
      }}>
        Create your account
      </h1>
      <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 2rem' }}>
        Start sending personalized WhatsApp messages at scale.
      </p>

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormField id="companyName" label="Company name" required error={state?.error?.companyName?.[0]}>
          <Input id="companyName" name="companyName" type="text" required error={state?.error?.companyName?.[0]} />
        </FormField>

        <FormField id="email" label="Email address" required error={state?.error?.email?.[0]}>
          <Input id="email" name="email" type="email" required autoComplete="email" error={state?.error?.email?.[0]} />
        </FormField>

        <FormField id="password" label="Password" required error={state?.error?.password?.[0]}>
          <Input id="password" name="password" type="password" required autoComplete="new-password" error={state?.error?.password?.[0]} />
        </FormField>

        <Button id="sign-up-btn" type="submit" variant="primary" fullWidth loading={pending} size="lg">
          Create account
        </Button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
        Already have an account?{' '}
        <Link href="/sign-in" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
