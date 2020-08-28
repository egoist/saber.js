---
title: PostCSS
layout: docs
---

All kinds of stylesheets, regardless of the extensions, will be processed by [PostCSS](https://postcss.org/) at the end.

When a stylesheet is being processed, Saber will use the nearest `postcss.config.js` or `.postcssrc.js` etc.

For example you can add [Autoprefixer](https://github.com/postcss/autoprefixer) in `postcss.config.js` to automatically add vendor prefixes based on the browsers you target:

```bash
yarn add autoprefixer --dev
```

Add this plugin in PostCSS config file:

```js
// postcss.config.js
module.exports = {
  plugins: [require('autoprefixer')()]
}
```

Configure the browsers you wanna support in `package.json`:

```json
{
  "browserslist": ["ie > 8", "last 2 versions"]
}
```

Then such CSS:

```css
.App {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

Will become:

```css
.App {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
```
