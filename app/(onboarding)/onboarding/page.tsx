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
    </div>
  )
}
