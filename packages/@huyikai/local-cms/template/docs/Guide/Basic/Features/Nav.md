# Nav

根据 VitePress 运行目录下的目录及内容自动生成导航栏

## 使用

通过脚手架创建项目时，`config.js` 中已默认配置好导航栏相关配置。直接使用即可。

后续补充导航栏自动生成的功能，需要先运行 `npm install @huyikai/vitepress-helper -D` 安装依赖，然后修改 `docs/.vitepress/config.js` 中的配置。

```js
import vitepressHelper from '@huyikai/vitepress-helper';
export default async () => {
  const instance: any = await vitepressHelper({
    directory: 'docs',
    collapsible: true
  });
  return{
    ...
    nav: instance.nav,
  }
};
```

也可以根据自审需求，扩展 nav。

```js
export default () => {
  return {
    nav: [
      ...instance.nav,
      { text: 'other', link: 'https://github.com/huyikai/vitepress-helper' },
      { text: 'others', items:[...] }
    ]
  };
};
```
