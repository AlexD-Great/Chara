'use client'

import { Percent, Shield, Sparkles, TrendingUp, Vote, Wallet } from 'lucide-react'

const FEATURES = [
  {
    icon: <TrendingUp className="w-6 h-6 text-cyan-200" />,
    title: 'Weighted Reputation Scoring',
    desc: 'Six-factor scoring model with transparent on-chain computation.'
  },
  {
    icon: <Percent className="w-6 h-6 text-cyan-200" />,
    title: 'Tiered Interest Discounts',
    desc: 'Higher levels unlock larger basis-point borrowing discounts.'
  },
  {
    icon: <Shield className="w-6 h-6 text-cyan-200" />,
    title: 'Undercollateralized Eligibility',
    desc: 'Level 7+ users can qualify for reduced collateral requirements.'
  },
  {
    icon: <Sparkles className="w-6 h-6 text-cyan-200" />,
    title: 'Evolution Metadata Pipeline',
    desc: 'Artwork and metadata are generated then synced to token URI.'
  },
  {
    icon: <Vote className="w-6 h-6 text-cyan-200" />,
    title: 'Governance-Aware Identity',
    desc: 'Governance participation contributes directly to reputation.'
  },
  {
    icon: <Wallet className="w-6 h-6 text-cyan-200" />,
    title: 'Cross-Protocol Utility',
    desc: 'A single identity can be consumed by multiple DeFi products.'
  }
]

export function Features() {
  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 reveal">
          <h2 className="text-4xl font-bold">
            Why Chara <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-200/75 mt-3 max-w-2xl mx-auto">
            Built for real protocol integration, transparent scoring, and on-chain verifiability on Polygon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="glass rounded-2xl p-5 border border-cyan-100/15 reveal">
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-slate-200/75 mt-2">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
