import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// === Program IDs ===
const MARKET_PROGRAM_ID   = new PublicKey("Crx7yqieL9giLRWq9Zgwb3pcRb1g2pKeCkBJ64nJERe1");

// === Target being delisted ===
// Use the same target mint you listed (your Content mint)
const CONTENT_MINT = new PublicKey("5E6zM4rD64CKGG6H3gyTX6EVKQTnaaZf5Qj92KSK29yt");

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the market program
  const program = new Program(
    (anchor.workspace as any).ByteboundMarket.idl,
    MARKET_PROGRAM_ID,
    provider
  );

  const seller = provider.wallet.publicKey;

  // Listing PDA = ["listing", target_mint, seller]
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), CONTENT_MINT.toBuffer(), seller.toBuffer()],
    MARKET_PROGRAM_ID
  );

  const sig = await program.methods
    .delist()
    .accounts({
      seller,
      listing: listingPda,
    })
    .rpc();

  console.log("✅ Delisted listing");
  console.log("   tx:", sig);
  console.log("   Listing PDA:", listingPda.toBase58());
})();
