'use client'

import Link from 'next/link'
import { useState } from 'react'

interface StatCardProps {
  label: string
  value: string
  icon: string
  href: string
}

export function StatCard({ label, value, icon, href }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          border: `1px solid ${isHovered ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isHovered ? '0 2px 12px rgba(255,91,4,0.1)' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
        <div style={{
          fontSize: 'var(--font-headline-small-size)',
          fontWeight: 700,
          color: 'var(--color-on-surface)',
          lineHeight: 1,
          marginBottom: '0.375rem',
        }}>{value}</div>
        <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>{label}</div>
      </div>
    </Link>
  )
}
