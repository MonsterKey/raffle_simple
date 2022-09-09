"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRANK_WORKS_PROG_ID = exports.DTH_WORKS_PROG_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
__exportStar(require("./gem-common"), exports);
__exportStar(require("./frank-works"), exports);
exports.FRANK_WORKS_PROG_ID = new web3_js_1.PublicKey('JBmbzzuur92hmKRoDegWpaL6tmLcHsaJTVzRwv68S9mZ');
