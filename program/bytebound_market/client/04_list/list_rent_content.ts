import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const MARKET_PROGRAM_ID   = new PublicKey("Crx7yqieL9giLRWq9Zgwb3pcRb1g2pKeCkBJ64nJERe1");
const REGISTRY_PROGRAM_ID = new PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

const STUDIO_MINT  = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");
const CONTENT_MINT = new PublicKey("5E6zM4rD64CKGG6H3gyTX6EVKQTnaaZf5Qj92KSK29yt");

// enums
const ListingKind = { RentalContent: 1 } as const;
const TargetKind  = { Content: 0 } as const;

// price & duration
const PRICE = new anchor.BN(1_000_000);     // 1 studio token
const DURATION_SECS = 24 * 60 * 60;         // 1 day

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program(
    (anchor.workspace as any).ByteboundMarket.idl,
    MARKET_PROGRAM_ID,
    provider
  );

  const seller = provider.wallet.publicKey;

  const [registryContentPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("content"), CONTENT_MINT.toBuffer()],
    REGISTRY_PROGRAM_ID
  );
  const [studioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("studio"), STUDIO_MINT.toBuffer()],
    REGISTRY_PROGRAM_ID
  );
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), CONTENT_MINT.toBuffer(), seller.toBuffer()],
    MARKET_PROGRAM_ID
  );

  const sig = await program.methods
    .listContentOrCollection(
      ListingKind.RentalContent,
      TargetKind.Content,
      PRICE,
      DURATION_SECS
    )
    .accounts({
      seller,
      targetMint: CONTENT_MINT,
      registryPda: registryContentPda,
      studioMint: STUDIO_MINT,
      studioPda,
      listing: listingPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Listed Content for RENT");
  console.log("   tx:", sig);
  console.log("   Listing PDA:", listingPda.toBase58());
})();
