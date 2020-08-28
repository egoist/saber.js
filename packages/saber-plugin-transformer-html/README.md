# saber-plugin-transformer-html

Write pages in HTML.

## Install

```bash
yarn add saber-plugin-transformer-html
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-transformer-html
```

Try it by populating a `pages/try.html`:

```html
<strong>hello world</strong>
```

This page will be rendered as `/try`.

Like Markdown pages, you can only use frontmatter to define page data:

```html
---
title: Try it
layout: try
---

<button @click="count++">{{count}}</button>

<script>
  export default {
    data() {
      return {
        count: 0
      }
    }
  }
</script>

<style scoped>
  button {
    color: red;
  }
</style>
```

## License

MIT.
