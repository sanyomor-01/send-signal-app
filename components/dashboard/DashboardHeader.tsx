'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from '@/app/(auth)/actions'

type DashboardHeaderProps = {
  fullName: string | null
  email: string
}

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return email[0].toUpperCase()
}

export function DashboardHeader({ fullName, email }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = fullName || email.split('@')[0]
  const initials = getInitials(fullName, email)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <header style={{
      height: '4rem',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 1.5rem',
      borderBottom: '1px solid var(--color-outline-variant)',
      backgroundColor: 'var(--color-surface)',
    }}>
      {/* Profile trigger */}
      <div ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 1000 : undefined }}>
        {/* Overlay backdrop when open */}
        {isOpen && (
          <div
            id="profile-overlay"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.3)', // mild overlay
              backdropFilter: 'blur(4px)', // premium styling guidelines!
              zIndex: 999,
              animation: 'profileOverlayFadeIn 0.2s ease-out',
            }}
          />
        )}

        <button
          id="profile-menu-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.375rem 0.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            position: 'relative',
            zIndex: isOpen ? 1001 : undefined,
          }}
        >
          {/* Name */}
          <span style={{
            fontSize: 'var(--font-body-medium-size)',
            fontWeight: 500,
            color: 'var(--color-on-surface)',
            maxWidth: '10rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {displayName}
          </span>
          {/* Avatar */}
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '1.5px solid var(--color-outline-normal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-on-surface)',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}>
              {initials}
            </span>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            id="profile-dropdown"
            role="menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              minWidth: '14rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
              zIndex: 1000,
              overflow: 'hidden',
              animation: 'profileDropdownIn 0.15s ease-out',
            }}
          >
            {/* User info */}
            <div style={{
              padding: '0.875rem 1rem',
              borderBottom: '1px solid var(--color-outline-variant)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  border: '1.5px solid var(--color-outline-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--color-on-surface)',
                    lineHeight: 1,
                  }}>
                    {initials}
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 'var(--font-body-medium-size)',
                    color: 'var(--color-on-surface)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {displayName}
                  </p>
                  <p style={{
                    margin: '0.125rem 0 0',
                    fontSize: 'var(--font-label-medium-size)',
                    color: 'var(--color-on-surface-variant)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <div style={{ padding: '0.375rem' }}>
              <form action={signOut}>
                <button
                  id="sign-out-btn"
                  type="submit"
                  role="menuitem"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--font-body-medium-size)',
                    color: 'var(--color-error, #d32f2f)',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-error-container, #fce4ec)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes profileDropdownIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes profileOverlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  )
}
