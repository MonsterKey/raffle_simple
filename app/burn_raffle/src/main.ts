import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router'
import 'solana-wallets-vue/styles.css';


createApp(App)
    .use(router)
    .mount('#app');

