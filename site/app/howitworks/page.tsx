'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Code2 } from "lucide-react"
import Link from "next/link"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// 🔽 NEW: Walkthrough Components
import RegistryWalkthrough from "@/components/RegistryWalkthrough"
import RoyaltyWalkthrough from "@/components/RoyaltyWalkthrough"

export default function HowItWorksPage() {
  const [activeContract, setActiveContract] = useState("registry")

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
            A technical overview of the Bytebound Protocol, including the Registry and Royalties contracts. Toggle between contract views to learn what each function does.
          </p>
        </div>

        {/* Term Definitions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Terms</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div><strong>Studio:</strong> A publishing or production entity represented by a Pump.fun token. Studios can own content and verify IPAssets.</div>
            <div><strong>Collection:</strong> A wrapper PDA (like an on-chain folder) that groups multiple pieces of content. Each has its own vault and can optionally hold the NFTs it references.</div>
            <div><strong>ContentNFT:</strong> A registered creative work (song, episode, ad, film). It has its own PDA and vault, defines immutable royalties, and can credit multiple IPAssets.</div>
            <div><strong>IPAsset:</strong> An NFT representing a reusable creative element—an AI actor, brand's product, or other production credit. Can earn royalties from any linked content.</div>
            <div><strong>Vault:</strong> A PDA-owned wallet that can hold SPL tokens, NFTs, or royalties for its associated entity (Studio, Collection, Content, or IPAsset).</div>
            <div><strong>USDC:</strong> The stablecoin (6 decimals) used for buying generation credits, paying for content, and distributing royalties.</div>
          </div>
        </section>


        {/* Contract Toggle */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contracts</h2>
          <ToggleGroup
            type="single"
            defaultValue="registry"
            onValueChange={(val: string) => setActiveContract(val)}
          >
            <ToggleGroupItem value="registry">🟣 Registry Contract</ToggleGroupItem>
            <ToggleGroupItem value="royalties">💸 Royalties & Marketplace</ToggleGroupItem>

          </ToggleGroup>
        </section>

        {/* Function Walkthrough */}
        <section className="mt-6">
          {activeContract === "registry" ? <RegistryWalkthrough /> : <RoyaltyWalkthrough />}
        </section>
      </div>
    </div>
  )
}
