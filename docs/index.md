---
layout: custom
aside: false
lastUpdated: false
---

## Usage

### Cli

```shell
# Global installation
npm i @huyikai/local-cms -g

# Execute in the directory where cms needs to be introduced or in a new directory.
cms init
```

Through the above methods, it will be guided and used through cli

### Manually introduce

Of course, you can also manually introduce it in the project.

```sh
# In the project directory
npm i @huyikai/local-cms -D
```

```json
// package.json
{
  ...
  "scripts": {
    ...
    "cms": "node node_modules/@huyikai/local-cms/cms.js docs"
  },
}
```

