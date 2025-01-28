mod config;
mod errors;
mod token_manager;

use clap::{Parser, Subcommand};
use config::Config;
use solana_sdk::signature::Keypair;
use token_manager::TokenManager;

#[derive(Parser)]
#[command(name = "solana-token-cli")]
#[command(about = "A CLI for managing Solana tokens", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(short, long)]
    url: Option<String>,
}

#[derive(Subcommand)]
enum Commands {
    /// Airdrop SOL to your wallet
    Airdrop {
        #[arg(short, long)]
        amount: f64,
    },
    /// Check your SOL balance
    Balance,
    /// Create a new token mint
    CreateMint,
    /// Create an associated token account and mint tokens
    MintTokens {
        #[arg(short, long)]
        amount: u64,
    },
}

#[tokio::main]
async fn main() -> Result<(), errors::CliError> {
    let cli = Cli::parse();
    let mut config = Config::new()?;
    
    // Override RPC URL if provided in CLI
    if let Some(url) = cli.url {
        config.rpc_url = url;
    }
    
    let token_manager = TokenManager::new(&config);

    match cli.command {
        Commands::Airdrop { amount } => {
            token_manager.airdrop(amount).await?;
        }
        Commands::Balance => {
            token_manager.get_balance().await?;
        }
        Commands::CreateMint => {
            token_manager.create_mint().await?;
        }
        Commands::MintTokens { amount } => {
            let mint = Keypair::new();  
            token_manager.mint_tokens(&mint, amount).await?;
        }
    }

    Ok(())
}
