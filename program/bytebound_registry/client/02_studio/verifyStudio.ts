import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { ByteboundRegistry } from "../target/types/bytebound_registry";

const TOKEN_MINT = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");
const BYTEBOUND_TREASURY = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz"); // <-- EOA wallet
const METADATA_URI = "https://example.com/studio-metadata.json";

(async () => {
  const provider = anchor.getProvider();
  anchor.setProvider(provider);
  const program = anchor.workspace.ByteboundRegistry as Program<ByteboundRegistry>;

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("registry-config")],
    program.programId
  );
  const [studioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("studio"), TOKEN_MINT.toBuffer()],
    program.programId
  );

  // ATAs (treasury is a normal wallet; no off-curve flag)
  const creatorAta = getAssociatedTokenAddressSync(TOKEN_MINT, provider.wallet.publicKey);
  const treasuryAta = getAssociatedTokenAddressSync(TOKEN_MINT, BYTEBOUND_TREASURY);

  // Idempotent ATA create (safe to include every time)
  const createTreasuryAtaIx = createAssociatedTokenAccountIdempotentInstruction(
    provider.wallet.publicKey,   // payer
    treasuryAta,                 // ATA to create if missing
    BYTEBOUND_TREASURY,          // owner (EOA)
    TOKEN_MINT,                  // mint
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const txSig = await program.methods
    .verifyStudio(METADATA_URI)
    .accounts({
      admin: provider.wallet.publicKey,
      config: configPda,
      studioAccount: studioPda,
      creator: provider.wallet.publicKey,
      mint: TOKEN_MINT,
      creatorAta,
      treasuryAta,
      treasury: BYTEBOUND_TREASURY,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      // rent / associatedTokenProgram only if your on-chain method explicitly requires them
    })
    .preInstructions([createTreasuryAtaIx])
    .rpc();

  console.log("✅ Treasury ATA:", treasuryAta.toBase58());
  console.log("✅ Studio verified. TX:", txSig);
})();
