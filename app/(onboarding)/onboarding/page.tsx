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

  const back = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const stepComponents = [
    <OnboardingWelcome key="welcome" onNext={next} />,
    <OnboardingWhatsApp key="whatsapp" onNext={next} onBack={back} />,
    <OnboardingImport key="import" onNext={next} onBack={back} />,
    <OnboardingTemplate key="template" onNext={next} onBack={back} />,
    <OnboardingCampaign key="campaign" data={data} onNext={next} onBack={back} />,
    <OnboardingIntro key="intro" onBack={back} />,
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '42rem',
        }}>
          {stepComponents[step]}
        </div>
      </main>
    </div>
  )
}
