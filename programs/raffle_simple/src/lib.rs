use anchor_lang::prelude::*;
use std::str::FromStr;
use std::mem::size_of;
use anchor_lang::Result;
use anchor_spl::token::{Token, MintTo, Transfer, Burn, TokenAccount};


const CONSTRAINT_SEED:&[u8] = b"frank-raffle";

pub const ENTRANTS_SIZE: u64 = 5000;
pub const TOKEN_MINT: &str = "CdjiQaAUqbz6m4hpf1SDrfJ78Mr2twSHFLETSywsXHW7";
pub const ADMIN: &str = "idZLUJ5JTfngiciw99445sqmxfuh7cF7t1QBxFuYf2d";

declare_id!("JBmbzzuur92hmKRoDegWpaL6tmLcHsaJTVzRwv68S9mZ");

#[program]
pub mod raffle_simple { 
    use super::*;

    pub fn init_raffle(
        ctx: Context<InitRaffle>,
        end_timestamp: i64,
        ticket_price: u64,
        max_entrants: u64
    ) -> Result<()> {
        if max_entrants > ENTRANTS_SIZE {
            return Err(error!(RaffleError::MaxEntrantsTooLarge));
        }

        let raffle = &mut ctx.accounts.raffle;
        raffle.total_supply = max_entrants;
        raffle.end_timestamp = end_timestamp;
        raffle.ticket_price = ticket_price;
        raffle.sold = 0;
        Ok(())
    }

    pub fn update_raffle(
        ctx: Context<UpdateRaffle>,
        end_timestamp: i64,
        ticket_price: u64,
        max_entrants: u64,
        sold: u64,
    ) -> Result<()> {
        if max_entrants > ENTRANTS_SIZE {
            return Err(error!(RaffleError::MaxEntrantsTooLarge));
        }

        let raffle = &mut ctx.accounts.raffle;
        raffle.total_supply = max_entrants;
        raffle.end_timestamp = end_timestamp;
        raffle.ticket_price = ticket_price;
        raffle.sold = sold;
        Ok(())
    }

    pub fn read_raffle(
        ctx: Context<ReadRaffle>,
    ) -> Result<()> {
        msg!("In read raffle");
        let total_supply = ctx.accounts.raffle.total_supply;
        let ticket_price = ctx.accounts.raffle.ticket_price;
        let end_timestamp = ctx.accounts.raffle.end_timestamp;
        let sold = ctx.accounts.raffle.sold;
        msg!("The totalSupply is {} and the ticketPrice is {}.", total_supply, ticket_price);
        msg!("The endtimestamp is {} and the sold is {}.", end_timestamp, sold);
        Ok(())
    }

    pub fn burn_token(ctx: Context<BurnToken>, amount: u64) -> Result<()> {
        let clock = Clock::get()?;
        let raffle = &mut ctx.accounts.raffle;
        let sold = raffle.sold;

        // if clock.unix_timestamp > raffle.end_timestamp {
        //     return Err(RaffleError::RaffleEnded.into());
        // }

        if sold + amount > raffle.total_supply {
            return Err(RaffleError::MaxSoldTooLarge.into())
        }

        let transfer_instruction = Burn{
            from: ctx.accounts.token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
         
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);
        let burn_number = amount * raffle.ticket_price;
        anchor_spl::token::burn(cpi_ctx, burn_number)?;
        raffle.sold = sold + amount;

        msg!("burn ({} Token), ({} ticket)", burn_number, amount);
        msg!("ticket has sold {}", raffle.sold);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8, end_timestamp: i64, ticket_price:u64, max_entrants:u64)]
pub struct InitRaffle<'info> {
    #[account(
        init,
        seeds = [CONSTRAINT_SEED.as_ref()],
        bump,
        payer = creator,
        space = size_of::<Raffle>() + 8, // Option serialization workaround
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(mut, address = Pubkey::from_str(ADMIN).unwrap())]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRaffle<'info> {
    #[account(mut, seeds = [CONSTRAINT_SEED.as_ref()], bump)]
    pub raffle: Account<'info, Raffle>,

    #[account(address = Pubkey::from_str(ADMIN).unwrap())]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReadRaffle<'info> {
    #[account(seeds = [CONSTRAINT_SEED.as_ref()], bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct BurnToken<'info> {
    #[account(mut, seeds = [CONSTRAINT_SEED.as_ref()], bump)]
    pub raffle: Account<'info, Raffle>,

    #[account(mut)]
    pub mint: UncheckedAccount<'info>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}


#[account]
#[derive(Default, Debug)]
pub struct Raffle {
    pub end_timestamp: i64,
    pub ticket_price: u64,
    pub total_supply: u64,
    pub sold: u64,
}

#[error_code]
pub enum RaffleError {
    #[msg("Max entrants is too large")]
    MaxEntrantsTooLarge,
    #[msg("Raffle has ended")]
    RaffleEnded,
    #[msg("Max sold is too large")]
    MaxSoldTooLarge,
}
