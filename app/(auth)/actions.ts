'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createToken, setSessionCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

// ── Sign Up ───────────────────────────────────────

const SignUpSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signUp(_prevState: unknown, formData: FormData) {
  const raw = {
    companyName: formData.get('companyName'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = SignUpSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { companyName, email, password } = result.data

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: { email: ['Email already in use'] } }
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: { companyName, email, passwordHash, role: 'OWNER' },
  })

  const token = await createToken({ userId: user.id, email: user.email, role: user.role })
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

  const token = await createToken({ userId: user.id, email: user.email, role: user.role })
  await setSessionCookie(token)

  redirect('/dashboard')
}

// ── Sign Out ──────────────────────────────────────

export async function signOut() {
  const { clearSessionCookie } = await import('@/lib/auth')
  await clearSessionCookie()
  redirect('/sign-in')
}
