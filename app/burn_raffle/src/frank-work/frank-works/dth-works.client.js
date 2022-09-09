"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FrankWorksClient = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const gem_common_1 = require("../gem-common");
const frank_works_1 = require("../frank-works");
class FrankWorksClient extends gem_common_1.AccountUtils {
    constructor(conn, 
    // @ts-ignore
    wallet, idl, programId) {
        super(conn);
        this.wallet = wallet;
        this.setProvider();
        this.setFrankProgram(idl, programId);
    }
    setProvider() {
        this.provider = new anchor_1.Provider(this.conn, this.wallet, anchor_1.Provider.defaultOptions());
        anchor.setProvider(this.provider);
    }
    setFrankProgram(idl, programId) {
        //instantiating program depends on the environment
        if (idl && programId) {
            //means running in prod
            this.frankProgram = new anchor.Program(idl, programId, this.provider);
        }
        else {
            //means running inside test suite
            // @ts-ignore
            this.frankProgram = anchor.workspace.FrankWorks;
        }
    }
    // --------------------------------------- fetch deserialized accounts
    fetchRaffleAcc(raffle) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.frankProgram.account.raffle.fetch(raffle);
        });
    }
    // --------------------------------------- execute ixs
    buyTicket(owner, mint, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenAccount = yield this.findATA(mint, owner);
            const [rafflePDA, ticketBump] = yield (0, frank_works_1.findFrankRaffleTicketPDA)();
            console.log(`burn ${amount} HAIRs from ${owner.toBase58()}`);
            const txSig = yield this.frankProgram.methods.burnToken(amount).accounts({
                raffle: rafflePDA,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                mint: mint,
                tokenAccount: tokenAccount,
                authority: owner,
            }).rpc();
            return {
                txSig,
            };
        });
    }
}
exports.FrankWorksClient = FrankWorksClient;
