---
title: Saber Instance
layout: docs
---

## pages

An instance of the `Pages` class, it's used to store `page` ([PageInterface](./page-interface.md)).

### `pages.store`

A [Loki.js Collection](https://techfort.github.io/LokiJS/Collection.html) instance which is used to store all pages.

### `pages.createPage(page)`

- Params:
  - `page`: `PageInterface`
- Returns: `void`

Create a new page or overwrite the existing page in `pages.store`.

### `pages.getPagePublicFields(id)`

- Params:
  - `id`: `string` `PageInterface` A page ID or the page object.
- Returns: `Omit<PageInterface, 'internal' | 'content'> | undefined`

Get a page with its public fields only.

Currently we only exclude `internal` and `content` properties.

### `pages.createRedirect(config)`

- Params:
  - `config`: `RedirectConfig`
- Returns: `void`

`RedirectConfig` properties:

| Property            | Type      | Default | Description                                                                                                                                                                                                              |
| ------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fromPath`          | `string`  | N/A     | Any valid URL. Must start with a forward slash                                                                                                                                                                           |
| `toPath`            | `string`  | N/A     | Any valid URL. Must start with a forward slash                                                                                                                                                                           |
| `isPermanent`       | `boolean` | `false` | This is a permanent redirect; defaults to temporary                                                                                                                                                                      |
| `redirectInBrowser` | `boolean` | `false` | Redirects are generally for redirecting legacy URLs to their new configuration. If you can’t update your UI for some reason, set `redirectInBrowser` to `true` and Saber will handle redirecting in the client as well.` |

### `pages.getMatchedLocalePath(permalink)`

- Params:
  - `permalink`: `string`
- Returns: `string`

Get matched locale path, for example if you have following Saber config:

```yaml
locales:
  /cn:
    lang: zh
    title: 我的网站
```

```js
pages.getMatchedLocalePath('/about')
//=> '/'

pages.getMatchedLocalePath('/cn/about')
//=> '/cn'
```

## dataSource

### `dataSource.findAndSort`

- Params:
  - `options`: `Options`

Find and sort data from a collection.

```ts
interface Options {
  // Any page property
  [prop]: {
    // Supports mongo-like query syntax
    $gt: new Date('2020-02-02')
  },
  // And a special option `$sort` for sorting
  $sort?: {
    // Sort by page property in `desc` or `asc` order
    // `true` means `desc`
    prop: 'desc' | 'asc' | boolean
  }
}
```

### `dataSource.addData`

- Params:
  - `name`: `string`
  - `factory`: `DataFactory`

Add data so you can inject it in your page.

```ts
// `options` is from the `injectData` option in your page
type DataFactory = (options: any, api: Saber) => any
```

### `dataSource.removeData`

- Params:
  - `name`: `string`

Remove a data by its name.

## hooks

Hooks are called during Saber's build process. When developing a plugin for Saber, you might want to know where each hook is called. To learn this, search for `hooks.<hook name>.call` across the Saber source.

The following lifecycle hooks are exposed by the `api` and can be accessed as such:

```js
api.hooks.someHook.tap('MyPlugin', (...params) => {
  // Do something
})
```

Depending on the hook type, `tapAsync` and `tapPromise` may also be available. Hooks are [Tapable](https://github.com/webpack/tapable) instances.

### `filterPlugins`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `plugins`: `Plugin[]`

Called to filter plugins.

This hook is **only** available `saber-node.js`.

```ts
interface Plugin {
  /* Plugin name */
  name: string
  apply: (api: SaberInstance, options?: any) => void
  /* Plugin options */
  options?: any
  /* The path to the plugin, only used in logs */
  location?: string
}
```

### `prePlugins`

- Hook Type: `AsyncSeriesHook`

This hook is **only** available `saber-node.js`.

Called before loading user plugins.

### `postPlugins`

- Hook Type: `AsyncSeriesHook`

Called after the `apply` methods of all user plugins are executed.

### `initPages`

- Hook Type: `AsyncSeriesHook`

Called before starting creating pages for the first time.

### `postCreatePage`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `page`: `PageInterface`

Called after creating a page.

### `chainMarkdown`

- Hook Type: `SyncHook`
- Params:
  - `config`: `ConfigChain`

Called when creating a page to get the plugins and options for `markdown-it`.

### `chainTemplate`

- Hook Type: `SyncHook`
- Params:
  - `config`: `ConfigChain`

Called to get the options and plugins for transforming Vue template.

### `postCreatePages`

- Hook Type: `AsyncSeriesHook`

Called after creating all pages.

### `beforeRun`

- Hook Type: `AsyncSeriesHook`

Called before emitting the routes file for the first time.

### `emitRoutes`

- Hook Type: `AsyncSeriesHook`

Called after emitting the routes file.

### `chainWebpack`

- Hook Type: `SyncHook`
- Params:
  - `webpackChain`: `WebpackChain`
  - `opts`: `{ type: 'client' | 'server' }`

Called with the `webpack-chain` instance before creating webpack compiler.

### `getWebpackConfig`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `config`: `WebpackConfig`
  - `opts`: `{ type: 'client' | 'server' }`

Called to get the webpack config before creating webpack compiler. You should return the webpack config object in this hook.

### `postCreateServer`

- Hook Type: `SyncHook`
- Params:
  - `server`: `PolkaInstance`

Called after creating the server.

### `getDocumentData`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `documentData`: `DocumentData`
  - `context`: SSR context.

Called to get the document data.

### `getDocument`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `document`: `string`
  - `context`: SSR context.

Called to get the document html.

### `afterBuild`

- Hook Type: `AsyncSeriesHook`

Called after running webpack (in production mode).

### `preExportPages`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `context`: SSR context.
  - `exportedPage`: `ExportedPage`

Called before exporting a page to static HTML file.

```ts
interface ExportedPage {
  // Output file content
  content: string
  // Output file path
  path: string
}
```

### `postExportPage`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `context`: SSR context.
  - `exportedPage`: `ExportedPage`

Called after exporting a page to static HTML file.

### `afterGenerate`

- Hook Type: `AsyncSeriesHook`

Called after generating static HTML files (in production mode).

## compilers

Saber by default runs two compilers, `compilers.client` for client bundle and `compilers.server` for server bundle. Saber exposed some useful events and helpers for you to interactive with underlying webpack compilers.

### Events

#### `status-changed`

When webpack finished compiling, this event will be emitted.

```js
api.compilers.client.on('status-changed', ({ status, allCompilers }) => {
  // status: 'waiting' | 'building' | 'success' | 'error'
  // allCompilers.hasError: boolean
  // Whether the status of every compiler is `success` or `error`
  // allCompilers.ready: boolean
})
```

### Properties

#### `status`

- Type: `'waiting' | 'building' | 'success' | 'error'`

The compiler status.
