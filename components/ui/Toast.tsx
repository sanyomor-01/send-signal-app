'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const TOAST_DURATION = 7000 // 7 seconds per notifications.md (5–10s)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]) // Max 5 toasts
    setTimeout(() => removeToast(id), TOAST_DURATION)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => addToast({ type: 'success', title, message }), [addToast])
  const error = useCallback((title: string, message?: string) => addToast({ type: 'error', title, message }), [addToast])
  const warning = useCallback((title: string, message?: string) => addToast({ type: 'warning', title, message }), [addToast])
  const info = useCallback((title: string, message?: string) => addToast({ type: 'info', title, message }), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 9999,
          maxWidth: '24rem',
          width: 'calc(100vw - 3rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const colorMap: Record<ToastType, { border: string; icon: string; iconBg: string }> = {
    success: { border: 'var(--color-success)', icon: 'var(--color-on-success)', iconBg: 'var(--color-success)' },
    error: { border: 'var(--color-error)', icon: 'var(--color-on-error)', iconBg: 'var(--color-error)' },
    warning: { border: 'var(--color-warning)', icon: 'var(--color-on-warning)', iconBg: 'var(--color-warning)' },
    info: { border: 'var(--color-info)', icon: 'var(--color-on-info)', iconBg: 'var(--color-info)' },
  }

  const colors = colorMap[toast.type]

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-outline-variant)',
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        pointerEvents: 'auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(1rem)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <span
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          backgroundColor: colors.iconBg,
          color: colors.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {TOAST_ICONS[toast.type]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-label-large-size)', color: 'var(--color-on-surface)' }}>
          {toast.title}
        </p>
        {toast.message && (
          <p style={{ margin: '0.2rem 0 0', fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-on-surface-variant)',
          fontSize: '1rem',
          padding: '0.25rem',
          flexShrink: 0,
          borderRadius: '0.25rem',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
