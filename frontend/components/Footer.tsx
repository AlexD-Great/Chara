'use client'

import { ExternalLink, Github } from 'lucide-react'
import { CONTRACT_ADDRESS } from '@/config/contract'

const contractUrl = CONTRACT_ADDRESS ? `https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}` : null

export function Footer() {
  return (
    <footer className="mt-16 py-10 px-4 border-t border-cyan-100/12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-xl font-bold gradient-text">Chara</h3>
          <p className="text-sm text-slate-300/75 mt-2">On-chain DeFi reputation identity for Polygon protocols.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Navigate</h4>
          <ul className="space-y-1 text-sm text-slate-300/75">
            <li><a href="#mint">Mint</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#protocols">Protocols</a></li>
            <li><a href="#features">Benefits</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Developers</h4>
          <ul className="space-y-1 text-sm text-slate-300/75">
            <li><a href="https://github.com/AlexD-Great/Chara/tree/main/sdk" target="_blank" rel="noreferrer">SDK</a></li>
            <li><a href="https://github.com/AlexD-Great/Chara/tree/main/sdk/examples" target="_blank" rel="noreferrer">Examples</a></li>
            {contractUrl && (
              <li>
                <a href={contractUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                  Contract <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Network</h4>
          <p className="text-sm text-slate-300/75">Polygon Amoy Testnet</p>
          <p className="text-sm text-slate-300/75">Chain ID 80002</p>
          <a href="https://faucet.polygon.technology/" target="_blank" rel="noreferrer" className="text-sm text-cyan-100 inline-flex items-center gap-1 mt-2">
            Get Test POL <ExternalLink className="w-3 h-3" />
          </a>
          <div className="mt-3">
            <a href="https://github.com/AlexD-Great/Chara" target="_blank" rel="noreferrer">
              <Github className="w-5 h-5 text-slate-200/80" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-cyan-100/10 text-sm text-slate-300/65">
        Chara testnet build • {new Date().getFullYear()}
      </div>
    </footer>
  )
}
