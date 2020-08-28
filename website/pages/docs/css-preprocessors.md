---
title: CSS Preprocessors
layout: docs
---

CSS pre-processors like Sass, SCSS, Less and Stylus are still popular today, so it's natual that Saber supports them out of the box. However relevant dependencies for transpilation are required, be sure to follow the installation instructions below.

## Sass / SCSS

```bash
yarn add sass-loader sass --dev
```

Then you can import `.scss` and `.sass` files. If you want to import files from `node_modules`, make sure to add `~` prefix as follows:

```scss
// importing a css file from the nprogress node module
@import '~nprogress/nprogress';
```

## Less

```bash
yarn add less-loader less --dev
```

## Stylus

```bash
yarn add stylus-loader stylus --dev
```

## Passing Options to Pre-Processor Loaders

Sometimes you may want to pass options to the pre-processor's webpack loader. You can do that using the `build.loaderOptions` option in `saber-config.js`. For example, to pass some shared global variables to all your Sass/Less styles:

```js
module.exports = {
  build: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to your project root
        // so this assumes you have a file named `scss/variables.scss`
        data: `@import "@/scss/variables.scss";`
      },
      // pass Less.js Options to less-loader
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      }
    }
  }
}
```
