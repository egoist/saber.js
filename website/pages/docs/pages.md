---
title: Pages
layout: docs
---

Saber uses the file-system as the router API. Files with `.js`, `.vue` or `.md` extension inside `./pages` folder will automatically become _web pages_, `.js` and `.vue` pages are treated as Vue components, `.md` files will also be converted to Vue components internally.

Try this `pages/index.md`:

```markdown
Hello **Saber**!
```

And run `saber` in your project:

![page preview](@/images/simple-index-md-page.png)

- `./pages/index.md` maps to `/`
- `./pages/about.md` maps to `/about`
- `./pages/docs/index.md` maps to `/docs`
- and so on..

<small><i>Note: You can customize the generated [permalinks](./permalinks.md).</i></small>

## The `page` object

Internally every page is parsed into a `page` object, Saber uses the `page` object to control the behavior of the page.

A use case of `page` object is to override `page.createdAt` which defaults to the creation time of the page. There're two ways to extend the `page` object, in a Markdown file, for example:

```markdown
---
createdAt: 2020-01-01
---
```

As you see you can use front matter to extend `page` in Markdown pages.

In a Vue or JavaScript page, you can't use front matter, and instead you should use ES6 `export` keyword:

```js
<script>
export const page = {
  createdAt: '2020-01-01'
}

export default {}
</script>
```

Note that the value of the `page` export must be an object literal and accessible at build time.

## Configure Your Page

There are a few special page keys you can modify to control how pages behave.

- `createdAt`: Override the default date (file creation time) to customize how the page is sorted in a collection.
- `permalink`: Change the output target of the current page. [See docs](./permalinks.md).
- `layout`: Wrap current page with a layout component found in `layouts` folder. [See docs](./layouts.md)
- `pagination`: Enable to iterate over data. Output multiple routes from a single page.
- `tags`: A single string or array that identifies that a specific page is part of a collection. [See docs](./collections.md)
- `markdownHeadings`: Whether to inject Markdown headings to page data. [See docs]().
