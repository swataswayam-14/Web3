import { ethers } from "ethers";

async function main() {
    const wallet = ethers.Wallet.createRandom();

    const publicKey = wallet.address;
    const privateKey = wallet.privateKey;
    
    console.log("Public Key (Address):", publicKey);
    console.log("Private Key:", privateKey);
    
    const message = "hello world";
    
    const signature = await wallet.signMessage(message);
    console.log("Signature:", signature);
    
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    console.log("Recovered Address:", recoveredAddress);
    console.log("Signature is valid:", recoveredAddress === publicKey);
}

main();