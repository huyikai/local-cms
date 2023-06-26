import Layout from './Theme.vue';
import 'vitepress/dist/client/theme-default/styles/fonts.css';
import 'vitepress/dist/client/theme-default/styles/vars.css';
import 'vitepress/dist/client/theme-default/styles/base.css';
import 'vitepress/dist/client/theme-default/styles/utils.css';
import 'vitepress/dist/client/theme-default/styles/components/custom-block.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-doc.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-sponsor.css';
import './styles/style.scss'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';
const theme = {
    Layout,
    NotFound,
    enhanceApp: async ({ app }) => {
        // app is the Vue 3 app instance from `createApp()`. router is VitePress'
        // custom router. `siteData`` is a `ref`` of current site-level metadata.
        app.component('Badge', VPBadge);
      }
};
export default theme;