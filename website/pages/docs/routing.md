---
title: Routing
layout: docs
---

## Client-side transitions with `<a>` element

In Saber, client-side transitions between routes can be enabled via `<a>` elements:

Basic example, `./pages/index.vue`:

```vue
<template>
  <div>
    <h1>Welcome to Saber!</h1>
    <a href="/about">About</a>
  </div>
</template>
```

It also works in Markdown since links are transformed to `<a>` elements as well.

Internally, `<a>` elements are converted to a built-in component [`<saber-link>`](components.md#saberlink), so these are equivalent:

```vue
<a href="/about">About</a> <saber-link to="/about">About</saber-link>
```

`<saber-link>` will be rendered as `<a target="_blank" rel="noopener noreferrer">` element if the link is an absolute URL (like `https://github.com`), otherwise it's rendered as Vue Router's `<router-link>` component.

## Reference local pages

You can use the `<a>` element to reference local pages by filename:

```vue
<a href="./about.md">About</a>
```

...is converted to:

```html
<saber-link to="/about">About</saber-link>
```

This is useful if you're not sure what the permalink is or you might change the permalink format in the future.

## Disable this with `saber-ignore`

If you dont' want to use `<a>` for client-side transitions, you can use the `saber-ignore` attribute:

```vue
<a saber-ignore href="/">Home</a>
```

Then this will be rendered as `<a>` instead of `<router-link>` and make the browser fully reload the page.
