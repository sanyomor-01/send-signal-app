'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signUp } from '../actions'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

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

export default function SignUpPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, null)
  const [submitErrors, setSubmitErrors] = useState<Record<string, string[]> | null>(null)

  const [companyName, setCompanyName] = useState('')
  const [isCompanyBlurred, setIsCompanyBlurred] = useState(false)

  const [email, setEmail] = useState('')
  const [hasStartedTypingEmail, setHasStartedTypingEmail] = useState(false)

  const [password, setPassword] = useState('')

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')
    setCompanyName(val)
    if (submitErrors?.companyName) {
      setSubmitErrors(prev => prev ? { ...prev, companyName: [] } : null)
    }
  }

  const handleCompanyBlur = () => {
    setIsCompanyBlurred(true)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (!hasStartedTypingEmail) setHasStartedTypingEmail(true)
    if (submitErrors?.email) {
      setSubmitErrors(prev => prev ? { ...prev, email: [] } : null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (submitErrors?.password) {
      setSubmitErrors(prev => prev ? { ...prev, password: [] } : null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const errors: Record<string, string[]> = {}
    if (!companyName) errors.companyName = ['Enter Your Company Name']
    if (!email) errors.email = ['Enter Your Work Email']
    if (!password) errors.password = ['Choose a Password']

    if (Object.keys(errors).length > 0) {
      e.preventDefault()
      setSubmitErrors(errors)
      return
    }

    setSubmitErrors(null)
  }

  const errors = submitErrors || state?.error || {}

  let companyErrorText = errors.companyName?.[0]
  if (!companyErrorText && isCompanyBlurred && companyName.trim() === '') {
    companyErrorText = "Field must not be empty"
  }

  let emailErrorText = errors.email?.[0]
  if (!emailErrorText && hasStartedTypingEmail) {
    const lower = email.trim().toLowerCase()
    const isGmailOrYahoo = lower.endsWith('@gmail.com') || lower.endsWith('@yahoo.com')
    const hasAt = lower.includes('@')
    
    if (isGmailOrYahoo || (!hasAt && email.length > 0) || email.length === 0) {
      emailErrorText = "Enter a valid company email address"
    }
  }

  const isLengthValid = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  return (
    <div style={{ width: '100%', maxWidth: '23rem' }}>
      {/* Logo (mobile) */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center',justifyContent:'center', gap: '0.5rem', marginBottom: '2rem' }}>
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
        margin: '0 0 2rem',
        letterSpacing: '0', textAlign:'center',
      }}>
        Create account
      </h1>

      <form action={action} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormField id="companyName" label="Company name" required error={companyErrorText}>
          <Input 
            id="companyName" 
            name="companyName" 
            type="text" 
            required 
            error={companyErrorText} 
            value={companyName} 
            onChange={handleCompanyChange} 
            onBlur={handleCompanyBlur} 
          />
        </FormField>

        <FormField id="email" label="Email address" required error={emailErrorText}>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            error={emailErrorText} 
            value={email} 
            onChange={handleEmailChange} 
          />
        </FormField>

        <FormField id="password" label="Password" required error={errors?.password?.[0]}>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            autoComplete="new-password" 
            error={errors?.password?.[0]} 
            value={password} 
            onChange={handlePasswordChange} 
          />
          {password.length > 0 && (
            <div style={{ marginTop: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Requirement satisfied={isLengthValid} text="Password must be at least 8 characters" />
              <Requirement satisfied={hasNumber} text="Password must contain a number" />
              <Requirement satisfied={hasSpecial} text="Password must contain a special character" />
            </div>
          )}
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
