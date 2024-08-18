//@ts-nocheck

import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

function main() {
    const keypair = Keypair.generate();

    const publicKey = keypair.publicKey.toString();
    const privateKey = keypair.secretKey;

    console.log('Public key: ', publicKey);
    console.log('Private key: ', privateKey);

    const message = new TextEncoder().encode("Rishi has send 15 BTC to Swata");

    const signature = nacl.sign.detached(message, privateKey);

    const result = nacl.sign.detached.verify(message, signature, keypair.publicKey.toBytes()),

    if (result) {
        console.log('Verified');
    } else {
        console.log('Falsy');
    
    }
}
main();