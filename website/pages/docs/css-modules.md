---
title: CSS Modules
layout: docs
---

Saber supports [CSS Modules](https://github.com/css-modules/css-modules) alongside regular stylesheets using the `[name].module.css` file naming convention. CSS Modules allows the scoping of CSS by automatically creating a unique classname of the format `[filename]\_[classname]\_\_[hash]`.

> **TIP**: Should you want to preprocess a stylesheet with Sass then make sure to follow the installation instructions and then change the stylesheet file extension as follows: `[name].module.scss` or `[name].module.sass`.

CSS Modules let you use the same CSS class name in different files without worrying about naming clashes. Learn more about CSS Modules [here](https://css-tricks.com/css-modules-part-1-need/).

With `styles.module.css`

```css
.error {
  background-color: red;
}
```

You can import it directly:

```js
import styles from './styles.module.css'

console.log(styles.error)
// => You get a class name:
// Button_error_ax7yz
```
