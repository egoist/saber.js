---
title: Page Interface
layout: docs
---

The `page` is the center of Saber's data & routing system.

The built-in page properties are listed below, you can also expose custom properties on `page`.

## Properties

### id

- Type: `string`
- Required: `true`

Unique page ID.

### type

- Type: `'page' | 'post'`
- Default: `'page'`

Page type.

### layout

- Type: `string`
- Default: `undefined`

The page layout.

### createdAt

- Type: `string`

The creation time of this page.

If the page is loaded from file system, it defaults to `page.date || file.birthtime`.

### updatedAt

- Type: `string`

The updated time of this page.

If the page is loaded from file system, it defaults to `page.updated || file.mtime`.

### permalink

- Type: `string`
- Required: `true`

The permalink to the page, we infer it from `page.internal.relative` if it's loaded from file system.

### slug

- Type: `string`
- Required: `true`

The value of `:slug` placeholder in the `permalinks` option, we infer it from the filename (without extension) of `page.internal.relative` if it's loaded from file system.

### assets

- Type: `{[k:string]: string}`
- Default: `{}`

Use this attribute to reference local resources and let webpack process them.

### internal.relative

- Type: `string`

The relative path to this page, set when it's loaded from file system.

### internal.absolute

- Type: `string`

The absolute path to this page, set when it's loaded from file system.

### internal.isFile

- Type: `boolean`

Whether this page is loaded from file system.
