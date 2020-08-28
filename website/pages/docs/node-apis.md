---
title: Node APIs
layout: docs
---

## Usage

Implement any of [Saber Hooks](saber-instance.md#hooks) by exporting them from a file named `saber-node.js` in the root of your project.

During developing, you need to restart the server if you made any changes in this file.

For example:

```js
exports.postCreatePage = function(page) {
  page.foo = true
}
```

You can access [Saber Instance](saber-instance.md) via `this`.
