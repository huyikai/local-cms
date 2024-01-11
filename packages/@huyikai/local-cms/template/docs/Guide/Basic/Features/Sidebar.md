# Nav

根据 VitePress 运行目录下的目录及内容自动生成侧边栏

## 使用

通过脚手架创建项目时，`config.js` 中已默认配置好侧边栏栏相关配置。直接使用即可。

后续补充侧边栏栏自动生成的功能，需要先运行 `npm install @huyikai/vitepress-helper -D` 安装依赖，然后修改 `docs/.vitepress/config.js` 中的配置。

```js
import vitepressHelper from '@huyikai/vitepress-helper';
export default async () => {
  const instance: any = await vitepressHelper({
    directory: 'docs',
    collapsible: true
  });
  return{
    ...
    sidebar: instance.sidebar,
  }
};
```
