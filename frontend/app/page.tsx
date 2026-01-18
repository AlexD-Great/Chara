'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { MintSection } from '../components/MintSection'
import { ReputationSection } from '../components/ReputationSection'
import { ProtocolShowcase } from '../components/ProtocolShowcase'
import { Features } from '../components/Features'
import { Footer } from '../components/Footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <Hero />
      <MintSection />
      <ReputationSection />
      <ProtocolShowcase />
      <Features />
      <Footer />
    </main>
  )
}
