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
exports.AccountUtils = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
class AccountUtils {
    constructor(conn) {
        this.conn = conn;
    }
    // --------------------------------------- PDA
    findProgramAddress(programId, seeds) {
        return __awaiter(this, void 0, void 0, function* () {
            const seed_bytes = seeds.map((s) => {
                if (typeof s == 'string') {
                    return Buffer.from(s);
                }
                else if ('toBytes' in s) {
                    return s.toBytes();
                }
                else {
                    return s;
                }
            });
            return yield web3_js_1.PublicKey.findProgramAddress(seed_bytes, programId);
        });
    }
    // --------------------------------------- Normal account
    getBalance(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.conn.getBalance(publicKey);
        });
    }
    // --------------------------------------- Token account
    deserializeToken(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            //doesn't matter which keypair goes here, we just need some key for instantiation
            const throwawayKeypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from([
                208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199,
                242, 120, 4, 78, 75, 19, 227, 13, 215, 184, 108, 226, 53, 111, 149, 179,
                84, 137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242,
                57, 158, 226, 207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249,
                157, 62, 80,
            ]));
            return new spl_token_1.Token(this.conn, mint, spl_token_1.TOKEN_PROGRAM_ID, throwawayKeypair);
        });
    }
    deserializeTokenMint(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.deserializeToken(mint);
            return t.getMintInfo();
        });
    }
    deserializeTokenAccount(mint, tokenAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.deserializeToken(mint);
            return token.getAccountInfo(tokenAccount);
        });
    }
    findATA(mint, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, owner);
        });
    }
}
exports.AccountUtils = AccountUtils;
