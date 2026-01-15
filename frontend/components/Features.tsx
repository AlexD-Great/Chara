'use client'

import { TrendingUp, Percent, Shield, Zap, Award, Lock } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "2x Reward Multiplier",
      description: "Earn up to 2x rewards on yields and farming across integrated Polygon protocols"
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: "5% Interest Discount",
      description: "Save up to 5% on borrowing costs with better interest rates based on reputation"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Undercollateralized Loans",
      description: "Unlock 110% collateral loans at Level 7+ instead of standard 150%"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fee Discounts",
      description: "Pay reduced trading fees on integrated DEXs as your reputation grows"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Portable Reputation",
      description: "One soulbound NFT works across all integrated Polygon DeFi protocols"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Priority Access",
      description: "Early access to new pools, IDOs, and governance proposals at higher levels"
    }
  ]

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Unlock <span className="gradient-text">Real Benefits</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your reputation unlocks financial benefits across Polygon DeFi. Better rates, higher yields, and exclusive access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass p-8 rounded-xl hover:scale-105 transition-transform duration-300"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 glass p-8 rounded-2xl">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="text-white font-semibold mb-2">Mint Your Chara</h4>
              <p className="text-gray-300 text-sm">Get your soulbound reputation NFT to start building credit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="text-white font-semibold mb-2">Engage in DeFi</h4>
              <p className="text-gray-300 text-sm">Trade, provide liquidity, take loans, and participate in governance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="text-white font-semibold mb-2">Build Reputation</h4>
              <p className="text-gray-300 text-sm">Your score increases with responsible DeFi activity and history</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="text-white font-semibold mb-2">Unlock Benefits</h4>
              <p className="text-gray-300 text-sm">Access better rates, higher yields, and exclusive opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
