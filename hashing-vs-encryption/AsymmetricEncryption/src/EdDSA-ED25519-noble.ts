// Edwards-curve Digital Signature Algorithm  - ED25519

import * as ed from "@noble/ed25519";

async function main() {

    const privateKey = ed.utils.randomPrivateKey();

    const message = new TextEncoder().encode("Swata Swayam Dash has sent $200 million to Rishi Vatsal");

    const publicKey = await ed.getPublicKeyAsync(privateKey);

    const signature = await ed.signAsync(message, privateKey);

    const isValid = await ed.verifyAsync(message, signature, publicKey);

    console.log(isValid);
    
}
main();