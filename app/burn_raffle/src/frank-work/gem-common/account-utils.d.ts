import { Connection, PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo, Token } from '@solana/spl-token';
export interface ITokenData {
    tokenMint: PublicKey;
    tokenAcc: PublicKey;
    owner: PublicKey;
    token: Token;
}
export declare class AccountUtils {
    conn: Connection;
    constructor(conn: Connection);
    findProgramAddress(programId: PublicKey, seeds: (PublicKey | Uint8Array | string)[]): Promise<[PublicKey, number]>;
    getBalance(publicKey: PublicKey): Promise<number>;
    deserializeToken(mint: PublicKey): Promise<Token>;
    deserializeTokenMint(mint: PublicKey): Promise<MintInfo>;
    deserializeTokenAccount(mint: PublicKey, tokenAccount: PublicKey): Promise<AccountInfo>;
    findATA(mint: PublicKey, owner: PublicKey): Promise<PublicKey>;
}
