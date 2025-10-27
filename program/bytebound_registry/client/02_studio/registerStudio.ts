import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ByteboundRegistry } from "../target/types/bytebound_registry";
import { PublicKey, SystemProgram } from "@solana/web3.js";

// ⬇️ Set this to the token mint you're registering a studio for
const TOKEN_MINT = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");

// ⬇️ Treasury address from your contract
const BYTEBOUND_TREASURY = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");

(async () => {
  const provider = anchor.AnchorProvider.env();
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

  const tx = await program.methods
    .registerStudio(TOKEN_MINT)
    .accounts({
      creator: provider.wallet.publicKey,
      config: configPda,
      studioAccount: studioPda,
      mint: TOKEN_MINT,
      treasury: BYTEBOUND_TREASURY,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log(`✅ Studio registered. TX: ${tx}`);
})();
