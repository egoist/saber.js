---
title: Images, Fonts and Files
layout: docs
---

## Using `import` or `require`

With Webpack, using static assets like images and fonts works similarly to CSS.

You can **`import` or `require` a file right in a JavaScript module or Vue component**. This tells Webpack to include that file in the bundle. Unlike CSS imports, importing a file gives you a string value. This value is the final path you can reference in your code, e.g. as the `src` attribute of an image or the `href` of a link to a PDF.

To reduce the number of requests to the server, importing images that are less than 10,000 bytes returns a [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) instead of a path. This applies to the following file extensions: bmp, gif, jpg, jpeg, and png. SVG files are excluded due to [#1153](https://github.com/facebook/create-react-app/issues/1153).

In a Vue component, we convert any encountered asset URLs into **webpack module requests**.

For example, the following template snippet:

```vue
<img src="../image.png">
```

will be compiled into:

```js
createElement('img', {
  attrs: {
    src: require('../image.png') // this is now a module request
  }
})
```

Since markdown pages are also compiled to Vue components, asset URLs will also be handled properly:

```markdown
![img](../image.png)
```

Note that we only convert **relative URLs**, like `image.png`, `../image.png` but not `/image.png` or `https://example.com/image.png`.

## Using the front matter `assets`

In pages, you can use the front matter `assets` to import static assets.

```markdown
---
assets:
  cover: ./cover.png
---
```

You can use any relative path here, like `./cover.png`, `../images/photo.jpg`. `@` (alias to project root) is also supported, for example: `@/images/cover.png`.

Then use them in your layout component:

```vue
<template>
  <div>
    <!-- page.assets.cover will be an absolute url -->
    <img :src="page.assets.cover" alt="cover" />
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>
```

The files referenced here will be processed by webpack.
