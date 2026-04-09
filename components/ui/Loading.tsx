import React from 'react'

// ── Skeleton loaders (loading-states.md) ──────────

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.375rem',
  className = '',
}: {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
}) {
  return (
    <span
      role="status"
      aria-label="Loading..."
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius, display: 'block' }}
    >
      <style jsx>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            var(--color-surface-container) 25%,
            var(--color-surface-container-high) 50%,
            var(--color-surface-container) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  )
}

// ── Table skeleton ────────────────────────────────

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }} aria-busy="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height="1.125rem" />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Card skeleton ─────────────────────────────────

export function CardSkeleton() {
  return (
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} aria-busy="true">
      <Skeleton width="40%" height="1.25rem" />
      <Skeleton height="1rem" />
      <Skeleton width="70%" height="1rem" />
    </div>
  )
}

// ── Spinner ───────────────────────────────────────

export function Spinner({ size = 24, color = 'var(--color-primary)' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading..."
      style={{ animation: 'spin 0.8s linear infinite', display: 'block' }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  )
}

// ── Page loading overlay ──────────────────────────

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '3rem',
        color: 'var(--color-on-surface-variant)',
        fontSize: 'var(--font-body-medium-size)',
      }}
    >
      <Spinner size={32} />
      <span>{message}</span>
    </div>
  )
}
