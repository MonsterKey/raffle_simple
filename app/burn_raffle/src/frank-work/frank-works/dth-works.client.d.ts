import * as anchor from '@project-serum/anchor';
import {BN, Idl, IdlTypes} from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AccountUtils } from '../gem-common';
import { FrankWorks } from '../types/frank_works';
export declare class FrankWorksClient extends AccountUtils {
  wallet: anchor.Wallet;
  provider: anchor.Provider;
  frankProgram: anchor.Program<FrankWorks>;
  constructor(
    conn: Connection,
    wallet: anchor.Wallet,
    idl?: Idl,
    programId?: PublicKey
  );
  setProvider(): void;
  setFrankProgram(idl?: Idl, programId?: PublicKey): void;

  fetchRaffleAcc(
    raffle: PublicKey
  ): Promise<
    import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<
      {
        name: "raffle";
        type: {
          kind: "struct";
          fields: [
            { name: "endTimestamp"; type: "i64" },
            { name: "ticketPrice"; type: "u64" },
            { name: "totalSupply"; type: "u64" },
            { name: "sold"; type: "u64" }
          ];
        };
      },
      IdlTypes<FrankWorks>
    >
  >;
  buyTicket(
    owner: PublicKey,
    mint: PublicKey,
    amount: BN
  ): Promise<{
    txSig: any;
  }>;
}
