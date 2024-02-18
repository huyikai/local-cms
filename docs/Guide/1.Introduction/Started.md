# 开始入门

## 初始化向导

## 使用自定义锚点 {#my-anchor}

## Emoji 🎉

[[toc]]

`113`

:tada: :100:

::: code-group

```sh [npm]
$ npm add -D vitepress
```

```sh [pnpm]
$ pnpm add -D vitepress
```

```sh [yarn]
$ yarn add -D vitepress
```

```sh [bun]
$ bun add -D vitepress
```

:::

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

`local-cms` 提供了一个初始化向导。你可以选择以下方式来使用初始化向导：

### npx

可以通过 `npx` 直接运行初始化引导。

```shell
npx @huyikai/local-cms init
```

### 全局安装依赖

全局安装 `local-cms`, 然后通过 `cms` 命令运行初始化引导。

```shell
npm i @huyikai/local-cms -g
cms init
```

## 手动安装

将 `local-cms` 安装到项目的开发依赖中。

```sh
npm i @huyikai/local-cms -D
```

然后修改 `package.json` 文件，添加 `cms` 命令。

```json
{
  "scripts": {
    "cms": "node node_modules/@huyikai/local-cms/cms.js docs"
  }
}
```
