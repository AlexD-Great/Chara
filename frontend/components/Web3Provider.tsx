'use client'

import { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonAmoy, polygon],
  [w3mProvider({ projectId }), publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
  webSocketPublicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
