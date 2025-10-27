ByteBound Registry + Market README

Devnet programs

Registry: 2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo

Market: Crx7yqieL9giLRWq9Zgwb3pcRb1g2pKeCkBJ64nJERe1

This workspace contains two Anchor programs and a set of TypeScript clients you can paste into Solana Playground under each project’s Client/tests tree. The file names are the “recipe” — run them in order, step 00 → 07.

Folder map
bytebound_registry/
  src/lib.rs
  Client/tests/
    00_setup/SetupClient.ts
    01_credits/{buycredits.ts, checkcredits.ts, spendcredits.ts}
    02_studio/{registerStudio.ts, verifyStudio.ts}
    03_register/{registerIpAsset.ts, registerContent.ts, registerCollection.ts}
    07_distribute/ (withdraw flows)

bytebound_market/
  src/lib.rs
  Client/tests/
    04_list/{list_purchase_content.ts, list_rent_content.ts, list_ip_license.ts, delist_content.ts}
    05_buy/   (purchase/rent/use_ip)
    06_placement/ (placement funding)

Step-by-step (what each script does)
00 — Setup

SetupClient.ts: Initializes Anchor provider and (optionally) the Registry config PDA.

01 — Credits (USDC-based studio credits)

buycredits.ts: Transfers USDC from your ATA → treasury ATA; (init_if_needed) UserCredits PDA and increments balance.

checkcredits.ts: Reads your UserCredits PDA balance.

spendcredits.ts: Decrements credits (gate: owner + balance).

02 — Studio

registerStudio.ts: Creates a StudioAccount PDA for a selected studio token mint and pays 1 SOL to the treasury.

verifyStudio.ts: Admin verifies the studio and takes a sized token payment from creator → treasury ATA.

03 — Register (on-chain registry PDAs)

registerIpAsset.ts: Creates IpAssetAccount and its vault authority PDA; prints vault ATA (studio token).

registerContent.ts: Creates ContentAccount and its vault authority; prints vault ATA.

registerCollection.ts: Creates CollectionAccount and its vault authority; prints vault ATA.

All three deposit/royalty vaults are program-derived authorities owned by the Registry. Funds later flow into their ATAs (for the studio token).

04 — List (market listings)

list_purchase_content.ts: Creates a purchase listing for a Content/Collection.

list_rent_content.ts: Creates a rental listing (duration > 0) for a Content/Collection.

list_ip_license.ts: Creates a license listing for an IP Asset.

delist_content.ts: Deactivates a listing (seller-only).

Listings are unique PDAs per kind using namespaced seeds, so purchase vs rent for the same item won’t collide.

05 — Buy / Rent / License

Clients here call:

purchase: payer USDC/studio token → 20% treasury + 80% Registry vault (Content/Collection).

rent: same split; records rental event.

use_ip: same split; for IP licensing.

06 — Placement

add_placement_funds: Funds a placement bounty for Content/Collection (no fee; 100% to Registry vault).

07 — Distribute (royalty withdrawals)

Scripts here call Registry to withdraw from vault ATAs (owner-gated):

withdraw_ip_asset_royalties

withdraw_content_royalties

withdraw_collection_assets

Notes / Gotchas

Treasury (EOA): Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz. Make sure its ATA for the studio token exists; most clients create it idempotently.

Registry fees (SOL) on register:

IP: 0.03 SOL

Content: 0.06 SOL

Collection: 0.09 SOL

Market splits for purchase/rent/use_ip: 20% fee → treasury, 80% → the Registry vault ATA of the target (so all flows land in the same vault you registered earlier).

If relisting: seeds include a kind namespace, so you can list both purchase and rental for the same target without PDA collisions.

That’s it — copy the client files you need into Solana Playground under the matching project and run them in order.