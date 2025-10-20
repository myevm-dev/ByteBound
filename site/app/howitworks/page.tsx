'use client'

import { useState } from "react"
import { Code2, PiggyBank, Wrench, Film, User as UserIcon } from "lucide-react"
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
            A technical overview of the Bytebound Protocol, including the Registry and Royalties contracts.
            Toggle between contract views to learn what each function does.
          </p>
        </div>

        {/* Ecosystem Actors */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Ecosystem Actors</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <PiggyBank className="w-4 h-4 text-primary" />
                Bytebound Treasury
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Likely DAO account that receives protocol fees. Receives USDC, SOL, and Studio Tokens.
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <Wrench className="w-4 h-4 text-primary" />
                Deployer (Dev)
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Deploys programs and initializes the Registry. The upgrade admin in early environments.
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <Film className="w-4 h-4 text-primary" />
                Studio Owner
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Content Studio + token. Buys generation credits to create IP/Content. Lists on market.
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <UserIcon className="w-4 h-4 text-primary" />
                End User
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pays Studio tokens to purchase, rent, or license content and interact with creative works.
              </p>
            </div>
          </div>
        </section>

        {/* Core Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Terms</h2>

          {/* Row 1: Studio Token + USDC */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Studio Token</div>
              <p className="mt-2 text-sm text-muted-foreground">
                SPL token launched on Pump.Fun and registered. Used for all marketplace payments
                (purchase, rent, IP license, placement).
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold">USDC</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Stablecoin used for buying <em>generation credits</em> in the Registry program payable to Bytebound Treasury.
              </p>
            </div>
          </div>

          {/* Row 2: ContentNFT + IPAsset */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-2xl border p-4">
              <div className="font-semibold">IPAsset NFT</div>
              <p className="mt-2 text-sm text-muted-foreground">
                An NFT representing a reusable creative element like an AI actor, brand product,
                artist, influencer, or other production credit. Recieves its own PDA Vault from the Registry program.
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Content NFT</div>
              <p className="mt-2 text-sm text-muted-foreground">
                A registered NFT creative work (song, episode, film). Recieves its own PDA Vault from the Registry program.
                It can have multiple IPAssets linked as children.
              </p>
            </div>
          </div>

          {/* Row 3: Collection + Vault */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Collection PDA</div>
              <p className="mt-2 text-sm text-muted-foreground">
                A registered vault wrapper (album, tv series, movie trilogy ) that groups multiple pieces of content. It is a PDA Vault from the Registry program.
                It can have multiple Content NFTs linked as children.
              </p>
            </div>

           <div className="rounded-2xl border p-4">
            <div className="font-semibold">Program Derived Vault</div>
            <p className="mt-2 text-sm text-muted-foreground">
              A <strong>vault authority PDA</strong> (for <em>Content</em>, <em>Collection</em>, or <em>IPAsset</em>) that 
              <strong> owns the royalty-receiving token accounts (ATAs)</strong>. The PDA is registered to a specific NFT. 
              Funds live in its ATAs, moved by PDA-signed transactions.

            </p>
          </div>

          </div> 
        </section>

        {/* Contract Toggle */}
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
