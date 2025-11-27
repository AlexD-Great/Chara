'use client'

import { Activity, Palette, Shield, Zap, TrendingUp, Users } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Activity Tracking",
      description: "Your NFT monitors swaps, LP provisions, minting, and more on Polygon"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "AI Art Generation",
      description: "Each evolution creates unique artwork using Stable Diffusion AI"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Soulbound Security",
      description: "Non-transferable NFTs permanently tied to your wallet identity"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Evolution",
      description: "Watch your NFT transform as you interact with the blockchain"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Evolution Levels",
      description: "Progress through multiple stages with increasing rarity and traits"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join a community of evolving identities and compete on-chain"
    }
  ]

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Features That <span className="gradient-text">Evolve</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Chara NFTs are more than static images. They're living, breathing digital identities.
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
              <h4 className="text-white font-semibold mb-2">Mint Your NFT</h4>
              <p className="text-gray-300 text-sm">Connect wallet and mint your soulbound Chara</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="text-white font-semibold mb-2">Be Active On-Chain</h4>
              <p className="text-gray-300 text-sm">Trade, provide liquidity, and interact with Polygon</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="text-white font-semibold mb-2">Watch It Evolve</h4>
              <p className="text-gray-300 text-sm">AI generates new artwork based on your activity</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="text-white font-semibold mb-2">Show Off Your Journey</h4>
              <p className="text-gray-300 text-sm">Display your evolved NFT and on-chain reputation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
