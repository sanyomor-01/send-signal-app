'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="25 13" />
          </svg>
        </span>
      )}
      {!loading && icon && <span className="btn__icon">{icon}</span>}
      <span>{children}</span>

      <style jsx>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1.5px solid transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          font-family: inherit;
          font-weight: var(--font-label-large-weight);
          font-size: var(--font-label-large-size);
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
        }

        .btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Sizes */
        .btn--sm { padding: 0.375rem 0.75rem; font-size: var(--font-label-medium-size); }
        .btn--md { padding: 0.625rem 1.25rem; }
        .btn--lg { padding: 0.875rem 1.75rem; font-size: var(--font-body-large-size); }

        /* Full width */
        .btn--full { width: 100%; }

        /* Primary */
        .btn--primary {
          background-color: var(--color-primary);
          color: var(--color-on-primary);
          border-color: var(--color-primary);
        }
        .btn--primary:hover:not(:disabled) {
          background-color: #e65204;
          border-color: #e65204;
        }
        .btn--primary:active:not(:disabled) { opacity: 0.88; }

        /* Secondary */
        .btn--secondary {
          background-color: var(--color-surface-container);
          color: var(--color-on-surface);
          border-color: var(--color-outline-variant);
        }
        .btn--secondary:hover:not(:disabled) {
          background-color: var(--color-surface-container-high);
          border-color: var(--color-outline-normal);
        }

        /* Danger */
        .btn--danger {
          background-color: var(--color-error);
          color: var(--color-on-error);
          border-color: var(--color-error);
        }
        .btn--danger:hover:not(:disabled) { opacity: 0.88; }

        /* Ghost */
        .btn--ghost {
          background-color: transparent;
          color: var(--color-primary);
          border-color: transparent;
        }
        .btn--ghost:hover:not(:disabled) {
          background-color: var(--color-primary-container);
        }

        /* Outline */
        .btn--outline {
          background-color: transparent;
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
        .btn--outline:hover:not(:disabled) {
          background-color: var(--color-primary-container);
        }

        /* Spinner */
        .btn__spinner svg {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}
