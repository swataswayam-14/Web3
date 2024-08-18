import { generateMnemonic } from "bip39";

const mnemonic = generateMnemonic(); //12 word mnemonic
console.log('Generated Mnemonic: ', mnemonic);

