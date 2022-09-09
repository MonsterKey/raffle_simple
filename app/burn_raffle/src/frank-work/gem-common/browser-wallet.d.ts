import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';
import { AccountUtils } from './account-utils';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
export interface TxWithSigners {
    tx: Transaction;
    signers: Signer[];
}
export declare class BrowserWallet extends AccountUtils {
    wallet: SignerWalletAdapter;
    constructor(conn: Connection, wallet: SignerWalletAdapter);
    createMintTx(authority: PublicKey, payer: PublicKey, decimals: number): Promise<[PublicKey, TxWithSigners]>;
    mintToTx(mint: PublicKey, dest: PublicKey, authority: PublicKey, payer: PublicKey, amount: number): Promise<TxWithSigners>;
    createMintAndFundATA(decimals: number, amount: number, isAssociated?: boolean): Promise<{
        mint: PublicKey;
        tokenAcc: PublicKey;
        txSig: string;
    }>;
    createTokenAccountTx(mint: PublicKey, authority: PublicKey, payer: PublicKey, isAssociated: boolean): Promise<[PublicKey, TxWithSigners]>;
    sendAndConfirmTx(tx: TxWithSigners): Promise<string>;
    sendTxWithWallet(tx: TxWithSigners): Promise<string>;
    mergeTxs(txs: TxWithSigners[]): Promise<TxWithSigners>;
    sendAndConfirmTxsSet(txs: TxWithSigners[]): Promise<string[]>;
    sendTxsSetWithWallet(txs: TxWithSigners[]): Promise<string[]>;
}
