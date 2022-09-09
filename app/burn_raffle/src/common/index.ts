import { AnchorProvider, BN, Program, utils, web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useAnchorWallet } from 'solana-wallets-vue';
import {  Connection } from '@solana/web3.js';

const idl = require('@/idl.json');
const utf8 = utils.bytes.utf8
const anchorWallet = useAnchorWallet()

export async function sendTransaction() {
    if (!anchorWallet) {
        return;
    }

    const network = "https://metaplex.devnet.rpcpool.com";
    const connection = new Connection(network, "processed");

    // @ts-ignore
    const provider = new AnchorProvider(connection, anchorWallet.value, {"preflightCommitment": "processed"});
    const program = new Program(idl, "JBmbzzuur92hmKRoDegWpaL6tmLcHsaJTVzRwv68S9mZ", provider);
    console.log("program: ", program)
    try {

        const [rafflePDA] = await web3.PublicKey.findProgramAddress([utf8.encode('frank-raffle')], program.programId)
        let myWallet = anchorWallet.value?.publicKey

        console.log("rafflePDA", rafflePDA);
        let mint = new web3.PublicKey("CdjiQaAUqbz6m4hpf1SDrfJ78Mr2twSHFLETSywsXHW7")
        // @ts-ignore
        const tokenAccount = await getAssociatedTokenAddress(mint, myWallet)
        const trans = await program.methods.burnToken(new BN(1)).accounts({
            raffle: rafflePDA,
            tokenProgram: TOKEN_PROGRAM_ID,
            mint: mint,
            tokenAccount: tokenAccount,
            authority: myWallet,
        }).rpc();

        console.log("trans", trans);

        const escrowAccount = await program.account.escrowAccount.fetch(rafflePDA);
        console.log("escrowAccount", escrowAccount);
    } catch (err) {
        console.log(err);
    }
}