---
title: Saber Config
layout: docs
---

You can use `saber-config.yml`, `saber-config.toml`, `saber-config.js` or `saber-config.json` for general configurations. All the possible config keys will be listed below.

Note that during development, changes made in the config file will NOT trigger rebuild, there're exceptions though, for `siteConfig` and `themeConfig` properties.

## theme

- Type: `string`

The path to your theme or a npm package name (`saber-theme-` prefix is optional).

## siteConfig

- Type: `object`
- Need Restarting: NO

This option is used for configuring the basic information of your website, e.g. `siteConfig.title` and `siteConfig.description`. You can acces it via `this.$siteConfig` in your component.

### lang

`siteConfig.lang` will be used as the value of `lang` attribute for the `<html>` element.

## themeConfig

- Type: `object`
- Need Restarting: NO

For reusuablity, a theme should use this option for customization instead of hard-coding everything in the theme itself. You can access it via `this.$themeConfig` in your component.

## locales

- Type: `object`

You can use this option to override `siteConfig` and `themeConfig` for specific paths, see more about [Internationalization](i18n.md).

```ts
interface Locales {
  [path: string]: {
    siteConfig?: SiteConfig
    themeConfig?: ThemeConfig
  }
}
```

## build

### outDir

- Type: `string`
- Default: `public`

The directory to output HTML files and other static assets.

### publicUrl

- Type: `string`
- Default: `/`

The base URL your application will be deployed at. If your website is located at a sub directory, e.g. `https://example.com/blog`, you should set this option to either an absolute path (like `/blog`, leading slash is required) or an absolute URL (like `https://example.com/blog`).

### extractCSS

- Type: `boolean`
- Default: `false`

By default we inline critical CSS and dynamically add new CSS when you nagivate to a new page.

You can enable this option to extract all CSS into a single file. **Note that this option is always disable in development mode.**

### cssSourceMap

- Type: `boolean`
- Default: `false`

Source maps supports for CSS files.

### loaderOptions

- Type: `LoaderOptions`
- Default: `{}`

Options for css loaders:

```ts
interface LoaderOptions {
  /** sass-loader */
  sass?: any
  /** less-loader */
  less?: any
  /** stylus-loader */
  stylus?: any
  /** css-loader */
  css?: any
  /** postcss-loader */
  postcss?: any
}
```

### cache

- Type: `boolean`
- Default: `true`
- CLI flag: `--no-cache`

Set to `false` to disable webpack cache.

## plugins

- Type: `Array<Plugin>`

Use a set of Saber plugins:

```typescript
type Plugin =
  | string
  | {
      /** The path to your plugin or an npm package name */
      resolve: string
      /** Plugin options */
      options?: object
    }
```

## markdown

Customizing the internal markdown parser.

### slugify

- Type: `string`
- Examples: `limax` `./my-slugify-utility`

The path to a module or npm package name that slugifies the markdown headers. The module should have following signature:

```typescript
type Slugify = (header: string) => string
```

You can use the [limax](https://github.com/lovell/limax) which provides CJK support.

### headings

- Type: `object`

Options for the internal markdown-it plugin for generating markdown headings and heading anchors.

| Property             | Type      | Default      | Description                                         |
| -------------------- | --------- | ------------ | --------------------------------------------------- |
| `markdownHeadings`   | `boolean` | `true`       | Inject markdown headings as `page.markdownHeadings` |
| `permalink`          | `boolean` | `false`      | Generating permalinks.                              |
| `permalinkComponent` | `string`  | `saber-link` |                                                     |
| `permalinkBefore`    | `boolean` | `true`       | Inject permalink before heading text.               |
| `permalinkSymbol`    | `string`  | `#`          | The permalink symbol.                               |

### options

- Type: `object`

Options for [markdown-it](https://github.com/markdown-it/markdown-it).

### plugins

- Type: `Array<MarkdownPlugin>`

Plugins for [markdown-it](https://github.com/markdown-it/markdown-it):

```typescript
interface MarkdownPlugin {
  // A package name or relative path
  // e.g. markdown-it-footnote
  resolve: string
  options?: object
}
```

### lineNumbers

- Type: `boolean`
- Default: `false`

Show line numbers in code blocks.

## permalinks

- Type: `Permalinks` `(page: Page) => Permalinks`
- Default: `/:posts/:slug` for posts, `/:slug` for other pages

The template that is used to generate permalink for each page.

```typescript
interface Permalinks {
  [pageType: string]: string
}
```

Note that the permalink for the homepage is always `/`.

## template

### openLinkInNewTab

- Type: `boolean`
- Default: `true`

Whether to open external links in new tab.

### plugins

- Type: `TemplatePlugin[]`

A set of plugins that are used to transform Vue template.
