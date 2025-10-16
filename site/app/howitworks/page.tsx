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
            <div><strong>Studio:</strong> A publishing/production entity registered as a Pump.fun token.</div>
            <div><strong>Collection:</strong> Optional grouping of content (e.g. an Album, Series, or Season).</div>
            <div><strong>ContentNFT:</strong> A published piece of content like an episode, song, or ad.</div>
            <div><strong>IPAsset:</strong> A reusable identity like an AI actor, brand product, or anything included in production credits.</div>
            <div><strong>Vault:</strong> PDA vault that holds royalties, content, or assets owned by the program.</div>
            <div><strong>USDC:</strong> Stablecoin used to buy generation credits and handle payouts.</div>
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
