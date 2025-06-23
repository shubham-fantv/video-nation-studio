'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, optimism, solana } from '@reown/appkit/networks'
import { wagmiAdapter, projectId } from '../config/index'
import { cookieToInitialState, WagmiProvider } from 'wagmi'

// Initialize React Query client
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// AppKit metadata
const metadata = {
  name: 'appkit-example',
  description: 'Video Studio',
  url: 'http://localhost:3000/', // must match your domain
  icons: ['http://localhost:3000/images/logo.svg']
}

// Create AppKit modal instance
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, optimism, solana],
  defaultNetwork: mainnet,
  metadata: {
    name: 'appkit-example',
    description: 'Video Studio',
    url: 'http://localhost:3000/',
    icons: ['http://localhost:3000/images/logo.svg'],
  },
  features: { 
    analytics: true ,  
    email: false,          // disables email login
    socials: [] 
  },
  enableInjected: true,
  connectorImages: {
    // EIP‑6963 wallets
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96': '/images/icons/metamask.png',
    // Fallback for injected providers
    injected: '/images/icons/metamask.png',
    walletConnect: '/images/icons/wallet-connect.png',
  },
  featuredWalletIds: ['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', 'walletConnect'],
})

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export { ContextProvider, modal }
