<p align="center">
  <a href="https://huyikai.github.io/local-cms/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://huyikai.github.io/local-cms/static/logo.svg" alt="tree-conver logo">
  </a>
</p>

# Local-CMS

![npm-version](https://badgen.net/npm/v/@huyikai/local-cms) 
![npm-downloads](https://badgen.net/npm/dw/@huyikai/local-cms) 
![license](https://badgen.net/npm/license/@huyikai/local-cms)

## Brief

A Management System for Managing Local markdown Files

## Features

- CLI guide
- Addition, deletion, modification and search of files/directories
- Edit Live Preview
- Save in real time without manual save
- Vitepress theme style editor

## Usage

### Initialization Guide

`local-cms` provides an initialization guide. You can choose the following ways to use the initialization guide:

#### npx

You can run the initialization guide directly through `npx`.

```shell
npx @huyikai/local-cms init
```

#### Global Installation Dependencies

Install `local-cms` globally, then run the initialization guide through the `cms` command.

```shell
npm i @huyikai/local-cms -g
cms init
```

### Manual Installation

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

- Static resource (image) management
- File, directory movement
- File Import/Batch
- Linked content import
- Version control
