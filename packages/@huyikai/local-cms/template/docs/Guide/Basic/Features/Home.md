# Home

在 VitePress 默认主题中，首页样式通过配置 [Hero Section](https://vitepress.dev/reference/default-theme-home-page) 来实现。不少开发者喜欢更具个性化的首页，默认主题不足以满足要求，VitePress 本身提供了自定义主题的方法，但为了让使用者更容易上手，注册了可以直接修改的 Home 组件作为首页，以此方便大家使用。

## 使用

通过脚手架项目时，会自动创建文件 `docs/.vitepress/theme/home.vue`。直接在里面按需修改即可。如果想切换回默认主题的首页，则需要将 `docs/index.md` 文件中的 `Frontmatter` 中的 `layout` 字段修改为 `home` ，然后按照 VitePress 提供的 [Hero Section](https://vitepress.dev/reference/default-theme-home-page) 配置即可。

后续补充 `Home` 需要先运行 `npm install @huyikai/vitepress-helper -D` 安装依赖，然后创建 `docs/.vitepress/theme/home.vue` `docs/.vitepress/theme/index.js`。同时还需要将文档根目录(docs/index.md)下的 `index.md` 文件的 `Frontmatter` 中的 `layout` 字段修改为 `custom`。这样运行运行时首页显示的就会是 `home.vue` 中自定的内容了。

:::tip
在 VitePress-Helper 默认添加的`home.vue` 的文件中，额外添加了一个 VitePress 默认导出的 `<VPDoc />` 组件。这样 `docs/index.md` 文件中的内容会在首页的下方补充渲染。可以根据自身需要取舍这部分。
:::

### docs/.vitepress/theme/home.vue

```vue
<script setup>
...
</script>
<template></template>
```

### docs/.vitepress/theme/index.js

```js
...
import Home from './home.vue';

const theme = {
  Layout,
  enhanceApp: ({ app }: any) => {
    ...
    app.component('Home', Home);
  }
};
export default theme;
```

### docs/index.md

```yaml
---
layout: custom
aside: false
outline: false
lastUpdated: false
---
```
