import React from 'react'
import { Button } from './Button'

// Per empty-states.md: message + explanation + primary action button

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-on-surface-variant)',
            fontSize: '1.75rem',
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '20rem' }}>
        <h3 style={{
          margin: 0,
          fontSize: 'var(--font-headline-small-size)',
          fontWeight: 'var(--font-headline-small-weight)',
          color: 'var(--color-on-surface)',
        }}>
          {title}
        </h3>
        <p style={{
          margin: 0,
          fontSize: 'var(--font-body-medium-size)',
          color: 'var(--color-on-surface-variant)',
          lineHeight: 'var(--font-body-medium-line-height)',
        }}>
          {description}
        </p>
      </div>
      {action && (
        action.href ? (
          <a
            href={action.href}
            style={{ textDecoration: 'none' }}
          >
            <Button variant="primary" size="md">{action.label}</Button>
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}

// ── Common empty states per empty-states.md ────────

export const EMPTY_STATES = {
  leads: {
    icon: '👥',
    title: 'No leads yet',
    description: 'Import your first leads via CSV to start sending personalized messages.',
  },
  campaigns: {
    icon: '📢',
    title: 'No campaigns yet',
    description: 'Create your first campaign to start reaching out to your leads at scale.',
  },
  templates: {
    icon: '📝',
    title: 'No templates yet',
    description: 'Create reusable message templates with dynamic placeholders.',
  },
  messages: {
    icon: '💬',
    title: 'No messages yet',
    description: 'Messages will appear here once campaigns start sending.',
  },
  analytics: {
    icon: '📊',
    title: 'No analytics yet',
    description: 'Analytics will appear here once your campaigns have sent messages.',
  },
  activityLogs: {
    icon: '📋',
    title: 'No activity logs yet',
    description: 'Activity timeline events will appear here as you use the platform.',
  },
  conversations: {
    icon: '💭',
    title: 'No conversation messages yet',
    description: 'Conversations will appear here when leads reply to your messages.',
  },
}
