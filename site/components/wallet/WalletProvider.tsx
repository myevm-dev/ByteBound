'use client'

import '@solana/wallet-adapter-react-ui/styles.css'
import { ReactNode, useMemo } from 'react'
import { clusterApiUrl, Commitment } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'

type NetworkStr = 'devnet' | 'testnet' | 'mainnet-beta'

export default function WalletContextProvider({ children }: { children: ReactNode }) {
  const network: NetworkStr = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as NetworkStr) || 'mainnet-beta'

  const endpoint = useMemo(() => {
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC?.trim()
    return rpc && rpc.length > 0 ? rpc : clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: network as WalletAdapterNetwork }),
      new BackpackWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' as Commitment }}>
      <WalletProvider wallets={wallets} autoConnect onError={(e) => console.error('Wallet error:', e)}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
