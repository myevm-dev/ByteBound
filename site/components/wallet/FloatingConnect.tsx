'use client'

import { usePathname } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

/**
 * Renders a top-right floating Connect Wallet button on app pages only.
 * Add/remove routes in HIDE to control visibility.
 */
export default function FloatingConnect() {
  const pathname = usePathname()

  // hide on landing/info pages
  const HIDE = new Set<string>([
    '/', '/about', '/services', '/how-it-works', '/awards', '/privacy', '/terms'
  ])
  if (HIDE.has(pathname)) return null

  return (
    <div className="fixed top-3 right-3 z-[60]">
      {/* style wrapper to match your buttons */}
      <div className="rounded-lg shadow-md overflow-hidden">
        <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!opacity-90 !h-10 !px-4 !rounded-lg" />
      </div>
    </div>
  )
}
