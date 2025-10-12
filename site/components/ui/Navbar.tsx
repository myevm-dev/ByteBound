'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Wand2, PlayCircle } from 'lucide-react'

const WalletButton = dynamic(() => import('@/components/wallet/WalletButton'), { ssr: false })

const BACK_DEST = '/choose'
const MARKETING_ROUTES = new Set<string>(['/', '/awards', '/services', '/about'])

export default function Navbar() {
  const rawPath = usePathname() ?? '/'
  const pathname = rawPath.split('?')[0]

  const isMarketing = MARKETING_ROUTES.has(pathname)
  const isMotionPictures = pathname.startsWith('/motion-pictures')
  const showBack = isMotionPictures || pathname.startsWith('/audio') || pathname.startsWith('/books')

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto h-14 px-6 flex items-center gap-4">
        {/* Left: Brand (always) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md overflow-hidden">
            <Image
              src="/byteboundlogo.png"
              alt="Bytebound logo"
              width={32}
              height={32}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-mono text-lg font-semibold text-foreground">
            Bytebound Publishing
          </span>
        </Link>

        {/* Center: Motion Pictures tabs */}
        {isMotionPictures && (
          <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm">
            <Link href="/motion-pictures" className="text-foreground hover:text-muted-foreground transition-colors">
              Home
            </Link>
            <Link href="/motion-pictures?tab=films" className="text-muted-foreground hover:text-foreground transition-colors">
              Films
            </Link>
            <Link href="/motion-pictures?tab=series" className="text-muted-foreground hover:text-foreground transition-colors">
              Series
            </Link>
            <Link href="/motion-pictures?tab=my-list" className="text-muted-foreground hover:text-foreground transition-colors">
              My List
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {isMarketing ? (
            <>
              <Link
                href="/awards"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="inline-flex items-center gap-1">
                  <span className="award-shine">Awards</span>
                </span>
              </Link>
              <Link
                href="/services"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Button size="sm" variant="outline" className="hover:bg-secondary" asChild>
                <Link href="/studio" className="inline-flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" /> Studio
                </Link>
              </Button>
              <Button
                size="sm"
                className="text-primary-foreground bg-gradient-to-r from-accent-secondary to-primary hover:opacity-90"
                asChild
              >
                <Link href="/choose" className="inline-flex items-center gap-1.5">
                  <PlayCircle className="w-3.5 h-3.5" /> Store
                </Link>
              </Button>
            </>
          ) : (
            <>
              {showBack && (
                <Link
                  href={BACK_DEST}
                  className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium
                             bg-background border-accent-secondary text-accent-secondary
                             hover:bg-secondary/40 transition-colors"
                  aria-label="Back to Stores"
                >
                  Back
                </Link>
              )}
              <WalletButton />
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
