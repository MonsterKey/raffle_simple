import { BN } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
export declare type Numerical = BN | number;
export declare function toBN(i: any): any;
export declare function stringToBytes(str: string): any[];
export declare function isKp(toCheck: PublicKey | Keypair): boolean;
export declare function isPk(obj: any): boolean;
export declare function stringifyPKsAndBNs(i: any): any;
