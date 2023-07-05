import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import 'ant-design-vue/es/message/style/css';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
