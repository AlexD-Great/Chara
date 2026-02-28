'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { MintSection } from '../components/MintSection'
import { ReputationDashboard } from '../components/ReputationDashboard'
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
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />
      <Hero />
      <MintSection />
      <ReputationDashboard />
      <ProtocolShowcase />
      <Features />
      <Footer />
    </main>
  )
}
