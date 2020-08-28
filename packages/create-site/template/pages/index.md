---
# Fallback to `default` layout if `index` is not found
layout: index
# Inject collection with `post` tag as `page.data.posts`
injectData:
  posts:
    source: $collection
    options:
      tag: post
---
