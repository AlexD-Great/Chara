'use client'

import { Github, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Chara</h3>
            <p className="text-gray-400 text-sm">
              Evolving NFTs powered by AI and on-chain activity on Polygon.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#mint" className="text-gray-400 hover:text-white text-sm transition">Mint</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white text-sm transition">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Roadmap</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Whitepaper</a></li>
              <li><a href="https://github.com/AlexD-Great/Chara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition">GitHub</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/AlexD-Great/Chara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Chara. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
