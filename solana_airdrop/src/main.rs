use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

fn main() {
    let public_key = Pubkey::from_str("9y67Z5vC7yeWz8iZhbi3MvshD4oYjFRo4Pwa17hL2eKC").unwrap();
    let rpc_url = "https://api.devnet.solana.com";

    let client = RpcClient::new(rpc_url.to_string());
    let lamports = 1_000_000_000; //1 sol = 10^9 lamports

    match client.request_airdrop(&public_key, lamports) {
        Ok(signature) => {
            println!("Airdrop successful! Signature: {}", signature);
            match client.confirm_transaction(&signature) {
                Ok(confirmed) => {
                    if confirmed {
                        println!("Transaction confirmed!");
                    } else {
                        println!("Transaction not confirmed.");
                    }
                }
                Err(err) => println!("Error confirming transaction: {}", err)
            }
        }
        Err(err) => println!("Airdrop failed: {}", err),
    }
}
