import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ByteboundRegistry } from "../target/types/bytebound_registry";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

// Studio token (your verified studio)
const STUDIO_MINT = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");

// ⬇️ This is the **Collection ID** (NOT an NFT). Use any Pubkey to identify the collection.
// - Easiest: generate once with `Keypair.generate().publicKey.toBase58()` and paste it here.
// - Stable: keep this constant so the same collection PDA is derived every time.
const COLLECTION_ID = new PublicKey("3sCyp5PjdxCY549qSjXXpbXySnBPbAhnEmch1gXVnP7u");

// Treasury (EOA)
const BYTEBOUND_TREASURY = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program<ByteboundRegistry>(
    (anchor.workspace as any).ByteboundRegistry.idl,
    PROGRAM_ID,
    provider
  );

  // Studio PDA
  const [studioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("studio"), STUDIO_MINT.toBuffer()],
    program.programId
  );

  // Collection PDA (seeded by the arbitrary COLLECTION_ID)
  const [collectionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection"), COLLECTION_ID.toBuffer()],
    program.programId
  );

  // Vault authority & its ATA in the **studio token**
  const [vaultAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection-vault"), COLLECTION_ID.toBuffer()],
    program.programId
  );
  const vaultAta = getAssociatedTokenAddressSync(
    STUDIO_MINT,
    vaultAuth,
    true // PDA owner -> off-curve
  );

  const sig = await program.methods
    .registerCollection()
    .accounts({
      owner: provider.wallet.publicKey,
      studioMint: STUDIO_MINT,
      studioAccount: studioPda,
      collection: collectionPda,
      collectionMint: COLLECTION_ID, // <-- just a key used as seed
      treasury: BYTEBOUND_TREASURY,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("✅ registerCollection tx:", sig);
  console.log("📦 Collection PDA:", collectionPda.toBase58());
  console.log("🔑 Vault Authority:", vaultAuth.toBase58());
  console.log("🏦 Vault ATA (studio token):", vaultAta.toBase58());
})();
