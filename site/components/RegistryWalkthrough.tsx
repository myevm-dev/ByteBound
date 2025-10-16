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
            Users buy and spend internal credits (denominated in USDC) to generate AI content on Bytebound.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>User swaps or has USDC in wallet (6 decimal SPL token)</li>
            <li>App calculates generation cost in credits (1 credit = 1 micro USDC)</li>
            <li>Ensure user has an associated token account (ATA) for USDC</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`buy_generation_credits:
- Accepts USDC transfer to treasury vault
- Increments user credit balance (PDA)

spend_generation_credits:
- Deducts X credits from user's balance
- Emits event for indexing usage`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 2. Studio */}
      <AccordionItem value="studio">
        <AccordionTrigger>2. Studio</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Studios are creative entities registered via Pump.fun tokens. They are the top-level owners of content, collections, and IPAssets.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>User creates a Pump.fun V2 token with 1B total supply</li>
            <li>Studio token transfers 40M (4%) to Bytebound Treasury ATA</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`register_studio:
- Validates Pump.fun token supply (1B)
- Transfers 40M tokens to Bytebound treasury ATA
- Creates StudioAccount PDA

verify_studio:
- Admin function to set verified = true
- Optionally updates logo, name, description`}
          </pre>
        </AccordionContent>
      </AccordionItem>

      {/* 3. Collection */}
      <AccordionItem value="collection">
        <AccordionTrigger>3. Collection (Album, Season, Anthology, Franchise)</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Optional grouping of content NFTs, used to organize works like albums, seasons, or film collections.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Create a Metaplex NFT to represent the collection</li>
            <li>Assign metadata: title, image, description, creator, etc.</li>
            <li>Optionally group using Metaplex verified collection</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`register_collection:
- Creates a CollectionAccount PDA
- Links to Metaplex collection NFT

link_content_to_collection:
- Adds existing ContentNFT to CollectionAccount

add_ip_asset_to_collection:
- References IPAsset used throughout collection

transfer_collection:
- Allows ownership transfer of collection rights`}
          </pre>
        </AccordionContent>
      </AccordionItem>

        {/* 4. ContentNFT */}
        <AccordionItem value="content-nft">
        <AccordionTrigger>4. ContentNFT (Published Work — Song, Ad, Movie)</AccordionTrigger>
        <AccordionContent>
            <p className="mb-2 text-muted-foreground">
            Represents a finished piece of AI-generated media (e.g. film, episode, song, or ad). 
            Can be monetized, linked to a studio and IPAssets, and has immutable royalty routing baked in on registration.
            </p>

            <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Mint NFT via Metaplex (standard or compressed)</li>
            <li>Prepare metadata URI: title, release date, artwork, etc.</li>
            <li>Define initial royalty map: addresses or vaults + % shares</li>
            <li>Initialize associated vault PDA for the ContentNFT</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
            <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
        {`register_content:
        - Creates ContentAccount PDA
        - Stores royalty distribution map (immutable)
        - Associates a royalty vault PDA with the content

        link_ip_assets_to_content:
        - Maps involved IPAssets to this content
        - Used later for routing royalties from marketplace

        set_royalty_distribution:
        - One-time setup of royalty shares
        - Cannot be updated after registration (ensures trust)

        publish_content:
        - Marks content as "live" and ready to be monetized

        update_content_metadata:
        - Allows updating metadata URI (e.g. for remasters or patches)`}
            </pre>
        </AccordionContent>
        </AccordionItem>


      {/* 5. IPAsset */}
      <AccordionItem value="ip-asset">
        <AccordionTrigger>5. IPAsset (Actor, Song, Character, Brand Product, etc.)</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Represents a reusable creative element (actor, voice, brand) that can earn royalties across multiple content pieces.
          </p>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Preflight</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Mint a Metaplex NFT (standard or compressed)</li>
            <li>Define role, royalty %, and metadata URI</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-1 text-sm">Contract Functions</h4>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground">
{`register_ip_asset:
- Registers the NFT as an IPAsset
- Creates vault PDA for royalty deposits

link_ip_asset_to_studio:
- Links the IP to a specific studio

verify_ip_asset:
- Admin function to mark IP as verified
- Useful for real AI agents or certified brands`}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
