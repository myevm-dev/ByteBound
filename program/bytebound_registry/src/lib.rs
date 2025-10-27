use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer };
use solana_program::{program::invoke, system_instruction, pubkey};

declare_id!("2uJQDRDNa92k8wmroZmAY7fM5Zm9zpLaWM7YYTAaPgqo");

pub mod external {
    use super::*;
    pub const TEST_USDC_MINT: Pubkey = pubkey!("Gjzrqj6vWMAeXt3oxMYHwc29NyZiMAUb7EzChVTeQGqu");
    pub const BYTEBOUND_TREASURY: Pubkey = pubkey!("Bw4Hwq8QRVhZaMvYLAesMwJX5a7Xv3u25bvzFTRDBacz");
    pub const PUMPFUN_V2_PROGRAM: Pubkey = pubkey!("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
    // ---- Fees (lamports) ----
    pub const FEE_IP_ASSET:   u64 = 30_000_000;  // 0.03 SOL
    pub const FEE_CONTENT:    u64 = 60_000_000;  // 0.06 SOL
    pub const FEE_COLLECTION: u64 = 90_000_000;  // 0.09 SOL

}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient credits.")]
    InsufficientCredits,
    #[msg("Invalid token account mint.")]
    InvalidMint,
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Royalty map already finalized / immutable.")]
    Immutable,
    #[msg("Overflow.")]
    MathOverflow,
    #[msg("Invalid program id provided.")]
    InvalidProgramId,
}

#[event]
pub struct CreditsPurchased {
    pub user: Pubkey,
    pub amount: u64,
    pub mint: Pubkey,
    pub to: Pubkey,
}

#[event]
pub struct CreditsSpent {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct StudioVerified {
    pub studio: Pubkey,
    pub verified_by: Pubkey,
    pub metadata_uri: String,
}

#[event]
pub struct IpAssetRegistered {
    pub owner: Pubkey,
    pub ip_mint: Pubkey,
    pub vault_authority: Pubkey,
}

#[event]
pub struct ContentRegistered {
    pub owner: Pubkey,
    pub content_mint: Pubkey,
    pub vault_authority: Pubkey,
}

#[event]
pub struct CollectionRegistered {
    pub owner: Pubkey,
    pub collection_mint: Pubkey,
    pub vault_authority: Pubkey,
}

#[event]
pub struct IpLinkedToContent {
    pub content_pda: Pubkey,
    pub ip_pda: Pubkey,
}

#[account]
pub struct RegistryConfig {
    pub admin: Pubkey,
    pub usdc_mint: Pubkey,
    pub treasury: Pubkey,
    pub bump: u8,
}
impl RegistryConfig {
    pub const SEED: &'static [u8] = b"registry-config";
    pub const SIZE: usize = 32 + 32 + 32 + 1;
}

#[account]
pub struct UserCredits {
    pub user: Pubkey,
    pub balance: u64,
    pub bump: u8,
}
impl UserCredits {
    pub const SEED: &'static [u8] = b"user-credits";
    pub const SIZE: usize = 32 + 8 + 1;
}

#[account]
pub struct StudioAccount {
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub verified: bool,
    pub bump: u8,
}
impl StudioAccount {
    pub const SEED: &'static [u8] = b"studio";
    pub const SIZE: usize = 32 + 32 + 1 + 1;
}

#[account]
pub struct IpAssetAccount {
    pub owner: Pubkey,
    pub ip_mint: Pubkey,
    pub vault_authority: Pubkey, // PDA (no data account; used as authority)
    pub bump: u8,                // IpAssetAccount bump
    pub vault_bump: u8,          // ip-vault bump
}
impl IpAssetAccount {
    pub const SEED: &'static [u8] = b"ip-asset";
    pub const VAULT_SEED: &'static [u8] = b"ip-vault";
    pub const SIZE: usize = 32 + 32 + 32 + 1 + 1;
}

#[account]
pub struct ContentAccount {
    pub owner: Pubkey,
    pub content_mint: Pubkey,
    pub vault_authority: Pubkey, // PDA (no data account; used as authority)
    pub ip_assets: Vec<Pubkey>,  // IpAssetAccount PDAs
    pub bump: u8,
    pub vault_bump: u8,
}
impl ContentAccount {
    pub const SEED: &'static [u8] = b"content";
    pub const VAULT_SEED: &'static [u8] = b"content-vault";
    // Vec<Pubkey> serialized with a prefix; budget e.g. 10 IP refs -> 4 + 10*32 = 324
    pub const SIZE: usize = 32 + 32 + 32 + (4 + 10*32) + 1 + 1;
}

#[account]
pub struct CollectionAccount {
    pub owner: Pubkey,
    pub collection_mint: Pubkey,
    pub vault_authority: Pubkey, // PDA authority that can "own" ATAs for many content mints
    pub bump: u8,
    pub vault_bump: u8,
}
impl CollectionAccount {
    pub const SEED: &'static [u8] = b"collection";
    pub const VAULT_SEED: &'static [u8] = b"collection-vault";
    pub const SIZE: usize = 32 + 32 + 32 + 1 + 1;
}

// Verify StudioAccount is marked verified and matches the studio_mint used as a seed
fn assert_verified_studio(studio: &Account<StudioAccount>, studio_mint: &Pubkey) -> Result<()> {
    require!(studio.verified, CustomError::Unauthorized);
    require_keys_eq!(studio.token_mint, *studio_mint, CustomError::Unauthorized);
    Ok(())
}

// Pay lamports to treasury using System Program (no PDAs involved)
fn pay_treasury<'info>(
    from: &Signer<'info>,
    to:   &AccountInfo<'info>,
    system_program: &Program<'info, System>,
    lamports: u64,
) -> Result<()> {
    if lamports == 0 {
        return Ok(());
    }
    anchor_lang::solana_program::program::invoke(
        &system_instruction::transfer(&from.key(), &to.key(), lamports),
        &[
            from.to_account_info(),
            to.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;
    Ok(())
}

#[program]
pub mod bytebound_registry {
    use super::*;

    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        let cfg = &mut ctx.accounts.config;
        cfg.admin = ctx.accounts.admin.key();
        cfg.usdc_mint = external::TEST_USDC_MINT;
        cfg.treasury = external::BYTEBOUND_TREASURY;
        cfg.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn buy_generation_credits(ctx: Context<BuyCredits>, credits: u64) -> Result<()> {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_usdc_ata.to_account_info(),
                    to: ctx.accounts.treasury_usdc_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            credits,
        )?;

        let acc = &mut ctx.accounts.user_credits;
        acc.user = ctx.accounts.user.key();
        acc.bump = ctx.bumps.user_credits;

        acc.balance = acc
            .balance
            .checked_add(credits)
            .ok_or(CustomError::MathOverflow)?;

        emit!(CreditsPurchased {
            user: ctx.accounts.user.key(),
            amount: credits,
            mint: external::TEST_USDC_MINT,
            to: ctx.accounts.treasury_usdc_ata.key(),
        });

        Ok(())
    }

    pub fn spend_generation_credits(ctx: Context<SpendCredits>, credits: u64) -> Result<()> {
        let acc = &mut ctx.accounts.user_credits;
        require_keys_eq!(acc.user, ctx.accounts.user.key(), CustomError::Unauthorized);
        require!(acc.balance >= credits, CustomError::InsufficientCredits);

        acc.balance -= credits;

        emit!(CreditsSpent {
            user: ctx.accounts.user.key(),
            amount: credits,
        });

        Ok(())
    }

    pub fn register_studio(ctx: Context<RegisterStudio>, mint: Pubkey) -> Result<()> {
        // Transfer 1 SOL to treasury
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.creator.key(),
                &external::BYTEBOUND_TREASURY,
                1_000_000_000,
            ),
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let studio = &mut ctx.accounts.studio_account;
        studio.creator = ctx.accounts.creator.key();
        studio.token_mint = mint;
        studio.verified = false;
        studio.bump = ctx.bumps.studio_account;

        Ok(())
    }

    pub fn verify_studio(
        ctx: Context<VerifyStudio>,
        metadata_uri: String,
    ) -> Result<()> {
        // (optional but recommended) ensure admin matches config
        // require_keys_eq!(ctx.accounts.config.admin, ctx.accounts.admin.key(), CustomError::Unauthorized);

        let decimals = ctx.accounts.mint.decimals;
        let forty_m: u128 = 40_000_000;
        let scale = (10u128).checked_pow(decimals as u32).ok_or(CustomError::MathOverflow)?;
        let amount: u64 = forty_m
            .checked_mul(scale)
            .ok_or(CustomError::MathOverflow)?
            .try_into()
            .map_err(|_| CustomError::MathOverflow)?;

        // ATAs must already exist
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.creator_ata.to_account_info(),
                    to: ctx.accounts.treasury_ata.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            amount,
        )?;

        ctx.accounts.studio_account.verified = true;

        emit!(StudioVerified {
            studio: ctx.accounts.studio_account.key(),
            verified_by: ctx.accounts.admin.key(),
            metadata_uri,
        });

        Ok(())
    }


    pub fn close_user_credits(ctx: Context<CloseUserCredits>) -> Result<()> {
        require!(
            ctx.accounts.user_credits.balance == 0,
            CustomError::InsufficientCredits
        );
        Ok(())
    }

 

    pub fn register_ip_asset(ctx: Context<RegisterIpAsset>) -> Result<()> {
        // 1) Verified studio gate
        assert_verified_studio(&ctx.accounts.studio_account, &ctx.accounts.studio_mint.key())?;

        // 2) Pay registration fee → treasury
        pay_treasury(
            &ctx.accounts.owner,
            &ctx.accounts.treasury,
            &ctx.accounts.system_program,
            external::FEE_IP_ASSET,
        )?;

        // 3) Usual PDA derivation / init
        let ip_mint = ctx.accounts.ip_mint.key();
        let (vault_auth, vault_bump) = Pubkey::find_program_address(
            &[IpAssetAccount::VAULT_SEED, ip_mint.as_ref()],
            ctx.program_id,
        );

        let acc = &mut ctx.accounts.ip_asset;
        acc.owner = ctx.accounts.owner.key();
        acc.ip_mint = ip_mint;
        acc.vault_authority = vault_auth;
        acc.bump = ctx.bumps.ip_asset;
        acc.vault_bump = vault_bump;

        emit!(IpAssetRegistered { owner: acc.owner, ip_mint, vault_authority: vault_auth });
        Ok(())
    }


    pub fn register_content(ctx: Context<RegisterContent>) -> Result<()> {
        // 1) Verified studio gate
        assert_verified_studio(&ctx.accounts.studio_account, &ctx.accounts.studio_mint.key())?;

        // 2) Pay registration fee → treasury
        pay_treasury(
            &ctx.accounts.owner,
            &ctx.accounts.treasury,
            &ctx.accounts.system_program,
            external::FEE_CONTENT,
        )?;

        // 3) Usual PDA derivation / init
        let content_mint = ctx.accounts.content_mint.key();
        let (vault_auth, vault_bump) = Pubkey::find_program_address(
            &[ContentAccount::VAULT_SEED, content_mint.as_ref()],
            ctx.program_id,
        );

        let acc = &mut ctx.accounts.content;
        acc.owner = ctx.accounts.owner.key();
        acc.content_mint = content_mint;
        acc.vault_authority = vault_auth;
        acc.ip_assets = Vec::new();
        acc.bump = ctx.bumps.content;
        acc.vault_bump = vault_bump;

        emit!(ContentRegistered { owner: acc.owner, content_mint, vault_authority: vault_auth });
        Ok(())
    }


    pub fn register_collection(ctx: Context<RegisterCollection>) -> Result<()> {
        // 1) Verified studio gate
        assert_verified_studio(&ctx.accounts.studio_account, &ctx.accounts.studio_mint.key())?;

        // 2) Pay registration fee → treasury
        pay_treasury(
            &ctx.accounts.owner,
            &ctx.accounts.treasury,
            &ctx.accounts.system_program,
            external::FEE_COLLECTION,

        )?;

        // 3) Usual PDA derivation / init
        let collection_mint = ctx.accounts.collection_mint.key();
        let (vault_auth, vault_bump) = Pubkey::find_program_address(
            &[CollectionAccount::VAULT_SEED, collection_mint.as_ref()],
            ctx.program_id,
        );

        let acc = &mut ctx.accounts.collection;
        acc.owner = ctx.accounts.owner.key();
        acc.collection_mint = collection_mint;
        acc.vault_authority = vault_auth;
        acc.bump = ctx.bumps.collection;
        acc.vault_bump = vault_bump;

        emit!(CollectionRegistered { owner: acc.owner, collection_mint, vault_authority: vault_auth });
        Ok(())
    }


    pub fn link_ip_asset_to_content(ctx: Context<LinkIpAssetToContent>) -> Result<()> {
        let content = &mut ctx.accounts.content;
        // owner check (content owner controls linkage)
        require_keys_eq!(content.owner, ctx.accounts.owner.key(), CustomError::Unauthorized);

        let ip_pda = ctx.accounts.ip_asset.key();
        // de-dup
        if !content.ip_assets.iter().any(|k| k == &ip_pda) {
            content.ip_assets.push(ip_pda);
        }

        emit!(IpLinkedToContent {
            content_pda: content.key(),
            ip_pda,
        });
        Ok(())
    }

    pub fn withdraw_ip_asset_royalties(ctx: Context<WithdrawIpAssetRoyalties>, amount: u64) -> Result<()> {
        // gate: only recorded owner can withdraw
        require_keys_eq!(ctx.accounts.ip_asset.owner, ctx.accounts.owner.key(), CustomError::Unauthorized);

        // mint must match between source and destination
        require_keys_eq!(ctx.accounts.vault_ata.mint, ctx.accounts.recipient_ata.mint, CustomError::InvalidMint);

        // re-derive expected PDA
        let (expected_vault, _) = Pubkey::find_program_address(
            &[IpAssetAccount::VAULT_SEED, ctx.accounts.ip_asset.ip_mint.as_ref()],
            ctx.program_id,
        );
        require_keys_eq!(expected_vault, ctx.accounts.vault_authority.key(), CustomError::Unauthorized);

        // PDA signer seeds
        let seeds: &[&[u8]] = &[
            IpAssetAccount::VAULT_SEED,
            ctx.accounts.ip_asset.ip_mint.as_ref(),
            &[ctx.accounts.ip_asset.vault_bump],
        ];
        let signer = &[seeds];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to:   ctx.accounts.recipient_ata.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn withdraw_content_royalties(ctx: Context<WithdrawContentRoyalties>, amount: u64) -> Result<()> {
        require_keys_eq!(ctx.accounts.content.owner, ctx.accounts.owner.key(), CustomError::Unauthorized);
        require_keys_eq!(ctx.accounts.vault_ata.mint, ctx.accounts.recipient_ata.mint, CustomError::InvalidMint);

        let (expected_vault, _) = Pubkey::find_program_address(
            &[ContentAccount::VAULT_SEED, ctx.accounts.content.content_mint.as_ref()],
            ctx.program_id,
        );
        require_keys_eq!(expected_vault, ctx.accounts.vault_authority.key(), CustomError::Unauthorized);

        let seeds: &[&[u8]] = &[
            ContentAccount::VAULT_SEED,
            ctx.accounts.content.content_mint.as_ref(),
            &[ctx.accounts.content.vault_bump],
        ];
        let signer = &[seeds];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to:   ctx.accounts.recipient_ata.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn withdraw_collection_assets(ctx: Context<WithdrawCollectionAssets>, amount: u64) -> Result<()> {
        require_keys_eq!(ctx.accounts.collection.owner, ctx.accounts.owner.key(), CustomError::Unauthorized);
        require_keys_eq!(ctx.accounts.vault_ata.mint, ctx.accounts.recipient_ata.mint, CustomError::InvalidMint);

        let (expected_vault, _) = Pubkey::find_program_address(
            &[CollectionAccount::VAULT_SEED, ctx.accounts.collection.collection_mint.as_ref()],
            ctx.program_id,
        );
        require_keys_eq!(expected_vault, ctx.accounts.vault_authority.key(), CustomError::Unauthorized);

        let seeds: &[&[u8]] = &[
            CollectionAccount::VAULT_SEED,
            ctx.accounts.collection.collection_mint.as_ref(),
            &[ctx.accounts.collection.vault_bump],
        ];
        let signer = &[seeds];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to:   ctx.accounts.recipient_ata.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        Ok(())
    }


    pub fn close_registry_config(ctx: Context<CloseRegistryConfig>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.config.admin,
            ctx.accounts.admin.key(),
            CustomError::Unauthorized
        );
        Ok(())
    }

}

/* -------------------------------- Contexts -------------------------------- */

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + RegistryConfig::SIZE,
        seeds = [RegistryConfig::SEED],
        bump,
    )]
    pub config: Account<'info, RegistryConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyCredits<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(seeds = [RegistryConfig::SEED], bump = config.bump)]
    pub config: Account<'info, RegistryConfig>,
    #[account(mut)]
    pub user_usdc_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_usdc_ata: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserCredits::SIZE,
        seeds = [UserCredits::SEED, user.key().as_ref()],
        bump,
    )]
    pub user_credits: Account<'info, UserCredits>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SpendCredits<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [UserCredits::SEED, user.key().as_ref()],
        bump = user_credits.bump,
        has_one = user @ CustomError::Unauthorized,
    )]
    pub user_credits: Account<'info, UserCredits>,
}

#[derive(Accounts)]
pub struct RegisterStudio<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        seeds = [RegistryConfig::SEED],
        bump = config.bump,
    )]
    pub config: Account<'info, RegistryConfig>,

    #[account(
        init,
        payer = creator,
        space = 8 + StudioAccount::SIZE,
        seeds = [StudioAccount::SEED, mint.key().as_ref()],  
        bump,
    )]
    pub studio_account: Account<'info, StudioAccount>,

    /// This is the mint of the Pump.fun token the studio will be associated with
    pub mint: Account<'info, Mint>,

    /// Treasury is a system account that receives 1 SOL
    #[account(mut, address = external::BYTEBOUND_TREASURY)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct VerifyStudio<'info> {
    pub admin: Signer<'info>,
    #[account(
        seeds = [RegistryConfig::SEED],
        bump = config.bump,
    )]
    pub config: Account<'info, RegistryConfig>,
    #[account(
        mut,
        seeds = [StudioAccount::SEED, studio_account.token_mint.as_ref()],
        bump = studio_account.bump,
    )]
    pub studio_account: Account<'info, StudioAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub creator_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_ata: Account<'info, TokenAccount>,
    #[account(mut, address = external::BYTEBOUND_TREASURY)]
    pub treasury: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CloseUserCredits<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [UserCredits::SEED, user.key().as_ref()],
        bump = user_credits.bump,
        has_one = user @ CustomError::Unauthorized,
        close = recipient
    )]
    pub user_credits: Account<'info, UserCredits>,
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseRegistryConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [RegistryConfig::SEED],
        bump = config.bump,
        close = recipient
    )]
    pub config: Account<'info, RegistryConfig>,
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterIpAsset<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    // NEW: Verified studio inputs
    /// CHECK: used as key and seed only
    pub studio_mint: UncheckedAccount<'info>,
    #[account(
        seeds = [StudioAccount::SEED, studio_mint.key().as_ref()],
        bump = studio_account.bump
    )]
    pub studio_account: Account<'info, StudioAccount>,

    #[account(
        init,
        payer = owner,
        space = 8 + IpAssetAccount::SIZE,
        seeds = [IpAssetAccount::SEED, ip_mint.key().as_ref()],
        bump
    )]
    pub ip_asset: Account<'info, IpAssetAccount>,

    /// CHECK: key only
    pub ip_mint: UncheckedAccount<'info>,

    /// Treasury that receives the registration fee
    #[account(mut, address = external::BYTEBOUND_TREASURY)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterContent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    // NEW: Verified studio inputs
    /// CHECK: used as key and seed only
    pub studio_mint: UncheckedAccount<'info>,
    #[account(
        seeds = [StudioAccount::SEED, studio_mint.key().as_ref()],
        bump = studio_account.bump
    )]
    pub studio_account: Account<'info, StudioAccount>,

    #[account(
        init,
        payer = owner,
        space = 8 + ContentAccount::SIZE,
        seeds = [ContentAccount::SEED, content_mint.key().as_ref()],
        bump
    )]
    pub content: Account<'info, ContentAccount>,

    /// CHECK: key only
    pub content_mint: UncheckedAccount<'info>,

    /// Treasury that receives the registration fee
    #[account(mut, address = external::BYTEBOUND_TREASURY)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct LinkIpAssetToContent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [ContentAccount::SEED, content.content_mint.as_ref()],
        bump = content.bump
    )]
    pub content: Account<'info, ContentAccount>,
    #[account(
        seeds = [IpAssetAccount::SEED, ip_asset.ip_mint.as_ref()],
        bump = ip_asset.bump
    )]
    pub ip_asset: Account<'info, IpAssetAccount>,
}

#[derive(Accounts)]
pub struct RegisterCollection<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    // NEW: Verified studio inputs
    /// CHECK: used as key and seed only
    pub studio_mint: UncheckedAccount<'info>,
    #[account(
        seeds = [StudioAccount::SEED, studio_mint.key().as_ref()],
        bump = studio_account.bump
    )]
    pub studio_account: Account<'info, StudioAccount>,

    #[account(
        init,
        payer = owner,
        space = 8 + CollectionAccount::SIZE,
        seeds = [CollectionAccount::SEED, collection_mint.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, CollectionAccount>,

    /// CHECK: key only
    pub collection_mint: UncheckedAccount<'info>,

    /// Treasury that receives the registration fee
    #[account(mut, address = external::BYTEBOUND_TREASURY)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct WithdrawIpAssetRoyalties<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [IpAssetAccount::SEED, ip_asset.ip_mint.as_ref()],
        bump = ip_asset.bump
    )]
    pub ip_asset: Account<'info, IpAssetAccount>,

    /// CHECK: PDA; verified by re-derivation in handler
    pub vault_authority: UncheckedAccount<'info>,

    // PDA-owned ATA holding royalties
    #[account(
        mut,
        constraint = vault_ata.owner == vault_authority.key() @ CustomError::Unauthorized
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    // Owner’s ATA (same mint)
    #[account(mut)]
    pub recipient_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawContentRoyalties<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [ContentAccount::SEED, content.content_mint.as_ref()],
        bump = content.bump
    )]
    pub content: Account<'info, ContentAccount>,

    /// CHECK
    pub vault_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = vault_ata.owner == vault_authority.key() @ CustomError::Unauthorized
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub recipient_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawCollectionAssets<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [CollectionAccount::SEED, collection.collection_mint.as_ref()],
        bump = collection.bump
    )]
    pub collection: Account<'info, CollectionAccount>,

    /// CHECK
    pub vault_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = vault_ata.owner == vault_authority.key() @ CustomError::Unauthorized
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub recipient_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
