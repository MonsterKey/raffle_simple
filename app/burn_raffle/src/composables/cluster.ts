import { readonly, ref } from 'vue';
import { Commitment, Connection } from '@solana/web3.js';

export enum Cluster {
  Mainnet = 'mainnet',
  Devnet = 'devnet',
  Testnet = 'testnet',
}

const clusterURLMapping = {
  mainnet: process.env.VUE_APP_MAINNET_URL || 'https://little-black-dust.solana-mainnet.quiknode.pro/b8e2c8d9da6845f92815de5f0d298259d979391b/',
  devnet: process.env.VUE_APP_DEVNET_URL || 'https://api.devnet.solana.com',
  testnet: process.env.VUE_APP_TESTNET_URL || 'https://api.testnet.solana.com',
};

const cluster = ref<Cluster>(Cluster.Devnet);

export default function useCluster() {
  const getClusterURL = (): string => clusterURLMapping[cluster.value];

  const getConnection = (committment?: Commitment): Connection =>
    new Connection(getClusterURL(), committment ?? 'processed');

  const setCluster = (newCluster: Cluster) => {
    cluster.value = newCluster;
    // capping at 20 chars due to security (not to expose the token)
    console.log(
      `Cluster updated,  now ${newCluster} (${getClusterURL().substr(0, 20)})`
    );
  };

  return {
    cluster: readonly(cluster),
    getClusterURL,
    getConnection,
    setCluster,
  };
}
