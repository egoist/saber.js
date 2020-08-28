---
title: Page Transition
layout: docs
---

You can define `transition` in three ways to apply transition on page navigation:

1. Page component option: `transition`
2. Page key: `transition` (i.e. in front matter or `export const page = {}`)
3. Layout component option: `transition`

Priority: 1 > 2 > 3.

For example, you can use the component option:

```vue
<script>
export default {
  // Can be a string
  transition: 'slide-left',
  // Or an object
  transition: {
    name: 'slide-left'
  },
  // or a function
  transition(to, from) {
    // return a string or object
  }
}
</script>
```

Or use the [page](./pages#the-page-object) key `transition`, this is useful if you just want to use front matter:

```yaml
# A string
transition: string
# Or object
transition:
  name: string
  mode: string
```

Note that you can **NOT** use a function as `transition` when using the page key.

All the props of Vue's built-in [`<transition>`](https://vuejs.org/v2/api/#transition) component can be used in our `transition` object:

| Property           | Type      | Default  | Description                                                                                                                                                                                                               |
| ------------------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | `string`  | `page`   | Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc.                                                                              |
| `appear`           | `boolean` | `false`  | Whether to apply transition on initial render.                                                                                                                                                                            |
| `css`              | `boolean` | `true`   | Whether to apply CSS transition classes. If set to false, will only trigger JavaScript hooks registered via component events.`                                                                                            |
| `type`             | `string`  | N/A      | Specifies the type of transition events to wait for to determine transition end timing. Available values are `transition` and `animation`. By default, it will automatically detect the type that has a longer duration.` |
| `mode`             | `string`  | `out-in` | Controls the timing sequence of leaving/entering transitions. Available modes are `out-in` and `in-out`.                                                                                                                  |
| `duration`         | `number`  | N/A      | Specifies the duration of transition.                                                                                                                                                                                     |
| `enterClass`       | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |
| `enterToClass`     | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |
| `enterActiveClass` | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |
| `leaveClass`       | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |
| `leaveToClass`     | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |
| `leaveActiveClass` | `string`  | N/A      | See [Vue.js docs](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes).                                                                                                                                 |

You can also define methods in the `transition`, these are for the [JavaScript hooks](https://vuejs.org/v2/guide/transitions.html#JavaScript-Hooks):

- `beforeEnter(el)`
- `enter(el, done)`
- `afterEnter(el)`
- `enterCancelled(el)`
- `beforeLeave(el)`
- `leave(el, done)`
- `afterLeave(el)`
- `leaveCancelled(el)`

The default transition name is `page`, so you can directly define following CSS to apply transition to all pages:

```css
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
```
