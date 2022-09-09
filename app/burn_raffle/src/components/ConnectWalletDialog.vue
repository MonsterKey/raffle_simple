<template>
  <div class="modal-backdrop" v-if="show">
    <div class="modal">
      <div class="modal-header flex-row flex-align-center">
        <div class="text-center flex-1 modal-header-title">Connect Wallet</div>
        <button @click="cancel" class="modal-header-close">
          <!--          <svg width="16" height="16">-->
          <!--            <path fill='#FFF'-->
          <!--                  d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"/>-->
          <!--          </svg>-->
          <img src="../images/cancel.svg" style="width: 15px;height: 16px">
        </button>
      </div>
      <div class="modal-body flex-colum">
        <button v-for="(value, key) in walletMapping" :key="key" @click="connect(key)"
                class="flex-row flex-align-center modal-wallet-button">
          <div class="flex-1 modal-wallet-name">{{ value.name }}</div>
          <img :src="value.icon" class="modal-wallet-icon"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, watch} from "vue";
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: any, content: any) {
    const {wallet, getWallet, setWallet, walletMapping} = useWallet();
    const {cluster, getClusterURL, getConnection} = useCluster();

    const data = reactive({
      show: props.show
    });

    watch([wallet], async () => {
      if (wallet) {
        content.emit('connect');
      }
    });

    const cancel = () => {
      content.emit('cancel');
    }

    const connect = (name: string) => {
      connectSolWallet(name);
    }

    const connectSolWallet = (name: string) => {
      setWallet(name, getClusterURL());
    };

    const dataRef = toRefs(data);
    return {
      cancel,
      connect,
      walletMapping,
      ...dataRef
    }
  },
}
</script>

<style scoped>

.modal {
  background-color: #1e293b;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 375px;
}

.modal-header {
  padding: 15px;
  position: relative;
  border-bottom: 2px solid #FFF;
  background: #ecdca9;
  color: #000000;
}

.modal-header-title {
  text-align: center;
  font-size: 24px;
}

.modal-header-close {
  position: absolute;
  right: 15px;
  color: #1A1D27;
}

.modal-body {
  position: relative;
  padding: 20px 20px;
  color: #000000;
  background: #ecdca9;
}

.modal-body button:hover {
  background-color: #406184;
  border-radius: 20px;
}

.modal-body button:hover .modal-wallet-name {
  color: #FFFFFF;
}

.modal-wallet-button {
  color: #000000;
  height: 44px;
}

.modal-wallet-name {
  text-align: left;
  font-size: 18px;
  color: #406184;
}

.modal-wallet-icon {
  width: 20px;
  height: 20px;
}

button {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
}

</style>
