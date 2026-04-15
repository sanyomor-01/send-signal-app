'use client'

import { usePathname } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/sign-up' || pathname === '/sign-in'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-background)',
    }}>
      {/* Left panel — branding */}
      {!isAuthPage && (
        <div style={{
          display: 'none',
          flex: '0 0 45%',
          background: 'linear-gradient(135deg, #1a0800 0%, #331200 50%, #ff5b04 100%)',
          padding: '3rem',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
          className="auth-panel-left"
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-4rem', right: '-4rem',
            width: '16rem', height: '16rem', borderRadius: '50%',
            background: 'rgba(255,91,4,0.2)',
          }} />
          <div style={{
            position: 'absolute', bottom: '8rem', left: '-3rem',
            width: '10rem', height: '10rem', borderRadius: '50%',
            background: 'rgba(255,91,4,0.15)',
          }} />

          {/* Logo */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              color: '#ffffff',
            }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem',
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16" style={{ marginLeft: '2px' }}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
              <span style={{ fontSize: 'var(--font-title-large-size)', fontWeight: 600 }}>
                Send Signal
              </span>
            </div>
          </div>

          {/* Value prop */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontSize: 'var(--font-display-small-size)',
              fontWeight: 500,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: '0 0 1rem',
            }}>
              Reach leads where they actually respond.
            </h1>
            <p style={{
              fontSize: 'var(--font-body-large-reg-size)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Import leads, send personalized WhatsApp messages, and track every reply — all from one place.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['98%', 'delivery rate'], ['90%+', 'read rate'], ['10×', 'vs email replies']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 'var(--font-headline-small-size)', fontWeight: 700, color: '#ffffff' }}>{val}</div>
                <div style={{ fontSize: 'var(--font-label-medium-size)', color: 'rgba(255,255,255,0.65)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        {children}
      </div>
    </div>
  )
}
