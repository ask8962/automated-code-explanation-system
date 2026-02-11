import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const _inter = Inter({ subsets: ['latin'] })
const _mono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Code Explainer - Learn Code Better',
  description: 'Understand any code with AI-powered explanations. Perfect for beginners, exams, and interviews.',
  generator: 'Anukalp',
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
    <html lang="en" suppressHydrationWarning className={`${_inter.variable} ${_mono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
