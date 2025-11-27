'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

export function MintSection() {
  const { address, isConnected } = useAccount()
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState<string>('')

  // Read contract data
  const { data: mintPrice } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintPrice',
  })

  const { data: totalMinted } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalMinted',
  })

  const { data: maxSupply } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'maxSupply',
  })

  const { data: mintingActive } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintingActive',
  })

  const { data: numberMinted } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'numberMinted',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  // Write contract
  const { write: mint, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mint',
  })

  const { isLoading: isWaitingForTx, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  useEffect(() => {
    if (mintData?.hash) {
      setTxHash(mintData.hash)
    }
  }, [mintData])

  useEffect(() => {
    if (isTxSuccess) {
      setIsMinting(false)
    }
  }, [isTxSuccess])

  const handleMint = async () => {
    if (!isConnected || !mint || !mintPrice) return

    try {
      setIsMinting(true)
      mint({
        value: mintPrice as bigint,
      })
    } catch (error) {
      console.error('Mint error:', error)
      setIsMinting(false)
    }
  }

  const formatPrice = (price: bigint | undefined) => {
    if (!price) return '0'
    return (Number(price) / 1e18).toFixed(3)
  }

  const hasMinted = numberMinted && Number(numberMinted) > 0

  return (
    <section id="mint" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            Mint Your Chara NFT
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Start your evolution journey on Polygon
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Price</p>
              <p className="text-white font-bold text-xl">{formatPrice(mintPrice as bigint)} POL</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Minted</p>
              <p className="text-white font-bold text-xl">
                {totalMinted?.toString() || '0'} / {maxSupply?.toString() || '10000'}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className={`font-bold text-xl ${mintingActive ? 'text-green-400' : 'text-red-400'}`}>
                {mintingActive ? 'Live' : 'Paused'}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Your NFTs</p>
              <p className="text-white font-bold text-xl">{numberMinted?.toString() || '0'}</p>
            </div>
          </div>

          {/* Mint Button */}
          <div className="space-y-4">
            {!isConnected ? (
              <div className="text-center p-8 bg-yellow-600/10 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-300">Please connect your wallet to mint</p>
              </div>
            ) : !mintingActive ? (
              <div className="text-center p-8 bg-red-600/10 rounded-lg border border-red-500/30">
                <p className="text-red-300">Minting is currently paused</p>
              </div>
            ) : hasMinted ? (
              <div className="text-center p-8 bg-green-600/10 rounded-lg border border-green-500/30">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-green-300 font-semibold mb-2">You've already minted your Chara!</p>
                <p className="text-gray-400 text-sm">Each wallet can only mint one NFT</p>
              </div>
            ) : (
              <button
                onClick={handleMint}
                disabled={isMinting || isWaitingForTx}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center justify-center space-x-2"
              >
                {isMinting || isWaitingForTx ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isWaitingForTx ? 'Confirming...' : 'Minting...'}</span>
                  </>
                ) : (
                  <span>Mint Now for {formatPrice(mintPrice as bigint)} POL</span>
                )}
              </button>
            )}

            {/* Transaction Status */}
            {txHash && (
              <div className="mt-4 p-4 bg-blue-600/10 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 text-sm mb-2">Transaction submitted!</p>
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline break-all"
                >
                  View on Polygonscan →
                </a>
              </div>
            )}

            {isTxSuccess && (
              <div className="mt-4 p-4 bg-green-600/10 rounded-lg border border-green-500/30 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 font-semibold">Mint successful! Your Chara is ready to evolve.</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-purple-600/10 rounded-lg border border-purple-500/30">
            <h4 className="text-white font-semibold mb-2">🔒 Soulbound NFT</h4>
            <p className="text-gray-300 text-sm">
              Your Chara NFT is permanently bound to your wallet and cannot be transferred.
              It evolves uniquely based on YOUR on-chain activity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
