'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '../actions'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

type FormState = { error?: Record<string, string[]> } | null

export default function SignInPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, null)

  return (
    <div style={{ width: '100%', maxWidth: '26rem' }}>
      {/* Logo (mobile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
        }}>📡</div>
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
        Welcome back
      </h1>
      <p style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 2rem' }}>
        Sign in to your Send Signal account.
      </p>

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormField id="email" label="Email address" required error={state?.error?.email?.[0]}>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required autoComplete="email" error={state?.error?.email?.[0]} />
        </FormField>

        <FormField id="password" label="Password" required error={state?.error?.password?.[0]}>
          <Input id="password" name="password" type="password" placeholder="Your password" required autoComplete="current-password" error={state?.error?.password?.[0]} />
        </FormField>

        <Button id="sign-in-btn" type="submit" variant="primary" fullWidth loading={pending} size="lg">
          Sign in
        </Button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Create one free
        </Link>
      </p>
    </div>
  )
}
