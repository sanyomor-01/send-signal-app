import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Send Signal — WhatsApp Outreach Platform',
    template: '%s | Send Signal',
  },
  description:
    'Send Signal helps businesses send personalized WhatsApp messages at scale. Import leads, create templates, run campaigns, and track results.',
  keywords: ['WhatsApp', 'outreach', 'marketing', 'leads', 'campaigns'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
