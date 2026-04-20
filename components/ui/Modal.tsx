'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from './Button'

// ── Modal (base) ──────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) {
      if (el.open) {
        el.close()
      }
      el.showModal?.()
    } else if (el.open) {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const sizeWidths: Record<string, string> = {
    sm: '24rem',
    md: '32rem',
    lg: '44rem',
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}
        aria-hidden="true"
      />
      {/* Dialog */}
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: sizeWidths[size],
          maxHeight: '90vh',
          borderRadius: '0.75rem',
          border: '1px solid var(--color-outline-variant)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          padding: 0,
          margin: 0,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-outline-variant)',
          flexShrink: 0,
        }}>
          <h2 id="modal-title" style={{
            margin: 0,
            fontSize: 'var(--font-title-large-size)',
            fontWeight: 'var(--font-title-large-weight)',
            color: 'var(--color-on-surface)',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-on-surface-variant)',
              fontSize: '1.25rem',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--color-outline-variant)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </dialog>
    </>
  )
}

// ── Confirm Dialog (safety rule — large sends require confirmation) ────

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{
        margin: 0,
        fontSize: 'var(--font-body-large-reg-size)',
        color: 'var(--color-on-surface)',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </Modal>
  )
}
