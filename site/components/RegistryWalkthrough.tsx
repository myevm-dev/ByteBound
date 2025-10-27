'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const PinkNum = ({ n }: { n: number }) => (
  <span className="text-pink-500 font-semibold mr-2">{n}.</span>
)

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-semibold mt-4 mb-1 text-sm text-cyan-400">{children}</h4>
)

export default function RegistryWalkthrough() {
  return (
    <Accordion type="multiple" className="space-y-4">

      {/* 1) Generation Credits */}
      <AccordionItem value="generation-credits">
        <AccordionTrigger>
          <PinkNum n={1} /> <span>Generation Credits Functions</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Credits are internal units backed by USDC (6 decimals). Users buy credits by transferring USDC to the treasury,
            then spend credits during AI generation.
          </p>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>USDC mint: <code>external::TEST_USDC_MINT</code></li>
            <li>Idempotent-create ATAs (client-side):
              <ul className="list-disc pl-6">
                <li>User USDC ATA: owner = <em>user</em>, mint = <code>TEST_USDC_MINT</code></li>
                <li>Treasury USDC ATA: owner = <code>external::BYTEBOUND_TREASURY</code>, mint = <code>TEST_USDC_MINT</code></li>
              </ul>
            </li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`buy_generation_credits(credits: u64)
- CPI: token::transfer user_usdc_ata → treasury_usdc_ata for 'credits'
- init_if_needed UserCredits PDA ["user-credits", user]
- user_credits.balance += credits
- Emits CreditsPurchased { user, amount, mint=TEST_USDC_MINT, to=treasury_ata }

spend_generation_credits(credits: u64)
- require(user_credits.user == signer)
- require(balance ≥ credits)
- user_credits.balance -= credits
- Emits CreditsSpent { user, amount }`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 2) Studio */}
      <AccordionItem value="studio">
        <AccordionTrigger>
          <PinkNum n={2} /> <span>Studio Functions</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            A Studio is registered against a provided token mint (e.g. Pump.fun). Verification enforces a token stake.
          </p>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><strong>Before</strong> calling <code>verify_studio</code>:
              <ul className="list-disc pl-6">
                <li>Creator holds ≥ <code>40,000,000 × 10^mint.decimals</code> of the studio token.</li>
                <li>ATAs exist for the <strong>same studio token mint</strong>:
                  <ul className="list-disc pl-6">
                    <li><code>creator_ata</code>: owner = <em>creator</em>, mint = <em>studio token mint</em></li>
                    <li><code>treasury_ata</code>: owner = <code>external::BYTEBOUND_TREASURY</code>, mint = <em>studio token mint</em></li>
                  </ul>
                </li>
                <li>Signers: <em>admin</em> (verifier) and <em>creator</em> (token authority).</li>
              </ul>
            </li>
            <li className="mt-2 italic text-muted-foreground">
              Note: <code>PUMPFUN_V2_PROGRAM</code> is defined in the module but not used by these instructions.
            </li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`register_studio(mint: Pubkey)
- System transfer: 1 SOL creator → BYTEBOUND_TREASURY
- Init StudioAccount PDA ["studio", mint] with { creator, token_mint=mint, verified=false, bump }

verify_studio(metadata_uri: String)
- (Optional) check admin == config.admin (commented in code)
- Compute stake = 40,000,000 × 10^mint.decimals
- CPI: token::transfer creator_ata → treasury_ata for 'stake'
- studio_account.verified = true
- Emits StudioVerified { studio, verified_by=admin, metadata_uri }`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 3) IPAsset */}
      <AccordionItem value="ip-asset">
        <AccordionTrigger>
          <PinkNum n={3} /> <span>IPAsset NFT Functions</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Registers an existing Metaplex NFT mint as an IPAsset. The program derives a vault-authority PDA per mint to own ATAs.
          </p>

          <SubTitle>Derivations</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>State PDA: <code>["ip-asset", ip_mint]</code> → <code>IpAssetAccount</code></li>
            <li>Vault authority PDA: <code>["ip-vault", ip_mint]</code> → stored in <code>ip_asset.vault_authority</code></li>
          </ul>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Create any needed ATAs owned by <code>vault_authority</code> with <code>allowOwnerOffCurve=true</code>.</li>
            <li>FEE constant is in lamports; adjust UI copy accordingly.</li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`register_ip_asset()    // ip_mint passed as ACCOUNT
- require: studio for 'studio_mint' is verified (pass studio_mint + ["studio", studio_mint] PDA)
- System transfer: pay_treasury(owner → BYTEBOUND_TREASURY, amount = FEE_IP_ASSET)
- Init IpAssetAccount PDA ["ip-asset", ip_mint]
- Derive & store vault_authority = PDA(["ip-vault", ip_mint])
- Emits IpAssetRegistered { owner, ip_mint, vault_authority }

withdraw_ip_asset_royalties(amount: u64)
- require(caller == ip_asset.owner)
- require(vault_ata.owner == vault_authority && vault_ata.mint == recipient_ata.mint)
- Program signs with PDA(["ip-vault", ip_mint]) to transfer 'amount'`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 4) Content */}
      <AccordionItem value="content">
        <AccordionTrigger>
          <PinkNum n={4} /> <span>Content NFT Functions</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            Registers a Content NFT (song, ad, film, episode). Each Content has a vault-authority PDA and can link many IPAssets.
          </p>

          <SubTitle>Derivations</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>State PDA: <code>["content", content_mint]</code> → <code>ContentAccount</code></li>
            <li>Vault authority PDA: <code>["content-vault", content_mint]</code> → stored in <code>content.vault_authority</code></li>
          </ul>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Idempotent-create <code>vault_ata</code> with <code>allowOwnerOffCurve=true</code> for any SPL mint you’ll receive.</li>
            <li>FEE constant is in lamports; reflect in UI.</li>
            <li>On-chain vector sizing: default reserves space for ~10 IP links (see <code>ContentAccount::SIZE</code>).</li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`register_content()     // content_mint as ACCOUNT
- require: studio verified (pass studio_mint + ["studio", studio_mint] PDA)
- System transfer: pay_treasury(owner → BYTEBOUND_TREASURY, amount = FEE_CONTENT)
- Init ContentAccount PDA ["content", content_mint] { ip_assets: Vec::new(), ... }
- Derive & store vault_authority = PDA(["content-vault", content_mint])
- Emits ContentRegistered { owner, content_mint, vault_authority }

link_ip_asset_to_content()
- require(caller == content.owner)
- De-dup push IpAssetAccount PDA into content.ip_assets
- Emits IpLinkedToContent { content_pda, ip_pda }

withdraw_content_royalties(amount: u64)
- require(caller == content.owner)
- require(vault_ata.owner == vault_authority && vault_ata.mint == recipient_ata.mint)
- PDA(["content-vault", content_mint]) signs and transfers 'amount'`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 5) Collection */}
      <AccordionItem value="collection">
        <AccordionTrigger>
          <PinkNum n={5} /> <span>Collection Functions</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-muted-foreground">
            A Collection groups Content NFTs. It has a vault-authority PDA and can hold assets/NFTs via PDA-owned ATAs.
          </p>

          <SubTitle>Derivations</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>State PDA: <code>["collection", collection_mint]</code> → <code>CollectionAccount</code></li>
            <li>Vault authority PDA: <code>["collection-vault", collection_mint]</code> → stored in <code>collection.vault_authority</code></li>
          </ul>

          <SubTitle>Client Notes</SubTitle>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Create <code>vault_ata</code> with <code>allowOwnerOffCurve=true</code>.</li>
            <li>To “hold” a Content NFT in the Collection, create the ATA owned by the Collection vault for the Content NFT mint and send 1 token there.</li>
            <li>FEE constant is in lamports; reflect in UI.</li>
          </ul>

          <SubTitle>Contract Functions</SubTitle>
          <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">{`register_collection()  // collection_mint as ACCOUNT
- require: studio verified (pass studio_mint + ["studio", studio_mint] PDA)
- System transfer: pay_treasury(owner → BYTEBOUND_TREASURY, amount = FEE_COLLECTION)
- Init CollectionAccount PDA ["collection", collection_mint]
- Derive & store vault_authority = PDA(["collection-vault", collection_mint])
- Emits CollectionRegistered { owner, collection_mint, vault_authority }

withdraw_collection_assets(amount: u64)
- require(caller == collection.owner)
- require(vault_ata.owner == vault_authority && vault_ata.mint == recipient_ata.mint)
- PDA(["collection-vault", collection_mint]) signs and transfers 'amount'`}</pre>
        </AccordionContent>
      </AccordionItem>

      {/* 6) Common Rules & Gotchas */}
      <AccordionItem value="rules">
        <AccordionTrigger>
          <PinkNum n={6} /> <span>Common Rules & Gotchas</span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li><strong className="text-cyan-400">Mint inputs are accounts, not args:</strong> <code>register_*()</code> reads <code>ip_mint/content_mint/collection_mint</code> from the account metas.</li>
            <li><strong className="text-cyan-400">Vault ownership:</strong> The PDA is the <em>owner</em> of its ATAs. Only the program can move funds by signing with PDA seeds.</li>
            <li><strong className="text-cyan-400">Create ATAs client-side:</strong> Always idempotent-create the destination ATA (owner = vault PDA, <code>allowOwnerOffCurve=true</code>) before deposits.</li>
            <li><strong className="text-cyan-400">Owner gating:</strong> Withdraw calls require <code>caller == state.owner</code>.</li>
            <li><strong className="text-cyan-400">Re-derivation checks:</strong> Handlers re-derive the expected vault PDA and compare to the passed key.</li>
            <li><strong className="text-cyan-400">Vectors:</strong> <code>content.ip_assets</code> is stored on-chain; watch size if you expect many links.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
