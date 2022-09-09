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
exports.NodeWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const account_utils_1 = require("./account-utils");
const spl_token_1 = require("@solana/spl-token");
class NodeWallet extends account_utils_1.AccountUtils {
    // @ts-ignore
    constructor(conn, wallet) {
        super(conn);
        this.wallet = wallet;
    }
    createFundedWallet(lamports) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = web3_js_1.Keypair.generate();
            const tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                fromPubkey: this.wallet.publicKey,
                toPubkey: wallet.publicKey,
                lamports,
            }));
            yield (0, web3_js_1.sendAndConfirmTransaction)(this.conn, tx, [this.wallet.payer]);
            return wallet;
        });
    }
    // --------------------------------------- Mint
    createMint(decimals, authority = this.wallet.payer) {
        return __awaiter(this, void 0, void 0, function* () {
            return spl_token_1.Token.createMint(this.conn, authority, authority.publicKey, authority.publicKey, decimals, spl_token_1.TOKEN_PROGRAM_ID);
        });
    }
    createNativeMint() {
        return __awaiter(this, void 0, void 0, function* () {
            return new spl_token_1.Token(this.conn, spl_token_1.NATIVE_MINT, spl_token_1.TOKEN_PROGRAM_ID, this.wallet.payer);
        });
    }
    createAndFundATA(token, owner, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.publicKey == spl_token_1.NATIVE_MINT) {
                const account = yield spl_token_1.Token.createWrappedNativeAccount(this.conn, spl_token_1.TOKEN_PROGRAM_ID, owner, this.wallet.payer, amount.toNumber());
                return account;
            }
            else {
                const account = yield token.createAssociatedTokenAccount(owner);
                if (amount.toNumber() > 0) {
                    yield token.mintTo(account, this.wallet.payer, [], amount.toNumber());
                }
                return account;
            }
        });
    }
    createMintAndFundATA(owner, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.createMint(0);
            const tokenAcc = yield this.createAndFundATA(token, owner, amount);
            return {
                tokenMint: token.publicKey,
                tokenAcc,
                owner,
                token,
            };
        });
    }
}
exports.NodeWallet = NodeWallet;
