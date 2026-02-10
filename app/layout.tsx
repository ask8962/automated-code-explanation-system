import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Code Explain | GLA University Mini Project',
  description: 'Instantly explain complex code snippets and optimize performance with AI. Built by Anukalp Gupta, Nishant Singh, Prince Kumar, and Utpal Kumar for GLA University B.Tech CSE Mini Project.',
  keywords: ['AI', 'Code Explanation', 'Code Optimization', 'GLA University', 'Mini Project', 'B.Tech CSE', 'Learning Tool'],
  authors: [{ name: 'Anukalp Gupta' }, { name: 'Nishant Singh' }, { name: 'Prince Kumar' }, { name: 'Utpal Kumar' }],
  creator: 'Anukalp Gupta',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aicode-explain.vercel.app',
    title: 'AI Code Explain - Understand & Optimize Code Instantly',
    description: 'A powerful AI tool to explain complex code logic and optimize performance using Gemini and Llama 3 models.',
    siteName: 'AI Code Explain',
    images: [
      {
        url: '/og-image.png', // We will need to ensure this asset exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'AI Code Explain Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Code Explain - GLA University Mini Project',
    description: 'Analyze and optimize code with AI. Built for developers and students.',
    creator: '@anukalp',
  },
};
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
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
