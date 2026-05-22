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
  whatsappPhoneNumberId?: string
  whatsappDisplayPhoneNumber?: string
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
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false])

  const setStepComplete = (index: number, complete: boolean = true) => {
    setCompletedSteps((prev) => {
      const next = [...prev]
      next[index] = complete
      return next
    })
  }

  const next = (newData?: Partial<OnboardingData>) => {
    if (newData) setData((d) => ({ ...d, ...newData }))
    setStepComplete(step, true)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const back = () => {
    setStep((s) => {
      const nextStep = Math.max(s - 1, 0)
      
      // The step we went back to should not be checked
      setStepComplete(nextStep, false)
      
      // When going back to step 0, the user must connect their WhatsApp account again.
      // Clear whatsappAccountId but keep the other metadata so it can prefill.
      if (nextStep === 0) {
        setStepComplete(1, false)
        setData((d) => ({ ...d, whatsappAccountId: undefined }))
      }
      
      return nextStep
    })
  }

  const stepComponents = [
    <OnboardingWelcome key="welcome" onNext={next} completedSteps={completedSteps} />,
    <OnboardingWhatsApp
      key="whatsapp"
      data={data}
      onNext={next}
      onBack={back}
      completedSteps={completedSteps}
      onComplete={(wData) => {
        setData((d) => ({ ...d, ...wData }))
        setStepComplete(1, true)
      }}
    />,
    <OnboardingImport key="import" onNext={next} onBack={back} completedSteps={completedSteps} />,
    <OnboardingTemplate key="template" onNext={next} onBack={back} completedSteps={completedSteps} />,
    <OnboardingCampaign key="campaign" data={data} onNext={next} onBack={back} completedSteps={completedSteps} />,
    <OnboardingIntro key="intro" />,
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '36rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        {stepComponents[step]}
      </div>
    </div>
  )
}
