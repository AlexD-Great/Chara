import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk, Spectral } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
})

const spectral = Spectral({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Chara - Evolving NFTs',
  description: 'AI-powered NFTs that evolve based on your on-chain activity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${spectral.variable}`}>
        {children}
      </body>
    </html>
  )
}
