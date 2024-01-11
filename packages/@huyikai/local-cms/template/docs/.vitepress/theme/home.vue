<script setup lang="ts">
import VPDoc from 'vitepress/dist/client/theme-default/components/VPDoc.vue';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
</script>
<template>
  <div class="hero">
    <img
      class="logo"
      src="/static/logo.svg"
      alt="vitepress-helper"
    />
    <div class="name">VitePress-Helper</div>
    <div class="text">enhance vitepress experience</div>

    <div class="buttons">
      <VPButton
        tag="a"
        size="medium"
        theme="brand"
        text="Guide"
        href="/Guide/Basic/1.Introduction.html"
      >
      </VPButton>
      <VPButton
        tag="a"
        size="medium"
        theme="sponsor"
        text="Github"
        href="https://github.com/huyikai/vitepress-helper"
      >
      </VPButton>
    </div>
  </div>
  <p
    style="
      white-space: nowrap;
      display: flex;
      flex-flow: row nowrap;
      gap: 10px;
      justify-content: center;
    "
  >
    <img
      src="https://flat.badgen.net/npm/v/@huyikai/vitepress-helper"
      alt="npm-version"
    />
    <img
      src="https://flat.badgen.net/npm/node/@huyikai/vitepress-helper"
      alt="node-version"
    />
    <img
      src="https://flat.badgen.net/npm/dw/@huyikai/vitepress-helper"
      alt="npm-downloads"
    />
    <img
      src="https://flat.badgen.net/npm/license/@huyikai/vitepress-helper"
      alt="license"
    />
  </p>
  <VPDoc />
</template>
<style>
.hero {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
}

.hero .logo {
  display: block;
}

.hero .name {
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}

.hero .text {
  color: var(--vp-c-text-2);
}

.hero .buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 12px;
}
</style>
