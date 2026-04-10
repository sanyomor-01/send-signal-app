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
  title: 'Send Signal | Automated & Personalized WhatsApp Outreach',
  description: 'Scale your messaging with Send Signal. Import leads, create personalized templates, and automate your WhatsApp marketing campaigns securely using the official WhatsApp Business API.',
  keywords: [
    'WhatsApp outreach',
    'automated WhatsApp messaging',
    'WhatsApp Business API',
    'personalized WhatsApp campaigns',
    'WhatsApp CRM'
  ],
  authors: [{ name: 'Send Signal' }],
  openGraph: {
    title: 'Send Signal | Automated & Personalized WhatsApp Outreach',
    description: 'Import leads, create templates, and automate WhatsApp marketing campaigns securely.',
    url: 'https://sendsignal.app',
    siteName: 'Send Signal',
    images: [
      {
        url: 'https://sendsignal.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Send Signal Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send Signal | Automated WhatsApp Outreach',
    description: 'Import leads, create templates, and automate WhatsApp marketing campaigns safely.',
    images: ['https://sendsignal.app/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://sendsignal.app',
  },
};

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
