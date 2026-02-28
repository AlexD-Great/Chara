'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'

declare global {
  interface Window {
    ethereum?: any
  }
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Navbar() {
  const [address, setAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!window.ethereum) return
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    })()
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) return
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAddress(accounts[0])
    setIsConnected(true)
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13882' }]
      })
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13882',
              chainName: 'Polygon Amoy Testnet',
              nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
              rpcUrls: ['https://rpc-amoy.polygon.technology'],
              blockExplorers: [{ name: 'PolygonScan', url: 'https://amoy.polygonscan.com' }]
            }
          ]
        })
      }
    }
  }

  const links = [
    { href: '#mint', label: 'Mint' },
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#protocols', label: 'Protocols' },
    { href: '#features', label: 'Benefits' }
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-cyan-200/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 reveal">
          <Sparkles className="w-6 h-6 text-cyan-300" />
          <span className="text-2xl font-bold gradient-text">Chara</span>
        </a>

        <div className="hidden md:flex items-center gap-7 text-sm text-slate-200/90">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-cyan-200 transition">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isConnected ? (
            <div className="px-4 py-2 rounded-xl border border-cyan-200/25 bg-cyan-300/8 text-cyan-100 text-sm">
              {shortAddress(address)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-5 py-2 rounded-xl text-slate-950 font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300 hover:opacity-95 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <button className="md:hidden text-slate-100" onClick={() => setOpen((v) => !v)} aria-label="menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-cyan-200/10 bg-slate-950/90 px-4 py-4 space-y-3">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="block text-slate-200" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="w-full mt-2 px-4 py-2 rounded-xl text-slate-950 font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
