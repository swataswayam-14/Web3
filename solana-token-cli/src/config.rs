use crate::errors::CliError;
use dotenv::dotenv;
use solana_sdk::{
    signature::{Keypair, read_keypair_file},
    commitment_config::CommitmentConfig,
};
use std::env;
use std::path::Path;

pub struct Config {
    pub rpc_url: String,
    pub keypair: Keypair,
    pub token_mint: Option<String>,
    pub commitment: CommitmentConfig,
}

impl Config {
    pub fn new() -> Result<Self, CliError> {
        dotenv().ok();
        let rpc_url = env::var("SOLANA_RPC_URL")
            .unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());
        let keypair = Self::load_keypair()?;
        let token_mint = env::var("TOKEN_MINT_ADDRESS").ok();

        let commitment = match env::var("SOLANA_COMMITMENT").unwrap_or_else(|_| "confirmed".to_string()).as_str() {
            "processed" => CommitmentConfig::processed(),
            "confirmed" => CommitmentConfig::confirmed(),
            "finalized" => CommitmentConfig::finalized(),
            _ => CommitmentConfig::confirmed(),
        };
        Ok(Config {
            rpc_url,
            keypair,
            token_mint,
            commitment,
        })
    }
    fn load_keypair() -> Result<Keypair, CliError> {
        if let Ok(private_key) = env::var("WALLET_PRIVATE_KEY") {
            return Self::keypair_from_base58(&private_key)
                .map_err(|e| CliError::ConfigError(e.to_string()));
        }
        let default_keypair_path = shellexpand::tilde("/Users/swataswayamdash/.config/solana/id.json").to_string();
        if Path::new(&default_keypair_path).exists() {
            return read_keypair_file(&default_keypair_path)
                .map_err(|e| CliError::ConfigError(e.to_string()));
        }
        println!("No existing keypair found, Generating new keypair....");
        Ok(Keypair::new())
    }
    fn keypair_from_base58(private_key: &str) -> Result<Keypair, CliError> {
        let bytes = bs58::decode(private_key)
            .into_vec()
            .map_err(|e| CliError::ConfigError(e.to_string()))?;
        Keypair::from_bytes(&bytes)
            .map_err(|e| CliError::ConfigError(e.to_string()))
    }
}