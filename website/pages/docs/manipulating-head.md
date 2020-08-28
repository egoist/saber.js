---
title: Manipulating <head>
layout: docs
---

We use [vue-meta](https://github.com/nuxt/vue-meta) to manipulate the `<head>` element and the attributes for `<html>`, `<head>`, `<body>`.

## Customize `<head>` per component

Use the `head` option in your Vue component:

```js
export default {
  head: {
    title: 'Document title',
    meta: [
      {
        name: 'description',
        content: 'Page description'
      }
    ]
  }
}
```

`head` option can also be a function, for example, in a layout component:

```js
export default {
  props: ['page'],

  head() {
    return {
      title: `${this.page.title} - ${this.$siteConfig.title}`
    }
  }
}
```

You can use `this` to access the component instance.

## Set default values

In `saber-browser.js`, you can use [`setHead`](browser-apis.md#context-sethead) to set the `head` option for the root Vue instance. For example, you can use it to load Google Fonts that you want to apply in every page.

```js
export default ({ setHead }) => {
  setHead({
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Noto+Sans+HK&display=swap'
      }
    ]
  })
}
```

## Troubleshooting

### Duplicated `<meta>` tags

By default Saber sets some `head` tags for you if certain configurations are found in your config file, for example we set `<meta name="description" content="...">` when `siteConfig.description` is set in your config file.

To override the default tag, use the `hid` option:

```js
export default {
  head: {
    meta: [
      {
        name: 'description',
        content: '...my description'.
        // ⬇️ Here
        hid: 'description'
      }
    ]
  }
}
```
