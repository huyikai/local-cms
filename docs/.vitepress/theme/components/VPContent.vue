<script setup lang="ts">
import { useRoute, useData } from 'vitepress';
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js';
import VPPage from 'vitepress/dist/client/theme-default/components/VPPage.vue';
import VPHome from 'vitepress/dist/client/theme-default/components/VPHome.vue';
import VPDoc from 'vitepress/dist/client/theme-default/components/VPDoc.vue';
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'

const route = useRoute();
const { frontmatter } = useData();
const { hasSidebar } = useSidebar();


</script>

<template>
    <div
        class="VPContent"
        id="VPContent"
        :class="{
            'has-sidebar': hasSidebar,
            'is-home': frontmatter.layout === 'home'
        }"
    >
        <NotFound v-if="route.component === NotFound" />

        <VPPage v-else-if="frontmatter.layout === 'page'" />

        <VPHome v-else-if="frontmatter.layout === 'home'">
            <template #home-hero-before>
                <slot name="home-hero-before" />
            </template>
            <template #home-hero-after>
                <slot name="home-hero-after" />
            </template>
            <template #home-features-before>
                <slot name="home-features-before" />
            </template>
            <template #home-features-after>
                <slot name="home-features-after" />
            </template>
        </VPHome>
        <slot name="custom-home" v-else-if="frontmatter.layout === 'custom'"></slot>
        <VPDoc v-else>
            <template #doc-footer-before>
                <slot name="doc-footer-before" />
            </template>
            <template #doc-before>
                <slot name="doc-before" />
            </template>
            <template #doc-after>
                <slot name="doc-after" />
            </template>

            <template #aside-top>
                <slot name="aside-top" />
            </template>
            <template #aside-outline-before>
                <slot name="aside-outline-before" />
            </template>
            <template #aside-outline-after>
                <slot name="aside-outline-after" />
            </template>
            <template #aside-ads-before>
                <slot name="aside-ads-before" />
            </template>
            <template #aside-ads-after>
                <slot name="aside-ads-after" />
            </template>
            <template #aside-bottom>
                <slot name="aside-bottom" />
            </template>
        </VPDoc>
    </div>
</template>

<style scoped>
.VPContent {
    flex-grow: 1;
    flex-shrink: 0;
    margin: 0 auto;
    width: 100%;
}

.VPContent.is-home {
    width: 100%;
    max-width: 100%;
}

@media (min-width: 960px) {
    .VPContent {
        padding-top: var(--vp-nav-height);
    }

    .VPContent.has-sidebar {
        margin: 0;
        padding-left: var(--vp-sidebar-width);
    }
}

@media (min-width: 1440px) {
    .VPContent.has-sidebar {
        padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
        padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
    }
}
</style>
