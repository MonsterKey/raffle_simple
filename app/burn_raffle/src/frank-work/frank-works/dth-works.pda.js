"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFrankRaffleTicketPDA = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("../index");
const findFrankRaffleTicketPDA = () => {
    return web3_js_1.PublicKey.findProgramAddress([Buffer.from('frank-raffle')], index_1.FRANK_WORKS_PROG_ID);
};
exports.findFrankRaffleTicketPDA = findFrankRaffleTicketPDA;
