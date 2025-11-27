'use client'

import { Sparkles, Zap, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30">
          <span className="text-purple-300 text-sm font-semibold">✨ AI-Powered Evolution</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Your NFT</span>
          <br />
          <span className="text-white">Evolves With You</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Mint a soulbound NFT that transforms based on your on-chain activity.
          Trade, provide liquidity, and watch your digital identity evolve with AI-generated art.
        </p>

        <div className="flex justify-center space-x-4 mb-16">
          <a
            href="#mint"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            Mint Your Chara
          </a>
          <a
            href="#features"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-lg transition border border-white/20"
          >
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass p-6 rounded-xl">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Soulbound</h3>
            <p className="text-gray-300">Non-transferable NFTs tied to your wallet identity</p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI-Generated</h3>
            <p className="text-gray-300">Unique artwork created by AI for each evolution</p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Activity-Based</h3>
            <p className="text-gray-300">Evolves based on your on-chain behavior</p>
          </div>
        </div>
      </div>
    </section>
  )
}
