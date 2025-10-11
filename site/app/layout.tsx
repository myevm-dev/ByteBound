import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Solana wallet provider + floating connect button (client components)
import WalletContextProvider from '@/components/wallet/WalletProvider'
import FloatingConnect from '@/components/wallet/FloatingConnect'

export const metadata: Metadata = {
  title: 'Bytebound',
  description: '.',

}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <WalletContextProvider>
          {children}
          {/* Shows on Studio/Stores, hidden on landing/info per FloatingConnect logic */}
          <FloatingConnect />
        </WalletContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
