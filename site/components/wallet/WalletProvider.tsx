'use client'

import '@solana/wallet-adapter-react-ui/styles.css'
import { ReactNode, useMemo } from 'react'
import { clusterApiUrl } from '@solana/web3.js'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'

export default function WalletContextProvider({ children }: { children: ReactNode }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'mainnet-beta' // 'devnet' | 'mainnet-beta'
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(network as any)

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()],
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
