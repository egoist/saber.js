---
title: Static Folder
layout: docs
---

In general, every website needs assets: images, stylesheets, scripts, etc. When using Saber, we recommend Importing Assets Directly in JavaScript files, because of the benefits it provides:

- Scripts and stylesheets are minified and bundled together to avoid extra network requests.
- Missing files cause compilation errors instead of 404 errors for your users.
- Result filenames include content hashes so you don’t need to worry about browsers caching their old versions.

However, there is an **escape hatch** that you can use to add an asset outside of the module system.

## Adding assets outside of the module system

You can create a folder named `static` at the root of your project or your theme directory. Every file you put into that folder will be copied into the `public` folder. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `public/sun.jpg`

### Adding Favicon to your Saber site

The static folder can also contain your site's `favicon.ico`. When your site is rendered, like all assets inside the `static` folder, it will also be copied to the `public/` folder. The favicon can also be manipulated per component by [setting it in the `head` property](./manipulating-head.md#customize-ltheadgt-per-component) on a given page.

### Referencing your static asset

You can reference assets from the `static` folder in your code with absolute path, i.e. starting with a slash `/`.

Markdown example:

```markdown
<!-- reference static/logo.png -->

![logo](/logo.png)
```

Vue example:

```vue
<!-- reference static/logo.png -->
<img src="/logo.png" alt="logo">
```

### Downsides

Keep in mind the downsides of this approach:

- None of the files in `static` folder be post-processed or minified.
- Missing files will not be called at compilation time, and will cause 404 errors for your users.
- Result filenames won’t include content hashes so you’ll need to add query arguments or rename them every time they change.

## When to use the `static` folder

Normally we recommend importing stylesheets, images, and font assets from JavaScript. The `static` folder is useful as a workaround for a number of less common cases:

- You need a file with a specific name in the build output, such as `manifest.webmanifest`.
- You have thousands of images and need to dynamically reference their paths.
- You want to include a small script like `pace.js` outside of the bundled code.
- Some libraries may be incompatible with Webpack and you have no other option but to include it as a `<script>` tag.
