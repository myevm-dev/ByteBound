use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use solana_program::pubkey;

declare_id!("Crx7yqieL9giLRWq9Zgwb3pcRb1g2pKeCkBJ64nJERe1"); 

pub mod external {
    use super::*;
    
    pub const REGISTRY_PROGRAM_ID: Pubkey = pubkey!("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");
    

    pub const IP_ACCOUNT_SEED: &'static [u8] = b"ip-asset";
    pub const IP_VAULT_SEED:   &'static [u8] = b"ip-vault";

    pub const CONTENT_ACCOUNT_SEED: &'static [u8] = b"content";
    pub const CONTENT_VAULT_SEED:   &'static [u8] = b"content-vault";

    pub const COLLECTION_ACCOUNT_SEED: &'static [u8] = b"collection";
    pub const COLLECTION_VAULT_SEED:   &'static [u8] = b"collection-vault";

    pub const BYTEBOUND_TREASURY: Pubkey = pubkey!("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");

    // Tag seeds to separate namespaces per listing kind
    pub const SEED_PURCHASE:  &'static [u8] = b"purchase";
    pub const SEED_RENTAL:    &'static [u8] = b"rental";
    pub const SEED_IP:        &'static [u8] = b"ip";
    pub const SEED_PLACEMENT: &'static [u8] = b"placement";

}

/* --------------------------------- Errors --------------------------------- */

#[error_code]
pub enum MarketError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Listing is inactive")]
    Inactive,
    #[msg("Wrong currency mint")]
    WrongCurrency,
    #[msg("Vault ATA owner mismatch")]
    BadVaultOwner,
    #[msg("Vault ATA mint mismatch")]
    BadVaultMint,
    #[msg("Registry PDA mismatch")]
    BadRegistryPda,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid listing kind for this call")]
    BadKind,
}

/* ---------------------------------- Events -------------------------------- */

#[event]
pub struct Listed {
    pub listing: Pubkey,
    pub seller: Pubkey,
    pub kind: u8,
    pub target_kind: u8,
    pub target_mint: Pubkey,
    pub price: u64,
    pub currency: Pubkey,
    pub duration_secs: u32,
}

#[event]
pub struct Delisted {
    pub listing: Pubkey,
    pub seller: Pubkey,
}

#[event]
pub struct Purchased {
    pub listing: Pubkey,
    pub buyer: Pubkey,
    pub paid: u64,
}

#[event]
pub struct Rented {
    pub listing: Pubkey,
    pub renter: Pubkey,
    pub paid: u64,
    pub until_ts: i64,
}

#[event]
pub struct IpLicensed {
    pub listing: Pubkey,
    pub licensee: Pubkey,
    pub paid: u64,
}

#[event]
pub struct PlacementFunded {
    pub listing: Pubkey,
    pub funder: Pubkey,
    pub amount: u64,
}

/* ---------------------------------- State --------------------------------- */

#[account]
pub struct MarketConfig {
    pub admin: Pubkey,
    pub bump: u8,
}
impl MarketConfig {
    pub const SEED: &'static [u8] = b"market-config";
    pub const SIZE: usize = 32 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ListingKind {
    PurchaseContent = 0,
    RentalContent   = 1,
    IpLicense       = 2,
    Placement       = 3,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TargetKind {
    Content    = 0,
    Collection = 1,
    IpAsset    = 2,
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub kind: u8,             // ListingKind
    pub target_kind: u8,      // TargetKind
    pub target_mint: Pubkey,  // mint that keys the registry PDAs
    pub price: u64,           // in currency mint below
    pub currency_mint: Pubkey,// usually Studio token
    pub duration_secs: u32,   // rentals; 0 otherwise
    pub active: bool,
    pub bump: u8,
}
impl Listing {
    pub const SEED: &'static [u8] = b"listing";
    pub const SIZE: usize = 32 + 1 + 1 + 32 + 8 + 32 + 4 + 1 + 1;
}

/* -------------------------------- Program --------------------------------- */

#[program]
pub mod bytebound_market {
    use super::*;
    use crate::utils::{
        verify_registry_state_pda,
        verify_studio_pda,
        pay_into_registry_vault_with_fee, // for purchase/rent/use_ip
        pay_into_registry_vault,            // kept for add_placement_funds (no fee)
    };


    pub fn init_market(ctx: Context<InitMarket>) -> Result<()> {
        ctx.accounts.config.admin = ctx.accounts.admin.key();
        ctx.accounts.config.bump = ctx.bumps.config;
        Ok(())
    }

    /// List Content or Collection for purchase OR rental.
    pub fn list_purchase_content_or_collection(
        ctx: Context<ListPurchaseContentOrCollection>,
        target_kind: u8,    // Content | Collection
        price: u64,
    ) -> Result<()> {
        require!(target_kind == TargetKind::Content as u8 || target_kind == TargetKind::Collection as u8, MarketError::BadKind);

        verify_registry_state_pda(
            target_kind,
            &ctx.accounts.target_mint.key(),
            &ctx.accounts.registry_pda,
        )?;
        verify_studio_pda(&ctx.accounts.studio_mint.key(), &ctx.accounts.studio_pda)?;

        let l = &mut ctx.accounts.listing;
        l.seller        = ctx.accounts.seller.key();
        l.kind          = ListingKind::PurchaseContent as u8;
        l.target_kind   = target_kind;
        l.target_mint   = ctx.accounts.target_mint.key();
        l.price         = price;
        l.currency_mint = ctx.accounts.studio_mint.key();
        l.duration_secs = 0;
        l.active        = true;
        l.bump          = ctx.bumps.listing;

        emit!(Listed { listing: l.key(), seller: l.seller, kind: l.kind, target_kind: l.target_kind, target_mint: l.target_mint, price, currency: l.currency_mint, duration_secs: 0 });
        Ok(())
    }

    pub fn list_rental_content_or_collection(
        ctx: Context<ListRentContentOrCollection>,
        target_kind: u8,    // Content | Collection
        price: u64,
        duration_secs: u32, // > 0
    ) -> Result<()> {
        require!(target_kind == TargetKind::Content as u8 || target_kind == TargetKind::Collection as u8, MarketError::BadKind);
        require!(duration_secs > 0, MarketError::BadKind);

        verify_registry_state_pda(
            target_kind,
            &ctx.accounts.target_mint.key(),
            &ctx.accounts.registry_pda,
        )?;
        verify_studio_pda(&ctx.accounts.studio_mint.key(), &ctx.accounts.studio_pda)?;

        let l = &mut ctx.accounts.listing;
        l.seller        = ctx.accounts.seller.key();
        l.kind          = ListingKind::RentalContent as u8;
        l.target_kind   = target_kind;
        l.target_mint   = ctx.accounts.target_mint.key();
        l.price         = price;
        l.currency_mint = ctx.accounts.studio_mint.key();
        l.duration_secs = duration_secs;
        l.active        = true;
        l.bump          = ctx.bumps.listing;

        emit!(Listed { listing: l.key(), seller: l.seller, kind: l.kind, target_kind: l.target_kind, target_mint: l.target_mint, price, currency: l.currency_mint, duration_secs });
        Ok(())
    }


    /// List IPAsset for license.
    pub fn list_ip_license(
        ctx: Context<ListIp>,
        price: u64,
    ) -> Result<()> {
        // Verify IpAsset PDA exists
        verify_registry_state_pda(
            TargetKind::IpAsset as u8,
            &ctx.accounts.ip_mint.key(),
            &ctx.accounts.ip_asset_pda,
        )?;

        // Verify StudioAccount PDA for the studio mint
        verify_studio_pda(&ctx.accounts.studio_mint.key(), &ctx.accounts.studio_pda)?;

        let l = &mut ctx.accounts.listing;
        l.seller        = ctx.accounts.seller.key();
        l.kind          = ListingKind::IpLicense as u8;
        l.target_kind   = TargetKind::IpAsset as u8;
        l.target_mint   = ctx.accounts.ip_mint.key();
        l.price         = price;
        l.currency_mint = ctx.accounts.studio_mint.key();
        l.duration_secs = 0;
        l.active        = true;
        l.bump          = ctx.bumps.listing;

        emit!(Listed {
            listing: l.key(),
            seller: l.seller,
            kind: l.kind,
            target_kind: l.target_kind,
            target_mint: l.target_mint,
            price,
            currency: l.currency_mint,
            duration_secs: 0,
        });
        Ok(())
    }


    /// List a placement (bounty) for Content or Collection.
    pub fn list_placement(
        ctx: Context<ListPlacement>,
        target_kind: u8, // Content or Collection
        price: u64,
    ) -> Result<()> {
        require!(
            target_kind == TargetKind::Content as u8 || target_kind == TargetKind::Collection as u8,
            MarketError::BadKind
        );

        verify_registry_state_pda(
            target_kind,
            &ctx.accounts.target_mint.key(),
            &ctx.accounts.registry_pda,
        )?;

        verify_studio_pda(&ctx.accounts.studio_mint.key(), &ctx.accounts.studio_pda)?;

        let l = &mut ctx.accounts.listing;
        l.seller        = ctx.accounts.seller.key();
        l.kind          = ListingKind::Placement as u8;
        l.target_kind   = target_kind;
        l.target_mint   = ctx.accounts.target_mint.key();
        l.price         = price;
        l.currency_mint = ctx.accounts.studio_mint.key(); 
        l.duration_secs = 0;
        l.active        = true;
        l.bump          = ctx.bumps.listing;

        emit!(Listed {
            listing: l.key(),
            seller: l.seller,
            kind: l.kind,
            target_kind,
            target_mint: l.target_mint,
            price,
            currency: l.currency_mint,
            duration_secs: 0,
        });
        Ok(())
    }


    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        require!(ctx.accounts.listing.active, MarketError::Inactive);
        require_keys_eq!(ctx.accounts.listing.seller, ctx.accounts.seller.key(), MarketError::Unauthorized);
        ctx.accounts.listing.active = false;
        emit!(Delisted { listing: ctx.accounts.listing.key(), seller: ctx.accounts.seller.key() });
        Ok(())
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        let l = &ctx.accounts.listing;
        require!(l.active, MarketError::Inactive);
        require_eq!(l.kind, ListingKind::PurchaseContent as u8, MarketError::BadKind);

        pay_into_registry_vault_with_fee(
        l.target_kind,
        &l.target_mint,
        &l.currency_mint,
        l.price,
        &ctx.accounts.payer,
        &ctx.accounts.payer_ata,
        &ctx.accounts.treasury_ata,   
        &ctx.accounts.vault_ata,
        &ctx.accounts.vault_authority,
        &ctx.accounts.token_program,
    )?;

        emit!(Purchased { listing: l.key(), buyer: ctx.accounts.payer.key(), paid: l.price });
        Ok(())
    }

    pub fn rent(ctx: Context<RentAction>) -> Result<()> {
        let l = &ctx.accounts.listing;
        require!(l.active, MarketError::Inactive);
        require_eq!(l.kind, ListingKind::RentalContent as u8, MarketError::BadKind);
        require!(l.duration_secs > 0, MarketError::BadKind);

        pay_into_registry_vault_with_fee(
        l.target_kind,
        &l.target_mint,
        &l.currency_mint,
        l.price,
        &ctx.accounts.payer,
        &ctx.accounts.payer_ata,
        &ctx.accounts.treasury_ata,
        &ctx.accounts.vault_ata,
        &ctx.accounts.vault_authority,
        &ctx.accounts.token_program,
    )?;

        let until_ts = Clock::get()?.unix_timestamp
            .checked_add(l.duration_secs as i64)
            .ok_or(MarketError::MathOverflow)?;
        emit!(Rented { listing: l.key(), renter: ctx.accounts.payer.key(), paid: l.price, until_ts });
        Ok(())
    }

    pub fn use_ip(ctx: Context<UseIp>) -> Result<()> {
        let l = &ctx.accounts.listing;
        require!(l.active, MarketError::Inactive);
        require_eq!(l.kind, ListingKind::IpLicense as u8, MarketError::BadKind);

        pay_into_registry_vault_with_fee(
        TargetKind::IpAsset as u8,
        &l.target_mint,
        &l.currency_mint,
        l.price,
        &ctx.accounts.payer,
        &ctx.accounts.payer_ata,
        &ctx.accounts.treasury_ata,
        &ctx.accounts.vault_ata,
        &ctx.accounts.vault_authority,
        &ctx.accounts.token_program,
    )?;

        emit!(IpLicensed { listing: l.key(), licensee: ctx.accounts.payer.key(), paid: l.price });
        Ok(())
    }

    pub fn add_placement_funds(ctx: Context<AddPlacementFunds>, amount: u64) -> Result<()> {
        let l = &ctx.accounts.listing;
        require!(l.active, MarketError::Inactive);
        require_eq!(l.kind, ListingKind::Placement as u8, MarketError::BadKind);

        // no 20% fee for placements
        pay_into_registry_vault(
            l.target_kind,
            &l.target_mint,
            &l.currency_mint,
            amount,
            &ctx.accounts.payer,
            &ctx.accounts.payer_ata,
            &ctx.accounts.vault_ata,
            &ctx.accounts.vault_authority,
            &ctx.accounts.token_program,
        )?;

        emit!(PlacementFunded { listing: l.key(), funder: ctx.accounts.payer.key(), amount });
        Ok(())
    }

}
/* -------------------------------- Helpers --------------------------------- */
mod utils {
    use super::*;
    use anchor_spl::token::{self, Token, TokenAccount, Transfer};

    /// Ensure the passed Registry state PDA (content / collection / ip) matches
    /// seeds and is owned by the Registry program.
    pub fn verify_registry_state_pda(
        target_kind: u8,
        mint: &Pubkey,
        provided_state_pda: &UncheckedAccount,
    ) -> Result<()> {
        require_keys_eq!(
            *provided_state_pda.owner,
            external::REGISTRY_PROGRAM_ID,
            MarketError::Unauthorized
        );

        let seed = match target_kind {
            x if x == crate::TargetKind::Content as u8    => external::CONTENT_ACCOUNT_SEED,
            x if x == crate::TargetKind::Collection as u8 => external::COLLECTION_ACCOUNT_SEED,
            x if x == crate::TargetKind::IpAsset as u8    => external::IP_ACCOUNT_SEED,
            _ => return err!(MarketError::Unauthorized),
        };
        let (expected, _) =
            Pubkey::find_program_address(&[seed, mint.as_ref()], &external::REGISTRY_PROGRAM_ID);
        require_keys_eq!(expected, provided_state_pda.key(), MarketError::BadRegistryPda);
        Ok(())
    }

    /// Ensure StudioAccount PDA = ["studio", studio_mint] under Registry program.
    pub fn verify_studio_pda(studio_mint: &Pubkey, studio_pda: &UncheckedAccount) -> Result<()> {
        require_keys_eq!(
            *studio_pda.owner,
            external::REGISTRY_PROGRAM_ID,
            MarketError::Unauthorized
        );
        let (expected, _) = Pubkey::find_program_address(
            &[b"studio", studio_mint.as_ref()],
            &external::REGISTRY_PROGRAM_ID,
        );
        require_keys_eq!(expected, studio_pda.key(), MarketError::Unauthorized);
        Ok(())
    }

    /// Derive the expected vault authority PDA for the given target kind + mint.
    pub fn expected_vault_authority(target_kind: u8, mint: &Pubkey) -> Result<Pubkey> {
        let seed = match target_kind {
            x if x == crate::TargetKind::Content as u8    => external::CONTENT_VAULT_SEED,
            x if x == crate::TargetKind::Collection as u8 => external::COLLECTION_VAULT_SEED,
            x if x == crate::TargetKind::IpAsset as u8    => external::IP_VAULT_SEED,
            _ => return err!(MarketError::Unauthorized),
        };
        let (expected, _) =
            Pubkey::find_program_address(&[seed, mint.as_ref()], &external::REGISTRY_PROGRAM_ID);
        Ok(expected)
    }

    /// Transfer `amount` of the listing’s studio token from payer → (20%) treasury ATA + (80%) registry vault ATA.
    pub fn pay_into_registry_vault_with_fee<'info>(
        target_kind: u8,
        target_mint: &Pubkey,
        expected_currency_mint: &Pubkey, 
        amount: u64,
        payer: &Signer<'info>,
        payer_ata: &Account<'info, TokenAccount>,
        treasury_ata: &Account<'info, TokenAccount>,
        vault_ata: &Account<'info, TokenAccount>,
        vault_authority: &UncheckedAccount<'info>,
        token_program: &Program<'info, Token>,
    ) -> Result<()> {
        // currency checks (all ATAs share the same mint)
        require_keys_eq!(payer_ata.mint, *expected_currency_mint, MarketError::WrongCurrency);
        require_keys_eq!(treasury_ata.mint, *expected_currency_mint, MarketError::WrongCurrency);
        require_keys_eq!(vault_ata.mint, *expected_currency_mint, MarketError::BadVaultMint);
        require_keys_eq!(payer_ata.owner, payer.key(), MarketError::Unauthorized);

        // treasury ATA must be owned by the known treasury system account
        require_keys_eq!(
            treasury_ata.owner,
            external::BYTEBOUND_TREASURY,
            MarketError::Unauthorized
        );

        // registry vault authority check
        let expected = expected_vault_authority(target_kind, target_mint)?;
        require_keys_eq!(expected, vault_authority.key(), MarketError::Unauthorized);
        require_keys_eq!(vault_ata.owner, vault_authority.key(), MarketError::BadVaultOwner);

        // split: 20% fee to treasury, 80% to registry vault
        let fee = amount
            .checked_mul(20)
            .ok_or(MarketError::MathOverflow)?
            .checked_div(100)
            .ok_or(MarketError::MathOverflow)?;
        let to_vault = amount
            .checked_sub(fee)
            .ok_or(MarketError::MathOverflow)?;

        // 1) pay treasury fee
        if fee > 0 {
            token::transfer(
                CpiContext::new(
                    token_program.to_account_info(),
                    Transfer {
                        from: payer_ata.to_account_info(),
                        to:   treasury_ata.to_account_info(),
                        authority: payer.to_account_info(),
                    },
                ),
                fee,
            )?;
        }

        // 2) pay remaining to registry vault
        if to_vault > 0 {
            token::transfer(
                CpiContext::new(
                    token_program.to_account_info(),
                    Transfer {
                        from: payer_ata.to_account_info(),
                        to:   vault_ata.to_account_info(),
                        authority: payer.to_account_info(),
                    },
                ),
                to_vault,
            )?;
        }

        Ok(())
    }

    pub fn pay_into_registry_vault<'info>(
        target_kind: u8,
        target_mint: &Pubkey,
        expected_currency_mint: &Pubkey,
        amount: u64,
        payer: &Signer<'info>,
        payer_ata: &Account<'info, TokenAccount>,
        vault_ata: &Account<'info, TokenAccount>,
        vault_authority: &UncheckedAccount<'info>,
        token_program: &Program<'info, Token>,
    ) -> Result<()> {
        // currency checks
        require_keys_eq!(payer_ata.mint, *expected_currency_mint, MarketError::WrongCurrency);
        require_keys_eq!(vault_ata.mint, *expected_currency_mint, MarketError::BadVaultMint);
        require_keys_eq!(payer_ata.owner, payer.key(), MarketError::Unauthorized);

        // registry vault authority check
        let expected = expected_vault_authority(target_kind, target_mint)?;
        require_keys_eq!(expected, vault_authority.key(), MarketError::Unauthorized);
        require_keys_eq!(vault_ata.owner, vault_authority.key(), MarketError::BadVaultOwner);

        token::transfer(
            CpiContext::new(
                token_program.to_account_info(),
                Transfer {
                    from: payer_ata.to_account_info(),
                    to:   vault_ata.to_account_info(),
                    authority: payer.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }
}

/* -------------------------------- Contexts -------------------------------- */

#[derive(Accounts)]
pub struct InitMarket<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + MarketConfig::SIZE,
        seeds = [MarketConfig::SEED],
        bump
    )]
    pub config: Account<'info, MarketConfig>,
    pub system_program: Program<'info, System>,
}

/* ---------- LIST (creates a unique PDA per kind via tag seeds) ---------- */

#[derive(Accounts)]
pub struct ListPurchaseContentOrCollection<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: content or collection mint used as key in registry
    pub target_mint: UncheckedAccount<'info>,

    /// CHECK: ContentAccount or CollectionAccount PDA from registry
    pub registry_pda: UncheckedAccount<'info>,

    /// CHECK: studio token mint used as currency
    pub studio_mint: UncheckedAccount<'info>,
    /// CHECK: StudioAccount PDA for studio_mint (under registry program)
    pub studio_pda: UncheckedAccount<'info>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SIZE,
        seeds = [
            Listing::SEED,
            external::SEED_PURCHASE,
            target_mint.key().as_ref(),
            seller.key().as_ref()
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListRentContentOrCollection<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: content or collection mint used as key in registry
    pub target_mint: UncheckedAccount<'info>,

    /// CHECK: ContentAccount or CollectionAccount PDA from registry
    pub registry_pda: UncheckedAccount<'info>,

    /// CHECK: studio token mint used as currency
    pub studio_mint: UncheckedAccount<'info>,
    /// CHECK: StudioAccount PDA for studio_mint (under registry program)
    pub studio_pda: UncheckedAccount<'info>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SIZE,
        seeds = [
            Listing::SEED,
            external::SEED_RENTAL,
            target_mint.key().as_ref(),
            seller.key().as_ref()
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListIp<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: IP mint used as key in registry
    pub ip_mint: UncheckedAccount<'info>,

    /// CHECK: IpAssetAccount PDA from registry
    pub ip_asset_pda: UncheckedAccount<'info>,

    /// CHECK: studio token mint used as currency
    pub studio_mint: UncheckedAccount<'info>,
    /// CHECK: StudioAccount PDA for studio_mint (under registry program)
    pub studio_pda: UncheckedAccount<'info>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SIZE,
        seeds = [
            Listing::SEED,
            external::SEED_IP,
            ip_mint.key().as_ref(),
            seller.key().as_ref()
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListPlacement<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: content or collection mint used as key in registry
    pub target_mint: UncheckedAccount<'info>,

    /// CHECK: ContentAccount or CollectionAccount PDA from registry
    pub registry_pda: UncheckedAccount<'info>,

    /// CHECK: studio token mint used as currency
    pub studio_mint: UncheckedAccount<'info>,
    /// CHECK: StudioAccount PDA for studio_mint (under registry program)
    pub studio_pda: UncheckedAccount<'info>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SIZE,
        seeds = [
            Listing::SEED,
            external::SEED_PLACEMENT,
            target_mint.key().as_ref(),
            seller.key().as_ref()
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

/* ------------- DELIST (tag-agnostic; works for any listing) ------------- */

#[derive(Accounts)]
pub struct Delist<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        mut,
        has_one = seller @ MarketError::Unauthorized
    )]
    pub listing: Account<'info, Listing>,
}

/* --------------- ACTIONS (use the same tag that created it) -------------- */

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub payer: Signer<'info>, // buyer

    #[account(
        mut,
        seeds = [
            Listing::SEED,
            external::SEED_PURCHASE,
            listing.target_mint.as_ref(),
            listing.seller.as_ref()
        ],
        bump = listing.bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub payer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>,
    /// CHECK: PDA derived from registry seeds (content/collection vault authority)
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RentAction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>, // renter

    #[account(
        mut,
        seeds = [
            Listing::SEED,
            external::SEED_RENTAL,
            listing.target_mint.as_ref(),
            listing.seller.as_ref()
        ],
        bump = listing.bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub payer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>,
    /// CHECK
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UseIp<'info> {
    #[account(mut)]
    pub payer: Signer<'info>, // licensee

    #[account(
        mut,
        seeds = [
            Listing::SEED,
            external::SEED_IP,
            listing.target_mint.as_ref(),
            listing.seller.as_ref()
        ],
        bump = listing.bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub payer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>,
    /// CHECK
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AddPlacementFunds<'info> {
    #[account(mut)]
    pub payer: Signer<'info>, // funder

    #[account(
        mut,
        seeds = [
            Listing::SEED,
            external::SEED_PLACEMENT,
            listing.target_mint.as_ref(),
            listing.seller.as_ref()
        ],
        bump = listing.bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub payer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>,
    /// CHECK
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}
