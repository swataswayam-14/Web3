import { Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";

const myPublicKey = new PublicKey("9y67Z5vC7yeWz8iZhbi3MvshD4oYjFRo4Pwa17hL2eKC");

const connection = new Connection(clusterApiUrl('devnet'));
async function airdrop(publicKey, amount) {
    const airdropSignature = await connection.requestAirdrop(publicKey, amount);
    await connection.confirmTransaction({
        signature: airdropSignature
    });
    return airdropSignature;
}

airdrop(myPublicKey, LAMPORTS_PER_SOL)
    .then(signature => {
        console.log('Airdrop signature:', signature);
    })
    .catch(err => console.error('Airdrop failed:', err));