<template>
  <div class="container" style="margin: auto; top: 200px">
    <div class="content">
      <div style="text-align: center; font-size: 16px">
        Test<br />
        Click to Burn Token (Buy a Ticket)<br />
        Ticket Solded: {{sold}} <div style="width: 20px"></div>
        Ticket Supply: {{supply}} <div style="width: 20px"></div>
        Ticket Price: {{price}} <div style="width: 20px"></div>
      </div>

      <div class="moreInfo" @click="buyTicket()">↓</div>
    </div>
  </div>

  <ConnectWalletDialog :show='showConnectWalletDialog' @cancel='showConnectWalletDialog = false'
                       @connect='connectedWallet'/>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, onMounted, watch } from "vue";
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { FRANK_WORKS_PROG_ID, FrankWorksClient, toBN, findFrankRaffleTicketPDA } from '@/frank-work';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import ConnectWalletDialog from '@/components/ConnectWalletDialog.vue'
import { Connection, Keypair, PublicKey } from '@solana/web3.js';


export default defineComponent({
  components: {
    ConnectWalletDialog
  },
  setup(props:any, ctx:any) {
    const data = reactive({
      showConnectWalletDialog: false,
      sold: 0,
      supply: 0,
      price: 0,
    })

    const {wallet, getWallet, setWallet} = useWallet();
    const {getConnection, cluster} = useCluster();
    let client:any

    onMounted(async () => {
      // initWorkspace()
      data.showConnectWalletDialog = true
    });

    watch([wallet], async () => {
      await findRaffleAcc()
    });

    const findRaffleAcc = async () => {
      let res = await findFrankRaffleTicketPDA()
      console.log("PDA: ", res)
      const result = await (await getClient()).fetchRaffleAcc(res[0])
      console.log("rafflePDA: ", result)
      data.price = result.ticketPrice
      data.sold = result.sold
      data.supply = result.totalSupply
    }

    const connectedWallet = async () => {
      if (!getWallet()) {
        data.showConnectWalletDialog = true;
        return;
      }
      data.showConnectWalletDialog = false
    }

    const getClient = async () => {
      if (client == null)
        client = await initClient(getConnection(), getWallet()!);
      return client;
    }

    const buyTicket = async () => {
      if (!getWallet()) {
        data.showConnectWalletDialog = true;
        return;
      }

      try {
        const owner = getWallet()!.publicKey;

        const result = await (await getClient()).buyTicket(owner, new PublicKey("CdjiQaAUqbz6m4hpf1SDrfJ78Mr2twSHFLETSywsXHW7"), toBN(1));
        console.log(JSON.stringify(result));
        return result.txSig
      } catch (e) {
        console.log(e)
      } finally {
        await findRaffleAcc()
      }
    }

    const initClient = async (conn: Connection, wallet: SignerWalletAdapter) => {
      const idl = await (await fetch('idl.json')).json();
      return new FrankWorksClient(conn, wallet as any, idl, FRANK_WORKS_PROG_ID);
    }


    const dataRef = toRefs(data);
    return {
      ...dataRef,

      buyTicket,
      connectedWallet
    };
  },
});
</script>

<style scoped lang="scss">
@media screen and (max-width: 720px) {
  .icon_link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    img {
      width: 55px !important;
    }
  }
  .qa_concat {
  }
  .moveImage {
    width: 70% !important;
    height: 15% !important;
    top: 25% !important;
  }
  .content {
    width: 70% !important;
    height: 15% !important;
    bottom: 25% !important;
  }

  .galley {
  }
  .qa {
    padding: 0 !important;
    .item_list {
      width: 100% !important;
    }
  }
}
.container {
  width: 100%;
  //background-color: #ffffff;
  background: linear-gradient(-45deg, #000, #fff, #999999, #fff);
  animation: gradient 5s ease infinite;
  background-size: 500% 500%;
  position: relative;

  .icon_link {
    z-index: 999;
    position: absolute;
    left: 20px;
    > div {
      margin: 20px 10px;
    }
    img {
      width: 95px;
      transition: all 1s;
    }
    img:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
  .qa_concat {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 10%;
    width: auto;
    height: 30px;
    background-color: #000000;
    border-radius: 20px;
    color: #ffffff;
    padding: 0 20px;
    cursor: pointer;
  }
  .moveImage {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 25%;
    animation: moveView 2.5s 1s;
    animation-fill-mode: forwards;
    left: -100%;
    img {
      width: 100%;
    }
  }
  .moveImage2 {
    animation: moveView2 2.5s 1.5s;
    animation-fill-mode: forwards;
  }
  .moveImage3 {
    animation: moveView3 3s 2s;
    animation-fill-mode: forwards;
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    transform: translateX(-50%);
    width: 30%;
    //height: 25%;
    background-color: #e8e8e8;
    padding: 10px;
    left: 50%;
    bottom: 2%;
    border: 5px #000000 solid;
    border-radius: 15px;
    .moreInfo {
      cursor: pointer;
      font-size: 24px;
    }
  }
  .back {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .item {
      width: 80px;
      height: 80px;
      margin: 5px;
    }
  }
}

.galley {
  background-color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    margin: 20px 0;
  }
  .title {
    color: white;
  }
  .image {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .contain_btn {
      position: relative;
      width: 70%;
      img {
        width: 100%;
      }
      .btn {
        position: absolute;
        bottom: 35%;
        width: 15%;
        right: 28%;
        cursor: pointer;
        transition: all 1s;
      }
      .btn:hover {
        transform: scale(1.2);
      }
      .btn2 {
        position: absolute;
        width: 18%;
        bottom: 10%;
        right: 33%;
        animation: pi 2.5s 1s;
        animation-fill-mode: forwards;
        -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .btn2:hover {
        cursor: pointer;
      }
    }
  }
  .road {
    text-align: center;
    color: white;
    font-size: 24px;
  }
  .tips {
    text-align: center;
    color: white;
    margin: 10px 0;
  }
}

.qa {
  background-color: #b5b5b5;
  width: 100%;
  padding: 100px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .item_list {
    width: 70%;
  }
}

@keyframes moveView {
  from {
    opacity: 0;
    //background-color: #ffffff;
    left: -100%;
    top: 80%;
    transform: translate(-50%, -50%) scale(3);
  }
  to {
    opacity: 1;
    //background-color: #ead4ab;
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes moveView2 {
  from {
    opacity: 0;
    //background-color: #ffffff;
    left: -100%;
    top: 80%;
    transform: translate(-50%, -50%) scale(3);
  }
  to {
    opacity: 1;
    //background-color: #ead4ab;
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes moveView3 {
  50% {
    opacity: 0;
    //background-color: #ead4ab;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 1;
    //background-color: #ead4ab;
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%);
  }
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes pi {
  from {
    opacity: 0;
    bottom: 10%;
    right: 33%;
    transform: scale(0.1);
  }
  to {
    opacity: 1;
    bottom: 19%;
    right: 20%;
    transform: scale(1);
  }
}

.flex-row-space-around {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="scss">
.ant-collapse {
  border: none;
  background-color: #b5b5b5;
  .ant-collapse-item {
    border-radius: 10px !important;
    background-color: #283042;
    border-bottom: 0px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    height: auto;
    .ant-collapse-header {
      font-size: 22px;
      height: 80px;
      color: white;
    }
    .ant-collapse-content {
      //box-shadow: -5px 0 10px -5px yellow;
      border-left: 7px solid #fff;
      width: 98%;
      color: white;
      margin: 5px auto;
      border-top: 0px;
      background-color: #212838;
    }
  }
}
</style>
