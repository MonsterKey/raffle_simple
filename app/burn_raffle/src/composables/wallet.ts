import { computed, readonly, ref, shallowRef, Ref } from 'vue';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  SolletWalletAdapter,
  SlopeWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { SignerWalletAdapter, Adapter, WalletName } from '@solana/wallet-adapter-base';

export type Wallet = Adapter;

const walletClass = ref<Wallet | null>(null);
const walletAdapter = ref<Ref<SignerWalletAdapter | null>>(shallowRef(null));

export default function useWallet() {

  const walletMapping = {
    Phantom: new PhantomWalletAdapter(),
    Solflare: new SolflareWalletAdapter(),
    Sollet: new SolletWalletAdapter(),
    Ledger: new LedgerWalletAdapter(),
    Slope: new SlopeWalletAdapter()
  };

  const isConnected = computed(() => !!walletAdapter.value);

  const getWallet = (): SignerWalletAdapter | null => {
    if (walletAdapter.value) {
      return walletAdapter.value;
    }
    return null;
  };

  const setWallet = (newWallet: string | null, network: string) => {
    if (!newWallet) {
      walletClass.value = null;
      walletAdapter.value = null; // don't think I need shallowRef here
      return;
    }

    const gottenWallet = (walletMapping as any)[newWallet!];
    const connectedAdapter = gottenWallet;
    connectedAdapter
        .connect()
        .then(() => {
          // only set the two if the call succeeds
          walletClass.value = gottenWallet;
          walletAdapter.value = connectedAdapter;
          localStorage.setItem('wallet-name', newWallet);
        })
        .catch(() => {
          console.log('failed to connect to wallet, try again');
          walletClass.value = null;
          walletAdapter.value = null;
        });
  };

  const getWalletName = (): WalletName | null => {
    if (walletClass.value) {
      return walletClass.value.name;
    }
    return null;
  };

  const getWalletAddress = (): PublicKey | null => {
    if (walletAdapter.value) {
      return walletAdapter.value.publicKey;
    }
    return null;
  };

  return {
    wallet: readonly(walletAdapter),
    isConnected,
    getWallet,
    setWallet,
    getWalletName,
    getWalletAddress,
    walletMapping,
  };
}
