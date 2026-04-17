'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--color-on-background)', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="relative sticky top-0 z-[100] bg-[rgba(249,250,251,0.9)] backdrop-blur-md px-2 md:px-24 h-16 border-b md:border-b-0 border-[var(--color-outline-variant)]">
        <div className="max-w-[1440px] mx-auto h-full flex justify-between md:grid md:grid-cols-[1fr_auto_1fr] items-center w-full">
          
          {/* Logo - Stays left */}
          <div className="flex items-center gap-2 justify-self-start">
            <div className="w-7 h-7 rounded-sm bg-[var(--color-primary)] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14" style={{ marginLeft: '2px' }}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
            <span className="font-bold text-[var(--color-on-surface)] text-[var(--font-title-medium-size)]">Send Signal</span>
          </div>

          <div className="hidden md:flex gap-6 items-center justify-self-center">
            {['Features', 'Use cases', 'Pricing', 'Contact', 'Login'].map((item) => (
              <Link key={item} href={item === 'Login' ? '/sign-in' : `#${item.toLowerCase().replace(' ', '-')}`} className="text-[var(--color-on-surface)] no-underline text-[var(--font-body-medium-size)] font-medium hover:text-[var(--color-primary)] transition-colors">{item}</Link>
            ))}
          </div>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center justify-self-end gap-4">
            <Link href="/sign-up" className="hidden md:inline-block bg-[var(--color-primary)] hover:bg-[var(--sys-color-roles-surface-surface-tint,#F05300)] transition-colors px-4 py-2 rounded-lg text-[var(--sys-color-roles-primary-on-primary,#ffffff)] no-underline text-[var(--font-label-large-size)] font-medium">
              Get Started
            </Link>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-[100] bg-[var(--color-background,#ffffff)] border-b border-[var(--color-outline-variant)] shadow-xl animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-col p-4 gap-4">
              {['Features', 'Use cases', 'Pricing', 'Contact', 'Login'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Login' ? '/sign-in' : `#${item.toLowerCase().replace(' ', '-')}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--color-on-surface)] no-underline text-[var(--font-body-large-reg-size)] py-3 border-b border-[var(--color-surface-variant)] last:border-0 font-medium"
                >
                  {item}
                </Link>
              ))}
              <Link 
                href="/sign-up" 
                onClick={() => setIsMenuOpen(false)}
                className="bg-[var(--color-primary)] text-white text-center py-3.5 rounded-lg no-underline font-bold mt-2"
              >
                Get Started for free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{ 
        height: '70vh', 
        padding: '5rem 2rem 4rem', 
        textAlign: 'center', 
        maxWidth: '52rem', 
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: 'var(--font-display-small-size)', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-on-surface)', margin: '0 0 1.25rem', letterSpacing: '-0.03em' }}>
          Automate Personalized<br />WhatsApp Outreach
        </h1>
        <p style={{ fontSize: 'var(--font-body-large-reg-size)', color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: '0 0 2.5rem', maxWidth: '38rem', marginLeft: 'auto', marginRight: 'auto', padding: '0 3rem' }}>
          Turn social media leads into warm conversations. Connect your WhatsApp Business API, import contacts, and launch high-converting outreach campaigns at scale.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="bg-[var(--color-primary)] hover:bg-[var(--sys-color-roles-surface-surface-tint,#F05300)] text-[var(--sys-color-roles-primary-on-primary,#ffffff)] transition-colors px-8 py-3.5 rounded-lg no-underline font-semibold text-[var(--font-body-large-size)]">
            Get Started for free
          </Link>
        </div>
      </section>
    </div>
  )
}
