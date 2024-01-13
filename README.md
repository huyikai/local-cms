# Local-CMS

## Brief

A Management System for Managing Local markdown Files

## Features

- CLI guide
- Addition, deletion, modification and search of files/directories
- Edit Live Preview
- Save in real time without manual save

## Usage

## Initialization Guide

`local-cms` provides an initialization guide. You can choose the following ways to use the initialization guide:

### npx

You can run the initialization guide directly through `npx`.

```shell
npx @huyikai/local-cms init
```

### Global Installation Dependencies

Install `local-cms` globally, then run the initialization guide through the `cms` command.

```shell
npm i @huyikai/local-cms -g
cms init
```

## Manual Installation

Install `local-cms` into the project's development dependencies.

```sh
npm i @huyikai/local-cms -D
```

Then modify the `package.json` file, add the `cms` command.

```json
{
  "scripts": {
    "cms": "node node_modules/@huyikai/local-cms/cms.js docs"
  }
}
```

## ToDo

- File, directory movement
- File Import/Batch
- Linked content import
- Version control
- Static resource (image) management
- Internationalization
- vitepress editor preview theme

## License

[MIT](./license)

## Website

<https://huyikai.github.io/local-cms>

## Repository

<https://github.com/huyikai/local-cms>
