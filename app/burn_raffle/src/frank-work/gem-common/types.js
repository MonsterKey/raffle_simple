"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyPKsAndBNs = exports.isPk = exports.isKp = exports.stringToBytes = exports.toBN = void 0;
const anchor_1 = require("@project-serum/anchor");
function toBN(i) {
    if (typeof i == 'number') {
        return new anchor_1.BN(i);
    }
    else if (i instanceof anchor_1.BN) {
        return i;
    }
    else if (parseType(i) === 'array') {
        const bnArray = [];
        for (const item in i) {
            bnArray.push(toBN(item));
        }
        return bnArray;
    }
    else if (parseType(i) === 'object') {
        const bnObj = {};
        for (const field in i) {
            // @ts-ignore
            bnObj[field] = toBN(i[field]);
        }
        return bnObj;
    }
    return i;
}
exports.toBN = toBN;
function stringToBytes(str) {
    const myBuffer = [];
    const buffer = new Buffer(str);
    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
}
exports.stringToBytes = stringToBytes;
function isKp(toCheck) {
    return typeof toCheck.publicKey !== 'undefined';
}
exports.isKp = isKp;
function isPk(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj['toBase58'] === 'function');
}
exports.isPk = isPk;
function stringifyPKsAndBNs(i) {
    if (isPk(i)) {
        return i.toBase58();
    }
    else if (i instanceof anchor_1.BN) {
        return i.toString();
    }
    else if (parseType(i) === 'array') {
        return stringifyPKsAndBNInArray(i);
    }
    else if (parseType(i) === 'object') {
        return stringifyPKsAndBNsInObject(i);
    }
    return i;
}
exports.stringifyPKsAndBNs = stringifyPKsAndBNs;
function stringifyPKsAndBNsInObject(o) {
    const newO = Object.assign({}, o);
    for (const [k, v] of Object.entries(newO)) {
        if (isPk(v)) {
            newO[k] = v.toBase58();
        }
        else if (v instanceof anchor_1.BN) {
            newO[k] = v.toString();
        }
        else if (parseType(v) === 'array') {
            newO[k] = stringifyPKsAndBNInArray(v);
        }
        else if (parseType(v) === 'object') {
            newO[k] = stringifyPKsAndBNsInObject(v);
        }
        else {
            newO[k] = v;
        }
    }
    return newO;
}
function stringifyPKsAndBNInArray(a) {
    const newA = [];
    for (const i of a) {
        if (isPk(i)) {
            newA.push(i.toBase58());
        }
        else if (i instanceof anchor_1.BN) {
            newA.push(i.toString());
        }
        else if (parseType(i) === 'array') {
            newA.push(stringifyPKsAndBNInArray(i));
        }
        else if (parseType(i) === 'object') {
            newA.push(stringifyPKsAndBNs(i));
        }
        else {
            newA.push(i);
        }
    }
    return newA;
}
function parseType(v) {
    if (v === null || v === undefined) {
        return 'null';
    }
    if (typeof v === 'object') {
        if (v instanceof Array) {
            return 'array';
        }
        if (v instanceof Date) {
            return 'date';
        }
        return 'object';
    }
    return typeof v;
}
