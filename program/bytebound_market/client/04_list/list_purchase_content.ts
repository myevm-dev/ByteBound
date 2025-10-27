import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const MARKET_PROGRAM_ID   = new PublicKey("Crx7yqieL9giLRWq9Zgwb3pcRb1g2pKeCkBJ64nJERe1");
const REGISTRY_PROGRAM_ID = new PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

const STUDIO_MINT = new PublicKey("JCFJBMbeUYSVteiR3qThnFNFabjmgRzeYsX76m9XtzCy");
const IP_MINT     = new PublicKey("AUypX3oqZJ6WZMizCFs73NvRDaJK5Yf5x9gMGqjFiFQz");

// price (in studio token)
const PRICE = new anchor.BN(2_500_000); // 2.5 tokens

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program(
    (anchor.workspace as any).ByteboundMarket.idl,
    MARKET_PROGRAM_ID,
    provider
  );

  const seller = provider.wallet.publicKey;

  // IpAsset PDA (Registry)
  const [ipAssetPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("ip-asset"), IP_MINT.toBuffer()],
    REGISTRY_PROGRAM_ID
  );
  // Studio PDA (Registry)
  const [studioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("studio"), STUDIO_MINT.toBuffer()],
    REGISTRY_PROGRAM_ID
  );
  // Listing PDA (Market)
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), IP_MINT.toBuffer(), seller.toBuffer()],
    MARKET_PROGRAM_ID
  );

  const sig = await program.methods
    .listIpLicense(PRICE)
    .accounts({
      seller,
      ipMint: IP_MINT,
      ipAssetPda,
      studioMint: STUDIO_MINT,
      studioPda,
      listing: listingPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Listed IPAsset for LICENSE");
  console.log("   tx:", sig);
  console.log("   Listing PDA:", listingPda.toBase58());
})();
