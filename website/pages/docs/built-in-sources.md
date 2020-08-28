---
title: Built-in Sources
layout: docs
---

## `$pages`

Use `$pages` to query pages however you want with mongo-like syntax and sorting.

For a blog site, you may want to inject all posts to homepage but excluding posts with specific tags.

For example excluding posts with `reply` and `micro` tags:

`pages/index.vue`

```vue {highlightLines:['5-12']}
<script>
export const page = {
  injectData: {
    posts: {
      source: '$pages',
      options: {
        type: 'post',
        tags: { $elemMatch: { $nin: ['reply', 'micro'] } }
        $sort: {
          createdAt: 'desc'
        }
      }
    }
  }
}

export default {
  props: ['page']
}
</script>

<template>
  <ul>
    <li v-for="post in page.data.posts" :key="post.title">
      {{ post.title }}
    </li>
  </ul>
</template>
```

The options of `$pages` source should be a mongo query,
