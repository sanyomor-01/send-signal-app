'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createToken, setSessionCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { sendEmail, generatePasswordResetEmailHtml } from '@/lib/mail'
import crypto from 'crypto'

// ── Sign Up ───────────────────────────────────────

const SignUpSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signUp(_prevState: unknown, formData: FormData) {
  const raw = {
    companyName: formData.get('companyName'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = SignUpSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { companyName, fullName, email, password } = result.data

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: { email: ['Email already in use'] } }
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: { companyName, fullName, email, passwordHash, role: 'OWNER' },
  })

  const token = await createToken({ userId: user.id, email: user.email, fullName: user.fullName, role: user.role })
  await setSessionCookie(token)

  redirect('/onboarding')
}

// ── Sign In ───────────────────────────────────────

const SignInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
})

export async function signIn(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = SignInSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    return { error: { email: ['Invalid email or password'] } }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { error: { email: ['Invalid email or password'] } }
  }

  const token = await createToken({ userId: user.id, email: user.email, fullName: user.fullName, role: user.role })
  await setSessionCookie(token)

  redirect('/dashboard')
}

// ── Reset Password ────────────────────────────────

const ResetRequestSchema = z.object({
  email: z.string().email('Valid email required'),
})

export async function requestPasswordReset(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email'),
  }

  const result = ResetRequestSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { email } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Clean up any old tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetLink = `${appUrl}/reset-password?token=${token}`
    const html = generatePasswordResetEmailHtml(resetLink)

    await sendEmail({
      to: email,
      subject: 'Reset your Send Signal password',
      html,
    })
  } else {
    // Delay to mitigate timing attacks
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  return { success: true, email }
}

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function resetPassword(_prevState: unknown, formData: FormData) {
  const raw = {
    token: formData.get('token'),
    password: formData.get('password'),
  }

  const result = ResetPasswordSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { token, password } = result.data

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: { token: ['Invalid or expired reset token'] } }
  }

  const passwordHash = await hashPassword(password)

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { passwordHash },
  })

  await prisma.passwordResetToken.deleteMany({
    where: { email: resetToken.email },
  })

  redirect('/sign-in')
}

// ── Sign Out ──────────────────────────────────────

export async function signOut() {
  const { clearSessionCookie } = await import('@/lib/auth')
  await clearSessionCookie()
  redirect('/sign-in')
}
