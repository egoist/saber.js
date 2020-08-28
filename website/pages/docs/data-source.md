---
title: Data Source
layout: docs
---

You can fetch data from anywhere in your pages, this is achieved by a concept called **Data Source**.

Data Source is literally a source of data that you can inject under [`page.data`](./pages.md#the-page-object) object, you can create a data source by populating a file in `data` folder:

`data/allPages.js`:

```js
module.exports = ({ after }, api) => {
  after = new Date(after)
  return api.pages.store.where(page => {
    return page.createdAt > after
  })
}
```

<small>Note that `api.pages.store` is a [Loki.js Collection](https://techfort.github.io/LokiJS/Collection.html) instance.</small>

Then in a page, like `pages/index.vue`, let's use the data:

```vue
<template>
  <ul>
    <li v-for="page in page.data.pagesIn2020" :key="page.permalink">
      {{ page.title }}
    </li>
  </ul>
</template>

<script>
export const page = {
  injectData: {
    pagesIn2020: {
      source: 'allPages.js',
      options: {
        after: '2020-01-01'
      }
    }
  }
}

export default {
  props: ['page']
}
</script>
```

By using `page.injectData` option, we can retrieve data from data source `allPage.js` and inject the returned data as `pagesIn2020`.

Now you can access `page.data.pagesIn2020` which gives you the pages created in 2020.

## Data Source API

Data Source files in `data` folder supported all the JavaScript features available in your system's Node.js version, they are processed before webpack so you **can't** use any of the bundler feature.

A data source should set a default export using `module.exports` (you can also return a Promise or use `async/await`):

```js
module.exports = (options, api) => {
  return {}
}
```

The function arguments:

- `options`: The same `options` that you passed to the data source in `injectData`.
- `api`: [The Saber instance](./saber-instance.md).
