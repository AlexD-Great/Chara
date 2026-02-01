'use client'

import { Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Chara</h3>
            <p className="text-gray-400 text-sm">
              DeFi reputation scoring powered by on-chain activity on Polygon. Build credit, unlock benefits.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#mint" className="text-gray-400 hover:text-white text-sm transition">Mint NFT</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white text-sm transition">Features</a></li>
              <li><a href="#protocols" className="text-gray-400 hover:text-white text-sm transition">Integrations</a></li>
              <li><a href="https://github.com/AlexD-Great/Chara#-roadmap" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Developers</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/AlexD-Great/Chara/tree/main/sdk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">SDK Documentation</a></li>
              <li><a href="https://github.com/AlexD-Great/Chara/tree/main/sdk/examples" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">Integration Examples</a></li>
              <li><a href="https://github.com/AlexD-Great/Chara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">GitHub Repository</a></li>
              <li><a href="https://amoy.polygonscan.com/address/0x5239ad0C0872E9ECB3b8fcd0aB5418C7015C0978" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">Smart Contract</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Network</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Polygon Amoy Testnet</li>
              <li className="text-gray-400 text-sm">Chain ID: 80002</li>
              <li>
                <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-1">
                  Get Test POL <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="https://github.com/AlexD-Great/Chara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Chara. Built for Polygon Hackathon.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">Deployed on</span>
            <a href="https://amoy.polygonscan.com/address/0x5239ad0C0872E9ECB3b8fcd0aB5418C7015C0978" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm transition">
              Polygon Amoy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
