use thiserror::Error;
use solana_sdk::program_error::ProgramError;
use solana_program::instruction::InstructionError;

#[derive(Error, Debug)]
pub enum CliError {
    #[error("Configuration error: {0}")]
    ConfigError(String),

    #[error("Solana client error: {0}")]
    SolanaClientError(#[from] solana_client::client_error::ClientError),

    #[error("Token program error: {0}")]
    TokenError(#[from] spl_token::error::TokenError),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Environment variable error: {0}")]
    EnvVarError(#[from] std::env::VarError),

    #[error("Program error: {0:?}")]
    ProgramError(ProgramError),

    #[error("Instruction error: {0}")]
    InstructionError(#[from] InstructionError),

    #[error("Generic error: {0}")]
    Generic(String),
}

impl From<ProgramError> for CliError {
    fn from(error: ProgramError) -> Self {
        CliError::ProgramError(error)
    }
}