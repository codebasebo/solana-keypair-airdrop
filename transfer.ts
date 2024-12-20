import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js"


import wallet from "./dev-wallet.json"

// Import our dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define Second Account Public Key
const to = new PublicKey("EbgbYZpufDsXgdaxRAEUwNqc4qVx9RKKyVhAmbcvUsGG");


//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Get the current balance of the source account
        const balance = await connection.getBalance(from.publicKey);
        console.log(`Current balance: ${balance} lamports`);

        // Check if the balance is sufficient for the transaction
        const transactionAmount = LAMPORTS_PER_SOL / 100;
        if (balance < transactionAmount) {
            console.error(`Insufficient funds for transaction. Required: ${transactionAmount} lamports`);
            return;
        }
        // Create a new transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL / 100,
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();