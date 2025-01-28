use crate::errors::CliError;
use colored::*;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    signature::Keypair,
    signer::Signer,
    system_instruction,
    transaction::Transaction,
    program_pack::Pack,
};
use spl_associated_token_account::get_associated_token_address;
use spl_token::instruction as token_instruction;
use spl_token::state::Mint;
use indicatif::{ProgressBar, ProgressStyle};

pub struct TokenManager {
    rpc_client: RpcClient,
    keypair: Box<Keypair>, 
}

impl TokenManager {
    pub fn new(config: &crate::config::Config) -> Self {
        let rpc_client = RpcClient::new_with_commitment(
            config.rpc_url.clone(),
            config.commitment,
        );
        
        Self {
            rpc_client,
            keypair: Box::new(Keypair::from_bytes(&config.keypair.to_bytes()).unwrap()),
        }
    }

    pub async fn airdrop(&self, amount: f64) -> Result<(), CliError> {
        let amount_lamports = (amount * 1_000_000_000.0) as u64;
        
        let pb = ProgressBar::new_spinner();
        pb.set_style(
            ProgressStyle::default_spinner()
                .template("{spinner:.green} {msg}")
                .unwrap()
        );
        pb.set_message("Requesting airdrop...");

        let signature = self.rpc_client
            .request_airdrop(&self.keypair.pubkey(), amount_lamports)?;

        pb.set_message("Confirming transaction...");
        
        self.rpc_client.confirm_transaction(&signature)?;
        
        pb.finish_with_message(format!("{} Airdropped {} SOL", "SUCCESS".green(), amount));
        Ok(())
    }

    pub async fn get_balance(&self) -> Result<(), CliError> {
        let balance = self.rpc_client.get_balance(&self.keypair.pubkey())?;
        println!("Balance: {} SOL", (balance as f64 / 1_000_000_000.0));
        Ok(())
    }

    pub async fn create_mint(&self) -> Result<(), CliError> {
        let mint = Keypair::new();
        let pb = ProgressBar::new_spinner();
        pb.set_style(
            ProgressStyle::default_spinner()
                .template("{spinner:.green} {msg}")
                .unwrap()
        );
        
        pb.set_message("Creating token mint...");
        
        let minimum_balance_for_rent_exemption = self.rpc_client
            .get_minimum_balance_for_rent_exemption(Mint::LEN)?;

        let create_account_ix = system_instruction::create_account(
            &self.keypair.pubkey(),
            &mint.pubkey(),
            minimum_balance_for_rent_exemption,
            Mint::LEN as u64,
            &spl_token::id(),
        );

        let initialize_mint_ix = token_instruction::initialize_mint(
            &spl_token::id(),
            &mint.pubkey(),
            &self.keypair.pubkey(),
            None,
            9,
        ).map_err(|e| CliError::ProgramError(e))?;

        let transaction = Transaction::new_signed_with_payer(
            &[create_account_ix, initialize_mint_ix],
            Some(&self.keypair.pubkey()),
            &[&self.keypair, &mint],
            self.rpc_client.get_latest_blockhash()?,
        );

        self.rpc_client.send_and_confirm_transaction(&transaction)?;
        
        pb.finish_with_message(format!(
            "{} Created token mint: {}",
            "SUCCESS".green(),
            mint.pubkey().to_string()
        ));
        
        Ok(())
    }

    pub async fn mint_tokens(&self, mint: &Keypair, amount: u64) -> Result<(), CliError> {
        let pb = ProgressBar::new_spinner();
        pb.set_style(
            ProgressStyle::default_spinner()
                .template("{spinner:.green} {msg}")
                .unwrap()
        );

        pb.set_message("Creating associated token account...");
        
        let associated_token_account = get_associated_token_address(
            &self.keypair.pubkey(),
            &mint.pubkey(),
        );

        let create_ata_ix = spl_associated_token_account::instruction::create_associated_token_account(
            &self.keypair.pubkey(),
            &self.keypair.pubkey(),
            &mint.pubkey(),
            &spl_token::id(),
        );

        let transaction = Transaction::new_signed_with_payer(
            &[create_ata_ix],
            Some(&self.keypair.pubkey()),
            &[&self.keypair],
            self.rpc_client.get_latest_blockhash()?,
        );

        self.rpc_client.send_and_confirm_transaction(&transaction)?;

        pb.set_message("Minting tokens...");

        let mint_ix = token_instruction::mint_to(
            &spl_token::id(),
            &mint.pubkey(),
            &associated_token_account,
            &self.keypair.pubkey(),
            &[],
            amount,
        ).map_err(|e| CliError::ProgramError(e))?;

        let mint_tx = Transaction::new_signed_with_payer(
            &[mint_ix],
            Some(&self.keypair.pubkey()),
            &[&self.keypair],
            self.rpc_client.get_latest_blockhash()?,
        );

        self.rpc_client.send_and_confirm_transaction(&mint_tx)?;

        pb.finish_with_message(format!(
            "{} Minted {} tokens to {}",
            "SUCCESS".green(),
            amount,
            associated_token_account
        ));

        Ok(())
    }
}