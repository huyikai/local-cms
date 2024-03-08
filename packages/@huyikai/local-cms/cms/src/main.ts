import 'vitepress/dist/client/theme-default/styles/vars.css';
import 'vitepress/dist/client/theme-default/styles/base.css';
import 'vitepress/dist/client/theme-default/styles/utils.css';
import 'vitepress/dist/client/theme-default/styles/components/custom-block.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-doc.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-sponsor.css';
import 'vitepress/dist/client/theme-default/styles/fonts.css';

import App from './App.vue';
import { createApp } from 'vue';
import pinia from './stores';
import router from './router';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
