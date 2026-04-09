'use client'

import { useState } from 'react'
import { OnboardingWelcome } from './steps/OnboardingWelcome'
import { OnboardingWhatsApp } from './steps/OnboardingWhatsApp'
import { OnboardingImport } from './steps/OnboardingImport'
import { OnboardingTemplate } from './steps/OnboardingTemplate'
import { OnboardingCampaign } from './steps/OnboardingCampaign'
import { OnboardingIntro } from './steps/OnboardingIntro'

export type OnboardingData = {
  whatsappAccountId?: string
  importedLeadIds?: string[]
  templateId?: string
  campaignId?: string
}

const STEPS = [
  { label: 'Welcome', id: 'welcome' },
  { label: 'WhatsApp', id: 'whatsapp' },
  { label: 'Import Leads', id: 'import' },
  { label: 'First Template', id: 'template' },
  { label: 'First Campaign', id: 'campaign' },
  { label: 'Dashboard', id: 'intro' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({})

  const next = (newData?: Partial<OnboardingData>) => {
    if (newData) setData((d) => ({ ...d, ...newData }))
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const stepComponents = [
    <OnboardingWelcome key="welcome" onNext={next} />,
    <OnboardingWhatsApp key="whatsapp" onNext={next} />,
    <OnboardingImport key="import" onNext={next} />,
    <OnboardingTemplate key="template" onNext={next} />,
    <OnboardingCampaign key="campaign" data={data} onNext={next} />,
    <OnboardingIntro key="intro" />,
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--color-outline-variant)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
          }}>📡</div>
          <span style={{ fontWeight: 600, color: 'var(--color-on-surface)', fontSize: 'var(--font-title-medium-size)' }}>
            Send Signal
          </span>
        </div>
        <span style={{ fontSize: 'var(--font-label-medium-size)', color: 'var(--color-on-surface-variant)' }}>
          Setup {step + 1} of {STEPS.length}
        </span>
      </header>

      {/* Progress bar */}
      <div style={{ height: '3px', backgroundColor: 'var(--color-outline-variant)' }}>
        <div style={{
          height: '100%',
          width: `${((step + 1) / STEPS.length) * 100}%`,
          backgroundColor: 'var(--color-primary)',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Step content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        {stepComponents[step]}
      </main>

      {/* Step indicators */}
      <footer style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        borderTop: '1px solid var(--color-outline-variant)',
      }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            backgroundColor: i <= step ? 'var(--color-primary)' : 'var(--color-outline-variant)',
            transition: 'background-color 0.3s ease',
          }} />
        ))}
      </footer>
    </div>
  )
}
