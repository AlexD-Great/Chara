'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Loader2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI, HAS_CONTRACT_CONFIG, DEMO_SWAP_ADDRESS, HAS_DEMO_SWAP } from '@/config/contract'

declare global {
  interface Window {
    ethereum?: any
  }
}

type TxState = 'idle' | 'pending' | 'success' | 'error'

const MIN_AMOY_PRIORITY_FEE_GWEI = BigInt(26)
const AMOY_CHAIN_ID = BigInt(80002)

export function MintSection() {
  const [address, setAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [mintPrice, setMintPrice] = useState('0')
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [mintingActive, setMintingActive] = useState(false)
  const [numberMinted, setNumberMinted] = useState(0)
  const [txState, setTxState] = useState<TxState>('idle')
  const [demoTxState, setDemoTxState] = useState<TxState>('idle')
  const [demoTxHash, setDemoTxHash] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkConnection()
    if (HAS_CONTRACT_CONFIG) loadContractData()
  }, [])

  useEffect(() => {
    if (!window.ethereum) return
    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      } else {
        setAddress('')
        setIsConnected(false)
      }
      setTxState('idle')
      setTxHash('')
      setError('')
    }
    window.ethereum.on?.('accountsChanged', onAccountsChanged)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged)
    }
  }, [])

  useEffect(() => {
    if (address && HAS_CONTRACT_CONFIG) {
      loadUserData(address)
    }
  }, [address])

  const checkConnection = async () => {
    if (!window.ethereum) return
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      setAddress(accounts[0])
      setIsConnected(true)
    }
  }

  const loadContractData = async () => {
    try {
      const provider = window.ethereum
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-amoy.polygon.technology')
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const [price, minted, supply, active] = await Promise.all([
        contract.mintPrice(),
        contract.totalMinted(),
        contract.maxSupply(),
        contract.mintingActive()
      ])
      setMintPrice(ethers.formatEther(price))
      setTotalMinted(Number(minted))
      setMaxSupply(Number(supply))
      setMintingActive(Boolean(active))
    } catch (err: any) {
      setError(err.message || 'Failed to load contract')
    }
  }

  const loadUserData = async (wallet: string) => {
    try {
      if (!window.ethereum) return
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const minted = await contract.numberMinted(wallet)
      setNumberMinted(Number(minted))
    } catch {
      setNumberMinted(0)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is required for minting.')
      return
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAddress(accounts[0])
    setIsConnected(true)
    await loadUserData(accounts[0])
  }

  const switchWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is required for wallet switching.')
      return
    }
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })
    } catch {
      // fallback to regular request
    }
    await connectWallet()
  }

  const handleMint = async () => {
    if (!window.ethereum || !HAS_CONTRACT_CONFIG) return
    try {
      setIsMinting(true)
      setTxState('pending')
      setError('')

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const price = await contract.mintPrice()
      const feeOverrides = await getAmoyFeeOverrides(provider)
      const tx = await contract.mint({ value: price, ...feeOverrides })
      setTxHash(tx.hash)
      await tx.wait()

      setTxState('success')
      await loadContractData()
      await loadUserData(address)
    } catch (err: any) {
      setTxState('error')
      setError(err.reason || err.message || 'Mint failed')
    } finally {
      setIsMinting(false)
    }
  }

  const runDemoSwap = async () => {
    if (!window.ethereum || !HAS_DEMO_SWAP) return
    try {
      setDemoTxState('pending')
      setError('')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const abi = ['function demoSwap(uint256 amountOut) external payable']
      const demo = new ethers.Contract(DEMO_SWAP_ADDRESS, abi, signer)
      const feeOverrides = await getAmoyFeeOverrides(provider)
      const tx = await demo.demoSwap(1000, { value: ethers.parseEther('0.001'), ...feeOverrides })
      setDemoTxHash(tx.hash)
      await tx.wait()
      setDemoTxState('success')
    } catch (err: any) {
      setDemoTxState('error')
      setError(err.reason || err.message || 'Demo swap failed')
    }
  }

  return (
    <section id="mint" className="py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-7 md:p-10 reveal reveal-delay-1">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Mint <span className="gradient-text">Your Chara</span>
              </h2>
              <p className="text-slate-200/70 mt-2">One wallet. One soulbound identity. Live score updates.</p>
            </div>
            {HAS_CONTRACT_CONFIG ? (
              <div className="text-sm text-slate-200/65">Polygon Amoy | Chain ID 80002</div>
            ) : (
              <div className="text-sm text-amber-200">Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to enable minting.</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
            <Stat label="Mint Price" value={`${mintPrice || '0'} POL`} />
            <Stat label="Minted" value={`${totalMinted} / ${maxSupply || 0}`} />
            <Stat label="Status" value={mintingActive ? 'Active' : 'Paused'} />
          </div>

          {isConnected && (
            <div className="mb-6 p-4 rounded-xl border border-cyan-200/20 bg-cyan-200/5">
              <div className="text-sm text-slate-300/80">Wallet</div>
              <div className="font-semibold text-cyan-100">{address}</div>
              <div className="text-sm text-slate-300/70 mt-1">Minted by this wallet: {numberMinted}</div>
              <button
                onClick={switchWallet}
                className="mt-3 px-3 py-1.5 text-xs rounded-lg border border-cyan-200/25 bg-slate-900/55 text-cyan-100"
              >
                Use Different Wallet
              </button>
            </div>
          )}

          <div className="space-y-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={!HAS_CONTRACT_CONFIG}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 font-bold disabled:opacity-60"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleMint}
                disabled={!HAS_CONTRACT_CONFIG || isMinting || !mintingActive}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isMinting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isMinting ? 'Minting...' : 'Mint Chara'}
              </button>
            )}

            {txState === 'success' && (
              <div className="p-4 rounded-xl border border-emerald-200/25 bg-emerald-200/8 text-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5" />
                <div>
                  <div className="font-semibold">Mint successful</div>
                  <a className="text-sm underline break-all" href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
                    {txHash}
                  </a>
                </div>
              </div>
            )}

            {(txState === 'error' || error) && (
              <div className="p-4 rounded-xl border border-red-200/25 bg-red-200/8 text-red-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <div>{error || 'Mint failed'}</div>
              </div>
            )}

            {HAS_DEMO_SWAP && isConnected && (
              <div className="pt-4 border-t border-cyan-100/10">
                <p className="text-sm text-slate-300/75 mb-2">
                  Demo action: emit a real on-chain swap-style event for dashboard recording.
                </p>
                <button
                  onClick={runDemoSwap}
                  disabled={demoTxState === 'pending'}
                  className="w-full py-3 rounded-xl border border-cyan-200/25 bg-slate-900/55 text-cyan-100 font-semibold disabled:opacity-60"
                >
                  {demoTxState === 'pending' ? 'Running demo swap...' : 'Run Demo DeFi Tx'}
                </button>
                {demoTxState === 'success' && demoTxHash && (
                  <a
                    href={`https://amoy.polygonscan.com/tx/${demoTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-xs text-cyan-100 underline break-all inline-block"
                  >
                    Demo tx: {demoTxHash}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

async function getAmoyFeeOverrides(provider: ethers.BrowserProvider) {
  try {
    const network = await provider.getNetwork()
    // 80002 = Polygon Amoy
    if (network.chainId !== AMOY_CHAIN_ID) return {}

    const feeData = await provider.getFeeData()
    const minPriority = ethers.parseUnits(MIN_AMOY_PRIORITY_FEE_GWEI.toString(), 'gwei')
    const maxPriorityFeePerGas =
      feeData.maxPriorityFeePerGas && feeData.maxPriorityFeePerGas > minPriority
        ? feeData.maxPriorityFeePerGas
        : minPriority

    const base = feeData.gasPrice ?? ethers.parseUnits('40', 'gwei')
    const maxFeePerGas = base + maxPriorityFeePerGas * BigInt(2)

    return { maxPriorityFeePerGas, maxFeePerGas }
  } catch {
    // Let wallet defaults handle fees if fee fetch fails.
    return {}
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-200/15 bg-slate-900/45 p-4">
      <div className="text-sm text-slate-300/70">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  )
}
