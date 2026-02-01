'use client'

import { useState } from 'react'
import { Building2, TrendingUp, Droplet, Vote, Shield, Zap, ExternalLink } from 'lucide-react'

interface Protocol {
  name: string
  category: string
  icon: any
  benefits: string[]
  minLevel: number
  color: string
  tvl?: string
  users?: string
}

const PROTOCOLS: Protocol[] = [
  {
    name: 'QuickSwap',
    category: 'DEX',
    icon: TrendingUp,
    benefits: [
      'Level 3+: 10% fee discount',
      'Level 5+: 25% fee discount',
      'Level 7+: 50% fee discount',
      'Level 9+: Zero fees'
    ],
    minLevel: 3,
    color: 'from-blue-500 to-cyan-500',
    tvl: '$450M',
    users: '125K'
  },
  {
    name: 'Aave-Style Lending',
    category: 'Lending',
    icon: Shield,
    benefits: [
      'Level 5+: 0.5% interest discount',
      'Level 7+: 2% interest discount',
      'Level 8+: Undercollateralized loans',
      'Level 9+: Priority liquidation protection'
    ],
    minLevel: 5,
    color: 'from-purple-500 to-pink-500',
    tvl: '$1.2B',
    users: '89K'
  },
  {
    name: 'Yield Farms',
    category: 'Yield',
    icon: Droplet,
    benefits: [
      'Level 3+: 1.2x APY multiplier',
      'Level 5+: 1.5x APY multiplier',
      'Level 7+: 2x APY multiplier',
      'Level 9+: 3x APY multiplier'
    ],
    minLevel: 3,
    color: 'from-green-500 to-emerald-500',
    tvl: '$320M',
    users: '67K'
  },
  {
    name: 'Governance DAOs',
    category: 'Governance',
    icon: Vote,
    benefits: [
      'Level 5+: 1.5x voting power',
      'Level 7+: Proposal creation rights',
      'Level 8+: 2x voting power',
      'Level 9+: Veto power on critical votes'
    ],
    minLevel: 5,
    color: 'from-yellow-500 to-orange-500',
    tvl: 'N/A',
    users: '34K'
  },
  {
    name: 'Options Trading',
    category: 'Derivatives',
    icon: Zap,
    benefits: [
      'Level 6+: Access to options trading',
      'Level 7+: Reduced margin requirements',
      'Level 8+: Advanced order types',
      'Level 9+: Market maker privileges'
    ],
    minLevel: 6,
    color: 'from-red-500 to-pink-500',
    tvl: '$180M',
    users: '23K'
  },
  {
    name: 'Insurance Protocols',
    category: 'Insurance',
    icon: Shield,
    benefits: [
      'Level 5+: 10% premium discount',
      'Level 7+: 25% premium discount',
      'Level 8+: Priority claims processing',
      'Level 9+: Underwriting opportunities'
    ],
    minLevel: 5,
    color: 'from-indigo-500 to-purple-500',
    tvl: '$95M',
    users: '12K'
  }
]

export function ProtocolShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(PROTOCOLS.map(p => p.category)))]
  const filteredProtocols = selectedCategory === 'all' 
    ? PROTOCOLS 
    : PROTOCOLS.filter(p => p.category === selectedCategory)

  return (
    <section id="protocols" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Protocol Integrations
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Your Chara reputation unlocks exclusive benefits across the Polygon DeFi ecosystem
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProtocols.map((protocol, index) => {
            const Icon = protocol.icon
            return (
              <div
                key={index}
                className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${protocol.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                    {protocol.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{protocol.name}</h3>
                
                {protocol.tvl && protocol.users && (
                  <div className="flex gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-white/50">TVL: </span>
                      <span className="text-white font-semibold">{protocol.tvl}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Users: </span>
                      <span className="text-white font-semibold">{protocol.users}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {protocol.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-white/70">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-white/50">
                    Minimum Level: <span className="text-purple-400 font-semibold">Level {protocol.minLevel}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Integration Guide */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">For Protocol Developers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Why Integrate Chara?</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Attract high-quality, engaged users to your protocol</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Reduce risk with verified on-chain reputation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Build loyalty with reputation-based rewards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Differentiate with unique user benefits</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Integration Steps</h4>
              <ol className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-semibold">1.</span>
                  <span>Install Chara SDK: <code className="text-purple-300">npm install @chara/sdk</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-semibold">2.</span>
                  <span>Import and initialize the SDK in your smart contract</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-semibold">3.</span>
                  <span>Define reputation-based benefits and tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-semibold">4.</span>
                  <span>Test integration on testnet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-semibold">5.</span>
                  <span>Deploy and submit for listing</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href="https://github.com/AlexD-Great/Chara/tree/main/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition transform hover:scale-105 flex items-center gap-2"
            >
              View SDK Documentation
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/AlexD-Great/Chara/tree/main/sdk/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition border border-white/20 flex items-center gap-2"
            >
              Integration Examples
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="glass rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-bold text-purple-400">{PROTOCOLS.length}</div>
            <div className="text-sm text-white/60">Integrated Protocols</div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400">$2.2B+</div>
            <div className="text-sm text-white/60">Total TVL</div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400">350K+</div>
            <div className="text-sm text-white/60">Active Users</div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-bold text-yellow-400">15+</div>
            <div className="text-sm text-white/60">More Coming</div>
          </div>
        </div>
      </div>
    </section>
  )
}
