// client/00_setup/SetupClient.ts
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintToChecked,
} from "@solana/spl-token";

/** Fixed addresses */
const DEV_WALLET       = new PublicKey("3jSrkiWY6N2qoNnHgCHe3t4xJDtmAmwZZ9H7S4aPmK8N");
const TREASURY_WALLET  = new PublicKey("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");
const STUDIO_OWNER     = new PublicKey("DQW3iqVu7jjvcLGB6chUQpqKwwddFmV4JeFCRhPMbhiH");
const END_USER         = new PublicKey("AXurvCAfZvCPfqyfaYxTMYX8tQfpsEhA3mby5VRZhNZx");

// ---- Run immediately (no exports) ----
(async () => {
  // @ts-ignore – provided by Solana Playground
  const connection = pg.connection;
  // @ts-ignore
  const payer: Keypair = pg.wallet.keypair;

  const log = (...a: any[]) => console.log(...a);

  log("👋 Setup starting with payer:", payer.publicKey.toBase58());
  if (payer.publicKey.toBase58() !== DEV_WALLET.toBase58()) {
    console.warn("⚠️ Active wallet != provided Dev wallet. Active wallet will own mint authority.");
  }

  const ensureMint = async (decimals: number) =>
    await createMint(connection, payer, payer.publicKey, payer.publicKey, decimals);

  const ensureAta = async (mint: PublicKey, owner: PublicKey) =>
    (await getOrCreateAssociatedTokenAccount(connection, payer, mint, owner)).address;

  const mintChecked = async (mint: PublicKey, destAta: PublicKey, amount: number, decimals: number) =>
    await mintToChecked(connection, payer, mint, destAta, payer.publicKey, amount, decimals);

  // 1) testUSDC (6 dp) + ATAs + 2,000 to Studio Owner
  log("⏳ Creating testUSDC mint…");
  const usdcDp = 6;
  const testUSDC = await ensureMint(usdcDp);
  log("✅ testUSDC Mint:", testUSDC.toBase58());

  const studioOwnerUsdcAta = await ensureAta(testUSDC, STUDIO_OWNER);
  const treasuryUsdcAta    = await ensureAta(testUSDC, TREASURY_WALLET);
  log("✅ StudioOwner USDC ATA:", studioOwnerUsdcAta.toBase58());
  log("✅ Treasury USDC ATA:",    treasuryUsdcAta.toBase58());

  const usdcAmount = 2000 * 10 ** usdcDp; // 2,000.000000
  await mintChecked(testUSDC, studioOwnerUsdcAta, usdcAmount, usdcDp);
  log("✅ Minted 2,000 USDC → Studio Owner");

  // 2) Studio Token (6 dp) + ATAs + distributions
  log("⏳ Creating Studio Token mint…");
  const studioDp = 6;
  const studioMint = await ensureMint(studioDp);
  log("✅ Studio Token Mint:", studioMint.toBase58());

  const studioOwnerStudioAta = await ensureAta(studioMint, STUDIO_OWNER);
  const endUserStudioAta     = await ensureAta(studioMint, END_USER);
  log("✅ StudioOwner Studio ATA:", studioOwnerStudioAta.toBase58());
  log("✅ EndUser Studio ATA:",     endUserStudioAta.toBase58());

  const ownerAmt   = 50_000_000 * 10 ** studioDp;
  const endUserAmt =    100_000 * 10 ** studioDp;
  await mintChecked(studioMint, studioOwnerStudioAta, ownerAmt, studioDp);
  await mintChecked(studioMint, endUserStudioAta,     endUserAmt, studioDp);
  log("✅ Minted 50,000,000 Studio → Studio Owner");
  log("✅ Minted 100,000 Studio → End User");

  // 3) Content NFT (0 dp, supply 1) → Studio Owner
  log("⏳ Creating Content NFT…");
  const contentMint = await ensureMint(0);
  const contentAta  = await ensureAta(contentMint, STUDIO_OWNER);
  await mintChecked(contentMint, contentAta, 1, 0);
  log("✅ Content NFT Mint:", contentMint.toBase58());
  log("✅ Content NFT ATA:",  contentAta.toBase58());

  // 4) IPAsset NFT (0 dp, supply 1) → Studio Owner
  log("⏳ Creating IPAsset NFT…");
  const ipMint = await ensureMint(0);
  const ipAta  = await ensureAta(ipMint, STUDIO_OWNER);
  await mintChecked(ipMint, ipAta, 1, 0);
  log("✅ IPAsset NFT Mint:", ipMint.toBase58());
  log("✅ IPAsset NFT ATA:",  ipAta.toBase58());

  log("\n—— Setup Complete ——");
  log("testUSDC Mint:", testUSDC.toBase58());
  log("Studio Token Mint:", studioMint.toBase58());
  log("Content NFT Mint:", contentMint.toBase58());
  log("IPAsset NFT Mint:", ipMint.toBase58());
  log("StudioOwner USDC ATA:", studioOwnerUsdcAta.toBase58());
  log("Treasury USDC ATA:",    treasuryUsdcAta.toBase58());
  log("StudioOwner Studio ATA:", studioOwnerStudioAta.toBase58());
  log("EndUser Studio ATA:",     endUserStudioAta.toBase58());
  log("Content ATA:", contentAta.toBase58());
  log("IPAsset ATA:",  ipAta.toBase58());
})().catch((e) => {
  console.error("❌ Setup failed:", e);
});
