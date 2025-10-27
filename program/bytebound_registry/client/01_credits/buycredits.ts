import * as anchor from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { Transaction, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const wallet = provider.wallet as anchor.Wallet;

const PROGRAM_ID = new PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");
const TEST_USDC_MINT = new PublicKey("Gjzrqj6vWMAeXt3oxMYHwc29NyZiMAUb7EzChVTeQGqu");
const BYTEBOUND_TREASURY = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");

// Inline constants so Playground never complains
const TOKEN_PROGRAM = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

const IDL = {
  version: "0.1.0",
  name: "bytebound_registry",
  instructions: [
    {
      name: "initializeRegistry",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "config", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "buyGenerationCredits",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "config", isMut: false, isSigner: false },
        { name: "userUsdcAta", isMut: true, isSigner: false },
        { name: "treasuryUsdcAta", isMut: true, isSigner: false },
        { name: "userCredits", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "credits", type: "u64" }],
    },
  ],
};

const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

(async () => {
  const user = wallet.publicKey;

  const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("registry-config")],
    program.programId
  );

  const [userCreditsPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user-credits"), user.toBuffer()],
    program.programId
  );

  const userUsdcAta = getAssociatedTokenAddressSync(TEST_USDC_MINT, user);
  // treasury is a normal system account (on-curve) → no need for allowOwnerOffCurve=true
  const treasuryUsdcAta = getAssociatedTokenAddressSync(TEST_USDC_MINT, BYTEBOUND_TREASURY);

  // Ensure treasury ATA exists
  const treasuryAtaInfo = await provider.connection.getAccountInfo(treasuryUsdcAta);
  if (!treasuryAtaInfo) {
    const ataIx = createAssociatedTokenAccountInstruction(
      user,                // payer
      treasuryUsdcAta,     // ATA to create
      BYTEBOUND_TREASURY,  // owner
      TEST_USDC_MINT
    );
    const txCreateAta = new Transaction().add(ataIx);
    await sendAndConfirmTransaction(provider.connection, txCreateAta, [wallet.payer]);
    console.log("✅ Created treasury ATA:", treasuryUsdcAta.toBase58());
  }

  // Initialize registry (safe to skip if already done)
  const txInit = await program.methods
    .initializeRegistry()
    .accounts({
      admin: user,
      config: configPda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc()
    .catch(() => null);
  if (txInit) console.log("✅ Registry initialized. TX:", txInit);

  // Buy 20,000,000 credits (micro-USDC)
  const credits = new anchor.BN(20_000_000);
  const txBuy = await program.methods
    .buyGenerationCredits(credits)
    .accounts({
      user,
      config: configPda,
      userUsdcAta,
      treasuryUsdcAta,
      userCredits: userCreditsPda,
      tokenProgram: TOKEN_PROGRAM,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Bought 20M credits. TX:", txBuy);
})();
