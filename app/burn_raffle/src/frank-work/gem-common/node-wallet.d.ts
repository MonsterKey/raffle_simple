import * as anchor from '@project-serum/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { AccountUtils, ITokenData } from './account-utils';
import { Token } from '@solana/spl-token';
export declare class NodeWallet extends AccountUtils {
    wallet: anchor.Wallet;
    constructor(conn: Connection, wallet: anchor.Wallet);
    createFundedWallet(lamports: number): Promise<Keypair>;
    createMint(decimals: number, authority?: Keypair): Promise<Token>;
    createNativeMint(): Promise<Token>;
    createAndFundATA(token: Token, owner: PublicKey, amount: BN): Promise<PublicKey>;
    createMintAndFundATA(owner: PublicKey, amount: BN): Promise<ITokenData>;
}
