'use client'

import React from 'react'

// Status badge maps — per colors.md §12
const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  // Lead statuses
  NEW: { color: 'var(--color-status-new)', bg: 'var(--color-status-new-bg)', label: 'New' },
  CONTACTED: { color: 'var(--color-status-contacted)', bg: 'var(--color-status-contacted-bg)', label: 'Contacted' },
  REPLIED: { color: 'var(--color-status-replied)', bg: 'var(--color-status-replied-bg)', label: 'Replied' },
  INTERESTED: { color: 'var(--color-status-interested)', bg: 'var(--color-status-interested-bg)', label: 'Interested' },
  NOT_INTERESTED: { color: 'var(--color-status-not-interested)', bg: 'var(--color-status-not-interested-bg)', label: 'Not Interested' },
  CONVERTED: { color: 'var(--color-status-converted)', bg: 'var(--color-status-converted-bg)', label: 'Converted' },
  BOUNCED: { color: 'var(--color-status-bounced)', bg: 'var(--color-status-bounced-bg)', label: 'Bounced' },
  UNSUBSCRIBED: { color: 'var(--color-status-unsubscribed)', bg: 'var(--color-status-unsubscribed-bg)', label: 'Unsubscribed' },

  // Message statuses
  QUEUED: { color: 'var(--color-msg-queued)', bg: 'var(--color-msg-queued-bg)', label: 'Queued' },
  SENDING: { color: 'var(--color-msg-sending)', bg: 'var(--color-msg-sending-bg)', label: 'Sending' },
  SENT: { color: 'var(--color-msg-sent)', bg: 'var(--color-msg-sent-bg)', label: 'Sent' },
  DELIVERED: { color: 'var(--color-msg-delivered)', bg: 'var(--color-msg-delivered-bg)', label: 'Delivered' },
  READ: { color: 'var(--color-msg-read)', bg: 'var(--color-msg-read-bg)', label: 'Read' },
  FAILED: { color: 'var(--color-msg-failed)', bg: 'var(--color-msg-failed-bg)', label: 'Failed' },

  // Campaign statuses
  DRAFT: { color: 'var(--color-campaign-draft)', bg: 'var(--color-campaign-draft-bg)', label: 'Draft' },
  SCHEDULED: { color: 'var(--color-campaign-scheduled)', bg: 'var(--color-campaign-scheduled-bg)', label: 'Scheduled' },
  RUNNING: { color: 'var(--color-campaign-running)', bg: 'var(--color-campaign-running-bg)', label: 'Running' },
  PAUSED: { color: 'var(--color-campaign-paused)', bg: 'var(--color-campaign-paused-bg)', label: 'Paused' },
  COMPLETED: { color: 'var(--color-campaign-completed)', bg: 'var(--color-campaign-completed-bg)', label: 'Completed' },
  CANCELLED: { color: 'var(--color-campaign-cancelled)', bg: 'var(--color-campaign-cancelled-bg)', label: 'Cancelled' },
}

interface BadgeProps {
  status: string
  label?: string
  dot?: boolean
  size?: 'sm' | 'md'
}

export function Badge({ status, label, dot = true, size = 'md' }: BadgeProps) {
  const style = STATUS_STYLES[status] ?? {
    color: 'var(--color-on-surface-variant)',
    bg: 'var(--color-surface-variant)',
    label: status,
  }

  const displayLabel = label ?? style.label

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.625rem',
        borderRadius: '999px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: size === 'sm' ? 'var(--font-label-small-size)' : 'var(--font-label-medium-size)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: style.color,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  )
}
