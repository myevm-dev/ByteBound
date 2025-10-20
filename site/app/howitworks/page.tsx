'use client'

import { useState } from "react"
import { Code2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Walkthroughs
import RegistryWalkthrough from "@/components/RegistryWalkthrough"
import RoyaltyWalkthrough from "@/components/RoyaltyWalkthrough"

export default function HowItWorksPage() {
  const [activeContract, setActiveContract] = useState<"registry" | "royalties">("registry")

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="container mx-auto max-w-5xl space-y-12">
        {/* Page Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span>Technical Overview</span>
          </div>
          <h1 className="text-5xl font-bold">How It Works</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            A technical overview of the Bytebound Protocol, including the Registry and Royalties contracts. Toggle
            between contract views to learn what each function does.
          </p>
        </div>

        {/* Term Definitions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Terms</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <strong>Studio:</strong> A publishing/production entity represented by a Pump.fun token (<em>studio mint</em>).
              Listings’ <code>currency_mint</code> equals this studio mint.
            </div>
            <div>
              <strong>Collection:</strong> A wrapper PDA (like an on-chain folder) that groups multiple pieces of content.
              Each has its own vault and can optionally hold the NFTs it references.
            </div>
            <div>
              <strong>ContentNFT:</strong> A registered creative work (song, episode, ad, film). It has its own PDA and
              vault and can credit multiple IPAssets.
            </div>
            <div>
              <strong>IPAsset:</strong> An NFT representing a reusable creative element—an AI actor, brand’s product, or
              other production credit. Can earn royalties from any linked content.
            </div>
            <div>
              <strong>Vault:</strong> A PDA-owned authority per entity (Content/Collection/IPAsset). Its ATAs are owned by an
              <em>off-curve</em> PDA, so create ATAs with <code>allowOwnerOffCurve=true</code>.
            </div>
            <div>
              <strong>USDC:</strong> Stablecoin (6 decimals) used for <em>buying generation credits</em> in the Registry.
              <br />
              <strong>Studio Token:</strong> The token identified by the <em>studio mint</em>; used for all marketplace payments
              (purchase, rent, IP license, placement). Treasury fees (20%) are paid in this token.
            </div>
          </div>
        </section>

        {/* Contract Toggle (centered) */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Contracts</h2>
          <div className="flex justify-center">
            <ToggleGroup
              type="single"
              value={activeContract}
              onValueChange={(v: string | null) => v && setActiveContract(v as "registry" | "royalties")}
              className="inline-flex flex-wrap justify-center gap-2"
              aria-label="Contract selector"
            >
              <ToggleGroupItem value="registry" className="px-4 py-2">
                Registry (Accounts) Contract
              </ToggleGroupItem>
              <ToggleGroupItem value="royalties" className="px-4 py-2">
                Marketplace (Royalties) Contract
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </section>

        {/* Function Walkthrough */}
        <section className="mt-6">
          {activeContract === "registry" ? <RegistryWalkthrough /> : <RoyaltyWalkthrough />}
        </section>
      </div>
    </div>
  )
}
