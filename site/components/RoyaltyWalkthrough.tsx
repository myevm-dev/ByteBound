'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export default function RoyaltyWalkthrough() {
  return (
    <Accordion type="multiple" className="space-y-4">

      {/* 1. Royalty Routing */}
      <AccordionItem value="royalty-routing">
        <AccordionTrigger>1. Royalty Routing & Revenue Management</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Handles the distribution of funds from monetized content (sales, licenses, rentals) based on pre-set royalty rules from the Registry.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>ContentNFT must be registered in the Registry</li>
            <li>Royalty map must be defined and immutable</li>
            <li>Content vault must hold funds (from USDC sale, license, etc.)</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`record_revenue_event:
- Logs a revenue trigger (optional indexer hook)
- Tracks amount + source

distribute_royalties:
- Reads royalty map from ContentAccount (Registry)
- Splits tokens to each destination vault

withdraw_from_vault:
- Called by studio or IPAsset owner to claim earned tokens
- Only callable by current NFT holder or authority`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 2. Licensing */}
      <AccordionItem value="licensing">
        <AccordionTrigger>2. Licensing IPAssets & ContentNFTs</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Users can pay to license AI actors, music, or full content items. A license token (NFT) may be minted as proof.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>IPAsset or ContentNFT must be registered in the Registry</li>
            <li>License parameters defined (price, duration, scope)</li>
            <li>User pays USDC to vault</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`license_ip_asset:
- Transfers USDC from user to IPAsset vault
- Mints license NFT with metadata (use case, expiration)

license_content:
- Same flow as IPAsset licensing
- Used for ads, rebroadcast rights, remixes

mint_license_token:
- Called internally after license is granted
- Encodes access or usage rights in metadata`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 3. Rentals & Time-Limited Access */}
      <AccordionItem value="rentals">
        <AccordionTrigger>3. Content & IP Rentals</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Enables short-term access to a content item or asset. Useful for limited-time ads, voice model rentals, or previews.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Registered asset or content is marked as rentable</li>
            <li>Rental price and expiration are set</li>
            <li>User wallet approved to receive rental token</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`rent_content:
- User pays rental fee (e.g. 3-day film access)
- Mints expiring token or stores access timestamp

rent_ip_asset:
- Rents actor or brand asset for short-term generation use
- Expiration tracked on-chain

expire_rental:
- Invalidates rental after duration ends
- Burns token or blocks access`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 4. Brand Bounties & Product Placement */}
      <AccordionItem value="brand-bounties">
        <AccordionTrigger>4. Brand Bounties & Product Placement</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Allows brands to pay for their product or logo to appear in content. Studios accept bids and receive payouts upon delivery or view count.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Brand creates a registered IPAsset (e.g. "Pepsi Can")</li>
            <li>Studio registers ContentNFT</li>
            <li>Brand submits placement offer</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`submit_product_placement_bid:
- Brand proposes placement bounty
- Specifies USDC amount + requirements

accept_placement_bid:
- Studio agrees and links brand to content
- Payment is routed to studio vault

record_brand_impression:
- Optionally called after view event
- Logs impression or play (used for bonus payout)

distribute_brand_bounty:
- Sends bonus funds to studio + IPAssets involved
- Based on registered royalty map or bonus rules`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 5. Ownership Transfers */}
      <AccordionItem value="ownership-transfers">
        <AccordionTrigger>5. Rights Transfers & Asset Sales</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Users can buy or sell full rights to an IPAsset or ContentNFT, including the vault and any future royalty entitlements.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Asset is fully registered and vault is assigned</li>
            <li>Seller must hold the NFT and sign transfer</li>
            <li>Buyer pays agreed price</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`buy_ip_asset_rights:
- Transfers IPAsset NFT to buyer
- Updates vault authority to new owner

buy_content_rights:
- Transfers ContentNFT + vault ownership
- May include royalty map if designed to allow secondary sale

transfer_license:
- Moves a license NFT to new holder
- Respects metadata permissions (e.g. non-transferable flag)`}
          </pre>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  )
}
