'use client'

import type { ReactNode } from 'react'
import { Sparkles, Shield, Orbit, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="pt-28 pb-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-200/30 bg-cyan-100/10 text-cyan-100 text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE TESTNET REPUTATION LAYER
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl leading-tight font-bold">
            <span className="gradient-text">DeFi Identity</span>
            <br />
            that earns better terms
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/80 max-w-3xl">
            Mint your soulbound Chara on Polygon Amoy. Real wallet activity updates your score, your score unlocks better
            rewards, and every protocol can verify it on-chain.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a
              href="#mint"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 font-bold text-center soft-pulse"
            >
              Mint Chara
            </a>
            <a href="#dashboard" className="px-8 py-3 rounded-xl border border-cyan-200/30 text-cyan-100 text-center">
              View Dashboard
            </a>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard icon={<Shield className="w-7 h-7 text-cyan-200" />} title="Soulbound Trust" text="Non-transferable identity bound to wallet history." delay="reveal-delay-1" />
          <FeatureCard icon={<Orbit className="w-7 h-7 text-cyan-200" />} title="Live Monitoring" text="Backend indexes monitored activity and updates on-chain scores." delay="reveal-delay-2" />
          <FeatureCard icon={<TrendingUp className="w-7 h-7 text-cyan-200" />} title="Protocol Utility" text="Lending, DEX, and yield integrations consume one reputation source." delay="reveal-delay-3" />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, text, delay }: { icon: ReactNode; title: string; text: string; delay: string }) {
  return (
    <div className={`glass rounded-2xl p-6 reveal ${delay}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-slate-200/70 mt-2">{text}</p>
    </div>
  )
}
