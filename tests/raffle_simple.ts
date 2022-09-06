import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { RaffleSimple } from "../target/types/raffle_simple";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

describe("raffle_simple", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.RaffleSimple as Program<RaffleSimple>;

  // let secretKey = Uint8Array.from([67,248,101,169,58,10,223,102,135,100,191,213,27,126,112,41,34,143,55,202,30,167,171,14,159,78,87,115,85,241,155,61,10,170,38,29,46,18,166,98,50,64,80,45,206,166,44,129,135,4,93,70,191,61,77,220,168,204,135,10,255,9,136,78]);
  // const idAccount = anchor.web3.Keypair.fromSecretKey(secretKey);

  it("Is init!", async () => {

    const [rafflePDA] = await web3.PublicKey.findProgramAddress([
      utf8.encode('frank-raffle')
    ],
      program.programId,
    )

    console.log(provider.publicKey.toString());

    // Add your test here.
    // await program.methods.initRaffle(new anchor.BN(1662455998), new anchor.BN(100), new anchor.BN(1500)).accounts({
    //   raffle: rafflePDA,
    //   creator: provider.wallet.publicKey,
    //   systemProgram: web3.SystemProgram.programId,
    // }).rpc();

    const account = await program.account.raffle.fetch(rafflePDA);
    console.log("raffle init config: ");
    console.log(`supply: ${account.totalSupply.toString()}, 
      end time:${account.endTimestamp.toString()}, 
      price: ${account.ticketPrice.toString()},
      sold: ${account.sold.toString()}`
    );
  });

  it("Is update!", async () => {

    const [rafflePDA] = await web3.PublicKey.findProgramAddress([
      utf8.encode('frank-raffle')
    ],
      program.programId,
    )
    // Add your test here.
    await program.methods.updateRaffle(new anchor.BN(1662455998), new anchor.BN(500), new anchor.BN(500), new anchor.BN(0)).accounts({
      raffle: rafflePDA,
      authority: provider.wallet.publicKey,
    }).rpc();

    const account = await program.account.raffle.fetch(rafflePDA);
    console.log("raffle init config: ");
    console.log(`supply: ${account.totalSupply.toString()}, 
      end time:${account.endTimestamp.toString()}, 
      price: ${account.ticketPrice.toString()},
      sold: ${account.sold.toString()}`
    );
  });

  it("Is read!", async () => {

    const [rafflePDA] = await web3.PublicKey.findProgramAddress([
      utf8.encode('frank-raffle')
    ],
      program.programId,
    )
    // Add your test here.
    await program.methods.readRaffle().accounts({
      raffle: rafflePDA,
    }).rpc();
  });


  it("Burn token", async () => {
    const [rafflePDA] = await web3.PublicKey.findProgramAddress([
      utf8.encode('frank-raffle')
    ],
      program.programId,
    )

    const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
    console.log("myWallet: ", myWallet.toString());

    let mint = new anchor.web3.PublicKey("CdjiQaAUqbz6m4hpf1SDrfJ78Mr2twSHFLETSywsXHW7")
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      myWallet
    )

    // Executes our transfer smart contract 
    await program.methods.burnToken(new anchor.BN(1)).accounts({
      raffle: rafflePDA,
      tokenProgram: TOKEN_PROGRAM_ID,
      mint: mint,
      tokenAccount: tokenAccount,
      authority: myWallet,
    }).rpc();
  })

});
