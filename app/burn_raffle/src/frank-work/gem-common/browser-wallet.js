"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const account_utils_1 = require("./account-utils");
class BrowserWallet extends account_utils_1.AccountUtils {
    constructor(conn, wallet) {
        super(conn);
        this.wallet = wallet;
    }
    // --------------------------------------- Mint
    createMintTx(authority, payer, decimals) {
        return __awaiter(this, void 0, void 0, function* () {
            const mintAccount = web3_js_1.Keypair.generate();
            const balanceNeeded = yield spl_token_1.Token.getMinBalanceRentForExemptMint(this.conn);
            const tx = new web3_js_1.Transaction({
                feePayer: payer,
                recentBlockhash: (yield this.conn.getRecentBlockhash()).blockhash,
            });
            tx.add(web3_js_1.SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: mintAccount.publicKey,
                lamports: balanceNeeded,
                space: spl_token_1.MintLayout.span,
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }), spl_token_1.Token.createInitMintInstruction(spl_token_1.TOKEN_PROGRAM_ID, mintAccount.publicKey, decimals, authority, authority));
            return [mintAccount.publicKey, { tx, signers: [mintAccount] }];
        });
    }
    mintToTx(mint, dest, authority, payer, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = new web3_js_1.Transaction({
                feePayer: payer,
                recentBlockhash: (yield this.conn.getRecentBlockhash()).blockhash,
            });
            tx.add(spl_token_1.Token.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, dest, authority, [], amount));
            return { tx, signers: [] };
        });
    }
    // --------------------------------------- Token Acc / ATA
    createMintAndFundATA(decimals, amount, isAssociated = true) {
        return __awaiter(this, void 0, void 0, function* () {
            //create mint
            const [mint, newMintTx] = yield this.createMintTx(this.wallet.publicKey, this.wallet.publicKey, decimals);
            //create token ATA
            const [tokenAcc, newTokenAccTx] = yield this.createTokenAccountTx(mint, this.wallet.publicKey, this.wallet.publicKey, isAssociated);
            //fund ATA
            const mintToTx = yield this.mintToTx(mint, tokenAcc, this.wallet.publicKey, this.wallet.publicKey, amount);
            const tx = yield this.mergeTxs([newMintTx, newTokenAccTx, mintToTx]);
            const txSig = yield this.sendTxWithWallet(tx);
            return { mint, tokenAcc, txSig };
        });
    }
    createTokenAccountTx(mint, authority, payer, isAssociated) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAccount = web3_js_1.Keypair.generate();
            let balanceNeeded = yield spl_token_1.Token.getMinBalanceRentForExemptAccount(this.conn);
            const tx = new web3_js_1.Transaction({
                feePayer: payer,
                recentBlockhash: (yield this.conn.getRecentBlockhash()).blockhash,
            });
            if (isAssociated) {
                const associatedAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, authority);
                tx.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, associatedAddress, authority, payer));
                return [associatedAddress, { tx, signers: [] }];
            }
            tx.add(web3_js_1.SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: newAccount.publicKey,
                lamports: balanceNeeded,
                space: spl_token_1.AccountLayout.span,
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }));
            tx.add(spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, newAccount.publicKey, authority));
            return [newAccount.publicKey, { tx, signers: [newAccount] }];
        });
    }
    // --------------------------------------- Tx
    // ----------------- single
    sendAndConfirmTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            //these need to be done manually for a raw tx
            tx.tx.recentBlockhash = (yield this.conn.getRecentBlockhash()).blockhash;
            tx.tx.feePayer = this.wallet.publicKey;
            tx.signers.forEach((s) => {
                tx.tx.partialSign(s);
            });
            return (0, web3_js_1.sendAndConfirmRawTransaction)(this.conn, tx.tx.serialize());
        });
    }
    sendTxWithWallet(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.signers.forEach((s) => {
                tx.tx.partialSign(s);
            });
            return this.wallet.sendTransaction(tx.tx, this.conn);
        });
    }
    // ----------------- multiple
    mergeTxs(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalTx = new web3_js_1.Transaction({
                feePayer: this.wallet.publicKey,
                recentBlockhash: (yield this.conn.getRecentBlockhash()).blockhash,
            });
            let finalSigners = [];
            txs.forEach((t) => {
                finalTx.instructions.push(...t.tx.instructions);
                finalTx.signatures.push(...t.tx.signatures);
                finalSigners.push(...t.signers);
            });
            //dedup
            finalTx.signatures = [...new Set(finalTx.signatures)];
            finalSigners = [...new Set(finalSigners)];
            return { tx: finalTx, signers: finalSigners };
        });
    }
    sendAndConfirmTxsSet(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`attempting to send ${txs.length} transactions`);
            const signatures = yield Promise.all(txs.map((t) => this.sendAndConfirmTx(t)));
            const result = yield Promise.all(signatures.map((s) => this.conn.confirmTransaction(s)));
            const failedTx = result.filter((r) => r.value.err != null);
            if (failedTx.length > 0) {
                throw new Error(`Transactions failed: ${failedTx}`);
            }
            else {
                console.log('All transactions succeeded:', signatures);
            }
            return signatures;
        });
    }
    // (!) does NOT merge - will fail if one tx depends on another
    sendTxsSetWithWallet(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(txs.map((tx) => this.sendTxWithWallet(tx)));
        });
    }
}
exports.BrowserWallet = BrowserWallet;
