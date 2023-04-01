const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const privateKey = new Uint8Array([
  218, 201, 121, 2, 78, 126, 163, 127, 255, 238, 89, 57, 242, 108, 100, 182, 32,
  166, 46, 145, 152, 217, 49, 28, 115, 45, 248, 157, 44, 116, 191, 234, 157,
  232, 91, 229, 204, 205, 25, 136, 36, 79, 143, 83, 17, 150, 120, 15, 153, 59,
  164, 211, 59, 179, 142, 229, 230, 172, 101, 127, 173, 247, 188, 211,
]);

const getWalletBalance = async (publicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(new PublicKey(publicKey));
    return parseInt(walletBalance) / LAMPORTS_PER_SOL;
  } catch (error) {
    console.log(error);
  }
};

const transferSol = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const sender = Keypair.fromSecretKey(privateKey);
  let senderWalletBalance = await getWalletBalance(sender.publicKey);
  console.log("Sender wallet balance is ", senderWalletBalance);

  const reciever = Keypair.generate();

  let recieverWalletBalance = await getWalletBalance(reciever.publicKey);
  console.log("Reciever wallet balance is ", recieverWalletBalance);

  // airDroping 2 sols to sender wallet

  console.log("Air droping 2 sols to sender's wallet");

  const airDropSignature = await connection.requestAirdrop(
    new PublicKey(sender.publicKey),
    2 * LAMPORTS_PER_SOL
  );
  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airDropSignature,
  });

  senderWalletBalance = await getWalletBalance(sender.publicKey);
  console.log("Sender wallet balance after airdrop is ", senderWalletBalance);

  let transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(sender.publicKey),
      lamports: (senderWalletBalance * LAMPORTS_PER_SOL) / 2, //for sending 50% wallet balance
      toPubkey: new PublicKey(reciever.publicKey),
    })
  );

  let transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );

  console.log("transaction signature is ", transactionSignature);

  senderWalletBalance = await getWalletBalance(sender.publicKey);
  console.log(
    "Sender wallet balance after transaction is ",
    senderWalletBalance
  );
  recieverWalletBalance = await getWalletBalance(reciever.publicKey);
  console.log(
    "Reciever wallet balance after transaction is ",
    recieverWalletBalance
  );
};

transferSol();
