import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import WalletContextProvider from '@/components/wallet/WalletProvider'
import Navbar from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Bytebound',
  description: '.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <WalletContextProvider>
          <Navbar />     {/* globally visible on ALL pages */}
          {children}
        </WalletContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
