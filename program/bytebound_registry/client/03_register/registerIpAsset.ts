import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ByteboundRegistry } from "../target/types/bytebound_registry";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

// mints you already created
const STUDIO_MINT   = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");
const CONTENT_MINT  = new PublicKey("5E6zM4rD64CKGG6H3gyTX6EVKQTnaaZf5Qj92KSK29yt");
const BYTEBOUND_TREASURY = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program<ByteboundRegistry>(
    (anchor.workspace as any).ByteboundRegistry.idl,
    PROGRAM_ID,
    provider
  );

  const [studioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("studio"), STUDIO_MINT.toBuffer()],
    program.programId
  );
  const [contentPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("content"), CONTENT_MINT.toBuffer()],
    program.programId
  );
  const [vaultAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("content-vault"), CONTENT_MINT.toBuffer()],
    program.programId
  );
  const vaultAta = getAssociatedTokenAddressSync(
    STUDIO_MINT,
    vaultAuth,
    true
  );

  const sig = await program.methods
    .registerContent()
    .accounts({
      owner: provider.wallet.publicKey,
      studioMint: STUDIO_MINT,
      studioAccount: studioPda,
      content: contentPda,
      contentMint: CONTENT_MINT,
      treasury: BYTEBOUND_TREASURY,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("✅ registerContent tx:", sig);
  console.log("📦 Content PDA:", contentPda.toBase58());
  console.log("🔑 Vault Authority:", vaultAuth.toBase58());
  console.log("🏦 Vault ATA (studio token):", vaultAta.toBase58());
})();
