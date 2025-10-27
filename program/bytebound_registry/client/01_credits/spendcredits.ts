import * as anchor from "@coral-xyz/anchor";

// Setup
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const wallet = provider.wallet as anchor.Wallet;

const PROGRAM_ID = new anchor.web3.PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

const IDL = {
  version: "0.1.0",
  name: "bytebound_registry",
  instructions: [
    {
      name: "spendGenerationCredits",
      accounts: [
        { name: "user", isMut: false, isSigner: true },
        { name: "userCredits", isMut: true, isSigner: false },
      ],
      args: [{ name: "credits", type: "u64" }]
    }
  ]
};

const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

(async () => {
  const user = wallet.publicKey;

  const [userCreditsPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user-credits"), user.toBuffer()],
    program.programId
  );

  const creditsToSpend = new anchor.BN(1450); // 1,450 credits

  const tx = await program.methods
    .spendGenerationCredits(creditsToSpend)
    .accounts({
      user,
      userCredits: userCreditsPda,
    })
    .rpc();

  console.log("✅ Spent 1,450 credits. TX:", tx);
})();
