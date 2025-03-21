// import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
// import dotenv from 'dotenv';
// import chalk from 'chalk';
// import inquirer from 'inquirer';
// import figlet from 'figlet';
// import clear from 'clear';
// import { createSpinner } from 'nanospinner';

// dotenv.config();

// let secretKey;
// const connection = new Connection(clusterApiUrl('devnet'));
// const myPublicKey = new PublicKey(process.env.PUBLIC_KEY);

// secretKey = process.env.SECRET_KEY.includes('[') 
// ? JSON.parse(process.env.SECRET_KEY)
// : process.env.SECRET_KEY.split(',').map(Number);

// const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
// const mintAuthority = payer;

// const displayWelcome = () => {
//     clear();
//     console.log(
//         chalk.yellow(
//             figlet.textSync('Solana Token CLI', { horizontalLayout: 'full' })
//         )
//     );
//     console.log(chalk.blue('\n🌟 Welcome to the Solana Token Management CLI 🌟\n'));
//     console.log(chalk.green('Connected to:'), chalk.cyan('Solana Devnet'));
//     console.log(chalk.green('Your Public Key:'), chalk.cyan(myPublicKey.toString()), '\n');
// };


// async function airdrop(publicKey, amount) {
//     const spinner = createSpinner('Requesting airdrop...').start();
//     try {
//         const airdropSignature = await connection.requestAirdrop(publicKey, amount);
//         await connection.confirmTransaction({ signature: airdropSignature });
//         spinner.success({ text: `Successfully airdropped ${amount / LAMPORTS_PER_SOL} SOL` });
//         return airdropSignature;
//     } catch (error) {
//         spinner.error({ text: 'Airdrop failed!' });
//         console.error(chalk.red(error));
//         process.exit(1);
//     }
// }

// async function createMintForToken(payer, mintAuthority) {
//     const spinner = createSpinner('Creating mint...').start();
//     try {
//         const mint = await createMint(
//             connection,
//             payer,
//             mintAuthority,
//             null,
//             6,
//             TOKEN_PROGRAM_ID
//         );
//         spinner.success({ text: `Mint created at ${mint.toBase58()}` });
//         return mint;
//     } catch (error) {
//         spinner.error({ text: 'Mint creation failed!' });
//         console.error(chalk.red(error));
//         process.exit(1);
//     }
// }

// async function mintNewTokens(mint, to, amount) {
//     const spinner = createSpinner('Creating token account...').start();
//     try {
//         const tokenAccount = await getOrCreateAssociatedTokenAccount(
//             connection,
//             payer,
//             mint,
//             new PublicKey(to)
//         );
//         spinner.success({ text: `Token account created at ${tokenAccount.address.toBase58()}` });

//         spinner.start({ text: 'Minting tokens...' });
//         await mintTo(
//             connection,
//             payer,
//             mint,
//             tokenAccount.address,
//             payer,
//             amount
//         );
//         spinner.success({ text: `Minted ${amount} tokens to ${tokenAccount.address.toBase58()}` });
//         return tokenAccount;
//     } catch (error) {
//         spinner.error({ text: 'Token minting failed!' });
//         console.error(chalk.red(error));
//         process.exit(1);
//     }
// }
// async function checkBalance(publicKey) {
//     const spinner = createSpinner('Fetching balance...').start();
//     try {
//         const balance = await connection.getBalance(publicKey);
//         spinner.success({ text: `Balance: ${balance / LAMPORTS_PER_SOL} SOL` });
//         return balance;
//     } catch (error) {
//         spinner.error({ text: 'Balance check failed!' });
//         console.error(chalk.red(error));
//         process.exit(1);
//     }
// }
// async function mainMenu() {
//     const answers = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'action',
//             message: 'What would you like to do?',
//             choices: [
//                 'Request Airdrop',
//                 'Check Balance',
//                 'Create Token Mint',
//                 'Mint Tokens',
//                 'Exit'
//             ]
//         }
//     ]);

//     switch (answers.action) {
//         case 'Request Airdrop':
//             const { amount } = await inquirer.prompt([
//                 {
//                     type: 'number',
//                     name: 'amount',
//                     message: 'How many SOL would you like to request? (max 2)',
//                     default: 1,
//                     validate: (value) => value <= 2 ? true : 'Maximum airdrop is 2 SOL'
//                 }
//             ]);
//             await airdrop(myPublicKey, amount * LAMPORTS_PER_SOL);
//             break;

//         case 'Check Balance':
//             await checkBalance(myPublicKey);
//             break;

//         case 'Create Token Mint':
//             const mint = await createMintForToken(payer, mintAuthority.publicKey);
//             console.log(chalk.green('\nVerify your token mint on Solana Explorer:'));
//             console.log(chalk.blue(`https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`));
//             break;

//         case 'Mint Tokens':
//             const mintDetails = await inquirer.prompt([
//                 {
//                     type: 'input',
//                     name: 'mintAddress',
//                     message: 'Enter the mint address:',
//                     validate: (value) => value.length === 44 ? true : 'Please enter a valid mint address'
//                 },
//                 {
//                     type: 'number',
//                     name: 'tokenAmount',
//                     message: 'How many tokens would you like to mint?',
//                     default: 100
//                 }
//             ]);
//             await mintNewTokens(
//                 new PublicKey(mintDetails.mintAddress),
//                 myPublicKey.toBase58(),
//                 mintDetails.tokenAmount
//             );
//             break;

//         case 'Exit':
//             console.log(chalk.yellow('\nThanks for using Solana Token CLI! 👋'));
//             process.exit(0);
//     }

//     if (answers.action !== 'Exit') {
//         console.log('\n');
//         await mainMenu();
//     }
// }

// async function main() {
//     displayWelcome();
//     await mainMenu();
// }

// main().catch(console.error);

import bs58 from 'bs58';

const secretKey = [
    146,133,208,105,129,203,213,203,84,94,21,99,50,211,238,3,
    137,216,193,223,226,182,121,248,135,150,71,75,129,172,181,192,
    133,59,205,79,66,222,76,45,176,145,151,188,188,136,179,144,
    168,9,90,231,71,208,173,141,24,203,0,244,237,156,112,43
];

// Convert array to Uint8Array (byte array)
const secretBytes = new Uint8Array(secretKey);

// Encode to Base58
const base58Encoded = bs58.encode(secretBytes);

console.log("Base58 Encoded Key:", base58Encoded);
