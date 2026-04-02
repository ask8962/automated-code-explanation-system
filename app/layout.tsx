import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'
import { Providers } from './providers'

const _inter = Inter({ subsets: ['latin'] })
const _mono = JetBrains_Mono({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'AI Code Explain — Understand Code in Seconds with AI',
  description:
    'Paste any code snippet and get instant AI-powered explanations, complexity analysis, and performance optimizations. Supports Python, JavaScript, Java, C, and C++.',
  generator: 'Anukalp',
  keywords: [
    'AI code explainer',
    'code explanation',
    'code analysis',
    'complexity analysis',
    'code optimization',
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'Go',
    'Rust',
    'TypeScript',
    'LLaMA',
    'Groq',
  ],
  authors: [{ name: 'Anukalp, Nishant, Prince, Utpal, Jatin' }],
  openGraph: {
    title: 'AI Code Explain — Understand Code in Seconds',
    description:
      'Paste any code and get instant AI-powered explanations, complexity analysis, and optimizations.',
    url: 'https://gla-code-aa.vercel.app',
    siteName: 'AI Code Explain',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Code Explain — Understand Code in Seconds',
    description:
      'Paste any code and get instant AI-powered explanations, complexity analysis, and optimizations.',
  },
  metadataBase: new URL('https://gla-code-aa.vercel.app'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${spaceGrotesk.variable}`}>
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}

