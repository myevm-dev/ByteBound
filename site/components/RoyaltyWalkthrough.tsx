// components/RoyaltyWalkthrough.tsx
'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const PinkNum = ({ n }: { n: number }) => (
  <span className="text-pink-500 font-semibold mr-2">{n}.</span>
)

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-semibold mt-4 mb-1 text-sm text-cyan-400">{children}</h4>
)

export default function RoyaltyWalkthrough() {
  return (
    <Accordion type="multiple" className="space-y-4">

      {/* 1) Listings */}
      <AccordionItem value="listings">
        <AccordionTrigger>
          <PinkNum n={1} /> <span>Listing Functions (Content, Collection, IPAsset)</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Studios list registered items from the <em>Registry</em> (Content, Collection, IPAsset). The Market stores price & currency; no escrow.
            <br />Currency is the <strong>studio token</strong> (the <code>studio_mint</code> you pass), not hardcoded USDC.
          </p>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><strong>Target must be registered in Registry:</strong> provide the matching Registry PDA:
              <ul className="list-disc pl-6">
                <li>Content: <code>["content", content_mint]</code></li>
                <li>Collection: <code>["collection", collection_mint]</code></li>
                <li>IPAsset: <code>["ip-asset", ip_mint]</code></li>
              </ul>
              Market verifies these PDAs are owned by <code>REGISTRY_PROGRAM_ID</code>.
            </li>
            <li><strong>Studio gate:</strong> provide <code>studio_mint</code> and its Registry PDA <code>["studio", studio_mint]</code>.</li>
            <li><strong>Currency lock:</strong> <code>listing.currency_mint = studio_mint</code>. All payer/treasury/vault ATAs used later must be this mint.</li>
            <li><strong>No ATAs needed to list:</strong> ATAs are only required when paying (purchase/rent/license/placement).</li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`list_content_or_collection(kind: u8, target_kind: u8, price: u64, duration_secs: u32)
- kind: PurchaseContent | RentalContent
- target_kind: Content | Collection
- Verifies Registry state PDA for target + Studio PDA
- Creates Listing { seller, kind, target_kind, target_mint, price, currency_mint = studio_mint, duration_secs, active=true }

list_ip_license(price: u64)
- Verifies IpAssetAccount PDA + Studio PDA
- Creates Listing for IP license (currency_mint = studio_mint)

list_placement(target_kind: u8, price: u64)
- For Content/Collection; verifies Registry state PDA + Studio PDA
- Creates Placement listing (bounty-style)

delist()
- Seller-only; sets active=false`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 2) Purchase (20/80 split) */}
      <AccordionItem value="purchase">
        <AccordionTrigger>
          <PinkNum n={2} /> <span>Purchase Functions (Content / Collection)</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Buyer pays in the <strong>studio token</strong>. Helper splits 20% to <code>BYTEBOUND_TREASURY</code>, 80% to the Registry vault.
          </p>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Pass: <code>payer_ata(studio_mint)</code>, <code>treasury_ata(studio_mint, owner=BYTEBOUND_TREASURY)</code>, <code>vault_authority</code>, <code>vault_ata(studio_mint)</code>.</li>
            <li><strong>Vault ATA:</strong> create with <code>allowOwnerOffCurve=true</code> (PDA owner).</li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`purchase()
- require(listing.active && kind == PurchaseContent)
- pay_into_registry_vault_with_fee(...):
  - currency checks: payer_ata.mint == listing.currency_mint == studio_mint
  - treasury_ata.mint == studio_mint AND treasury_ata.owner == BYTEBOUND_TREASURY
  - vault_authority = PDA(["content-vault" | "collection-vault", target_mint], REGISTRY_PROGRAM_ID)
  - vault_ata.owner == vault_authority AND vault_ata.mint == studio_mint
  - split: fee = amount * 20% → treasury_ata; rest → vault_ata
- Emits Purchased`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 3) Rent (20/80 split) */}
      <AccordionItem value="rent">
        <AccordionTrigger>
          <PinkNum n={3} /> <span>Rent Functions (Content / Collection)</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Same split as purchase. Emits the rental end timestamp; enforcement is downstream (off-chain gate or another program).
          </p>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`rent()
- require(listing.active && kind == RentalContent && duration_secs > 0)
- pay_into_registry_vault_with_fee(...)  // same currency & vault checks as purchase
- until_ts = now + duration_secs
- Emits Rented { until_ts }`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 4) IP Licensing (20/80 split) */}
      <AccordionItem value="ip">
        <AccordionTrigger>
          <PinkNum n={4} /> <span>Licensing Function (IPAssets)</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Licensee pays in the studio token. Funds split 20% Treasury / 80% to the IP vault PDA.
          </p>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`use_ip()
- require(listing.active && kind == IpLicense)
- pay_into_registry_vault_with_fee(...)
  - vault_authority = PDA(["ip-vault", ip_mint], REGISTRY_PROGRAM_ID)
- Emits IpLicensed`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 5) Placement / Bounties (no fee) */}
      <AccordionItem value="placement">
        <AccordionTrigger>
          <PinkNum n={5} /> <span>Placement / Advertising Function (IPAssets)</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Third parties add incentives (studio token) to a Content/Collection vault; 100% goes to the vault (no 20% fee).
          </p>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`add_placement_funds(amount)
- require(listing.active && kind == Placement)
- pay_into_registry_vault(...)
  - currency check == listing.currency_mint (studio_mint)
  - vault_authority/ATA checks as above
- Emits PlacementFunded`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 6) Integration Checklist (merged 6/7/8) */}
      <AccordionItem value="common">
        <AccordionTrigger>
          <PinkNum n={6} /> <span>Common Rules (PDAs, Security, Accounts)</span>
        </AccordionTrigger>
        <AccordionContent>
          <SubTitle>Verify PDAs (owned by Registry)</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><strong>Registry State:</strong> PDA(<code>["content"|"collection"|"ip-asset", mint]</code>, <code>REGISTRY_PROGRAM_ID</code>) is owned by <code>REGISTRY_PROGRAM_ID</code>.</li>
            <li><strong>Studio:</strong> PDA(<code>["studio", studio_mint]</code>, <code>REGISTRY_PROGRAM_ID</code>).</li>
            <li><strong>Vault Authority:</strong> PDA(<code>["content-vault"|"collection-vault"|"ip-vault", mint]</code>, <code>REGISTRY_PROGRAM_ID</code>).</li>
          </ul>

          <SubTitle>Security Invariants</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><code>listing.active == true</code> required for all actions.</li>
            <li><code>listing.currency_mint == studio_mint</code>. Every ATA (payer, treasury, vault) uses that mint.</li>
            <li>Treasury ATA must be owned by <code>BYTEBOUND_TREASURY</code>.</li>
            <li>Market only routes funds; no CPI writes into Registry.</li>
          </ul>

          <SubTitle>Accounts to Pass</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><strong>Listing creation:</strong> <code>target_mint</code>, target Registry PDA, <code>studio_mint</code>, Studio PDA.</li>
            <li><strong>purchase / rent / use_ip:</strong> <code>payer_ata(studio_mint)</code>, <code>treasury_ata(studio_mint, owner=BYTEBOUND_TREASURY)</code>, <code>vault_authority</code>, <code>vault_ata(studio_mint, allowOwnerOffCurve)</code>.</li>
            <li><strong>add_placement_funds:</strong> omit Treasury; pass <code>vault_authority</code> + <code>vault_ata</code>.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
