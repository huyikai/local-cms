<script setup lang="ts">
import VPDoc from 'vitepress/dist/client/theme-default/components/VPDoc.vue';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
</script>
<template>
    <div class="hero">
        <img
            class="logo"
            src="/static/logo.svg"
            alt="vitepress-custom"
        >
        <div class="name">Local-CMS</div>
        <div class="text">A Management System for Managing Local markdown Files</div>

        <div class="buttons">
            <VPButton
                tag="a"
                size="medium"
                theme="brand"
                text="Docs"
                href="/contents/Guide/1.Introduction/Started.html"
            >
            </VPButton>
            <VPButton
                tag="a"
                size="medium"
                theme="alt"
                text="Github"
                href="https://github.com/huyikai/local-cms"
            >
            </VPButton>
        </div>
    </div>
    <VPDoc />
</template>
<style lang="scss">
.hero {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding-top: 60px;

    .logo {
        display: block;
    }

    .name {
        line-height: 40px;
        font-size: 32px;
        font-weight: 700;
        white-space: pre-wrap;
        background: var(--vp-home-hero-name-background);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: var(--vp-home-hero-name-color);
        margin-top: 60px;
    }

    .text {
        color: var(--vp-c-text-2);
    }

    .buttons {
        margin-top: 30px;
        display: flex;
        flex-flow: row wrap;
        gap: 12px;
    }
}
</style>
