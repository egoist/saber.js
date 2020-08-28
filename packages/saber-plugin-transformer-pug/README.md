# saber-plugin-transformer-pug

Write pages in Pug and add support for importing Pug files

## Install

```bash
yarn add saber-plugin-transformer-pug
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-transformer-pug
```

Try it by populating a `pages/try.pug`:

```pug
strong hello world
```

This page will be rendered as `/try`.

Like Markdown pages, you can only use frontmatter to define page data:

```pug
---
title: Try it
layout: try
---

strong hello
i world
```

### Using Pug in Vue SFC template block

```vue
<template lang="pug">
  p hello world
</template>
```

## License

MIT.
