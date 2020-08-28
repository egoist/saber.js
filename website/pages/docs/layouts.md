---
title: Layouts
layout: docs
---

Layouts are Vue components that wrap around your page. They allow you to have the source code for your template in one place so you don’t have to repeat things like your navigation and footer on every page.

You can set the `layout` key under [`page`](./pages.md#the-page-object) object to use a layout component from `layouts` folder:

```markdown
---
title: Hello World
layout: post
---

This is a page.
```

The parsed [`page`](./pages.md#the-page-object) object will look like:

```js
{
  title: 'Hello World',
  layout: 'post'
}
```

This will be passed to the layout component as `page` prop, so you can use it like this in `layouts/post.vue`:

```vue
<template>
  <div>
    <h1>{{ page.title }}</h1>
    <slot name="default" />
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>
```

Note that the page content is available as the default slot, you can use it like this: `<slot name="default"></slot>`.

You can also set the layout using ES6 `export const page = {}` as we mentioned in the [pages](./pages.md#the-page-object) documentation.
