---
injectData:
  posts:
    source: posts.js
    options:
      draft: true
pagination:
  data: posts
  perPage: 1
---

hello!

<div v-for="post in $page.data.posts" :key="post.title">
  {{post.title}}
</div>

Paginator: {{ JSON.stringify($page.data.pagination) }}
