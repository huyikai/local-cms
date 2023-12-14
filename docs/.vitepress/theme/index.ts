import 'vitepress/dist/client/theme-default/styles/vars.css';
import 'vitepress/dist/client/theme-default/styles/base.css';
import 'vitepress/dist/client/theme-default/styles/utils.css';
import 'vitepress/dist/client/theme-default/styles/components/custom-block.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-doc.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-sponsor.css';

import Home from './home.vue';
import Layout from '@huyikai/vitepress-helper/theme/Theme.vue';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';

const theme = {
  Layout,
  enhanceApp: ({ app }: any) => {
    app.component('Home', Home);
    app.component('Badge', VPBadge);
  }
};
export default theme;
