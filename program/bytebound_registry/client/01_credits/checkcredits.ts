import * as anchor from "@coral-xyz/anchor";

// Setup
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const wallet = provider.wallet as anchor.Wallet;

const PROGRAM_ID = new anchor.web3.PublicKey("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

const IDL = {
  version: "0.1.0",
  name: "bytebound_registry",
  instructions: [],
  accounts: [
    {
      name: "userCredits",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "balance", type: "u64" },
          { name: "bump", type: "u8" },
        ]
      }
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

  try {
    const account = await program.account.userCredits.fetch(userCreditsPda);
    const credits = account.balance.toNumber();

    console.log("💳 User credits:", credits.toLocaleString(), "micro-USDC");
  } catch (e) {
    console.error("❌ Failed to fetch user credits:", e.message);
  }
})();
