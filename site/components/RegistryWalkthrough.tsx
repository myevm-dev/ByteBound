'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export default function RegistryWalkthrough() {
  return (
    <Accordion type="multiple" className="space-y-4">
      
      {/* 1. Generation Credits */}
      <AccordionItem value="generation-credits">
        <AccordionTrigger>1. Generation Credits</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Users buy and spend internal credits (denominated in USDC, 6 decimals) to generate AI content on Bytebound.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>User wallet holds USDC (mint: <code>external::TEST_USDC_MINT</code>)</li>
            <li>1 credit = 1 micro-USDC (i.e., credits are raw USDC smallest units)</li>
            <li>Ensure ATAs exist:
              <ul className="list-disc pl-6">
                <li>User USDC ATA: owner = user, mint = TEST_USDC_MINT</li>
                <li>Treasury USDC ATA: owner = <code>external::BYTEBOUND_TREASURY</code>, mint = TEST_USDC_MINT</li>
              </ul>
            </li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`buy_generation_credits(credits: u64):
- CPI: token::transfer user_usdc_ata → treasury_usdc_ata for 'credits'
- Initializes/updates UserCredits PDA [\"user-credits\", user]
- Sets user_credits.user, bump; adds 'credits' to balance
- Emits CreditsPurchased { user, amount, mint, to }

spend_generation_credits(credits: u64):
- Checks signer matches user_credits.user; requires balance ≥ credits
- Decrements balance by 'credits'
- Emits CreditsSpent { user, amount }`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 2. Studio */}
      <AccordionItem value="studio">
        <AccordionTrigger>2. Studio</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Studios are registered against a provided SPL token mint (e.g., a Pump.fun token). Verification later locks in a token stake.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Have the studio token mint address ready (passed into <code>register_studio</code>)</li>
            <li>Creator wallet must have &ge; 1 SOL (for <code>register_studio</code> fee to treasury)</li>
            <li>Before calling <code>verify_studio</code>:
              <ul className="list-disc pl-6">
                <li>Creator holds &ge; 40,000,000 × 10<sup>decimals</sup> tokens in their ATA</li>
                <li>Create the <strong>treasury ATA</strong> for this mint (owner = <code>external::BYTEBOUND_TREASURY</code>, allowOwnerOffCurve = true)</li>
              </ul>
            </li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`register_studio(mint: Pubkey):
- Transfers 1 SOL from creator → BYTEBOUND_TREASURY
- Creates StudioAccount PDA [\"studio\", mint] with { creator, token_mint=mint, verified=false, bump }
- No SPL tokens moved here

verify_studio(metadata_uri: String):
- Admin-only (signer must equal config.admin)
- Computes amount = 40,000,000 × 10^mint.decimals
- CPI: token::transfer creator_ata → treasury_ata for 'amount'
- Sets studio_account.verified = true
- Emits StudioVerified { studio, verified_by, metadata_uri }
- Requires pre-existing ATAs:
  - creator_ata (owner = creator, mint = studio token)
  - treasury_ata (owner = BYTEBOUND_TREASURY, mint = studio token, off-curve allowed)`}
          </pre>
        </AccordionContent>
      </AccordionItem>

           {/* 3. Collection */}
      <AccordionItem value="collection">
        <AccordionTrigger>3. Collection (Album, Series, Anthology, Franchise)</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            A Collection is a wrapper PDA with its own vault that can hold or reference multiple ContentNFTs. 
            It behaves like an on-chain folder or franchise container, useful for grouping works.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Mint a Metaplex NFT to represent the collection (album, season, franchise)</li>
            <li>Assign title, description, and artwork metadata</li>
            <li>Optionally create a verified Metaplex collection for UX consistency</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`register_collection(collection_mint, name, uri, type)
- Creates CollectionAccount PDA ["collection", collection_mint]
- Creates CollectionVault PDA ["collection-vault", collection_mint]
- Stores metadata fields and creator authority

link_content_to_collection(collection, content)
- Creates link PDA ["collection-content", collection, content]
- Optionally transfers content NFT → collection vault

unlink_content_from_collection(...)
- Closes link PDA (removes reference or NFT from vault)`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 4. ContentNFT */}
      <AccordionItem value="content-nft">
        <AccordionTrigger>4. ContentNFT (Published Work — Song, Ad, Film)</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            A ContentNFT represents an individual creative work. 
            It can declare production credits (linked IPAssets), assign immutable royalty splits, and belong to a Collection.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Mint or reference an existing Metaplex NFT</li>
            <li>Prepare metadata URI (title, release date, media links)</li>
            <li>Optionally include an array of IPAssets as production credits</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`register_content(content_mint, metadata_uri, use_ip_assets[])
- Creates ContentAccount PDA ["content", content_mint]
- Creates ContentVault PDA ["content-vault", content_mint]
- Optionally links IPAssets declared in use_ip_assets[]
- Stores royalty map (immutable after publish)

link_ip_to_content(content, ip)
- Adds production credit (creates ["content-ip", content, ip] link)

unlink_ip_from_content(content, ip)
- Removes credit (closes link account)

set_royalty_distribution(recipients[], bps[])
- Immutable after publish

publish_content()
- Locks metadata + royalty map; marks content as “live”`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 5. IPAsset */}
      <AccordionItem value="ip-asset">
        <AccordionTrigger>5. IPAsset (Actor, Brand, Voice, Product, etc.)</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            IPAssets are reusable creative NFTs that act as production credits and royalty recipients across multiple contents or collections.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Mint a Metaplex NFT for the IP identity</li>
            <li>Assign metadata URI (name, role, visuals)</li>
            <li>Define default royalty share (basis points)</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
{`register_ip_asset(ip_mint, role, default_bps, uri)
- Creates IPAssetAccount PDA ["ip-asset", ip_mint]
- Creates IPVault PDA ["ip-vault", ip_mint]
- Stores creator, metadata_uri, default royalty rate

link_ip_asset_to_studio(studio)
- Associates this IP with a registered Studio

verify_ip_asset(verified: bool)
- Admin or studio-verifier marks authenticity
- Used for verified AI agents, brands, or creators`}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}