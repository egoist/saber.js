---
title: Project Structure
layout: docs
---

Inside a Saber project, you may see **some or all** of the following folders and files:

```
.
├── .saber/
├── public/
├── pages/
├── static/
├── data/
├── theme/
├── saber-config.js
├── saber-node.js
└── saber-browser.js
```

## Folders:

- `.saber`: Automatically generated. The files in this folder are used by Saber internally and they are not meant for modification. Should be added to the `.gitignore` file if not added already.
- `public`: Automatically generated. The output of the build process will be exposed inside this folder. Should be added to the `.gitignore` file if not added already.
- `pages`: Components under this folder become pages automatically with paths based on their file name. Check out the pages docs for more detail.
- `static`: If you put a file into the static folder, it will not be processed by Webpack. Instead it will be copied into the public folder untouched. Check out the [assets docs](static-folder.md) for more details.
- `data`: Data source files, they are used to provided data that you can inject into your page as component props.
- `theme`: The theme directory, you need to configure the theme directory explicitly in your `saber-config.js`

## Files:

- `saber-config.js`: The Saber config file, you can write config in YAML or TOML. Check out the [config docs](saber-config.md) for more details.
- `saber-browser.js`: This file is where Saber expects to find any usage of the [Saber browser APIs (if any)](browser-apis.md). These allow customization/extension of default Saber settings affecting the browser.
- `saber-node.js`: This file is where Saber expects to find any usage of the [Saber node APIs (if any)](node-apis.md). These allow customization/extension of default Saber settings affecting pieces of the site build process.
