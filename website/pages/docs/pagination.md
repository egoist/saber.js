---
title: Pagination
layout: docs
---

To iterate over a data set and create pages for individual chunks of data, use pagination. Enable by extend the [`page`](./pages#the-page-object) object with the `pagination` key. Consider the following page:

```md
---
injectData:
  posts:
    source: $pages
    options:
      type:
        $eq: post
      $sort:
        createdAt: desc
pagination:
  data: posts
  size: 20
---
```

We enable pagination and then give it the dataset with the `data` key. We control the number of items in each chunk with `size`.

Saber will also inject `page.data.pagination` which will be filled with following keys:

```ts
{
  totalPages: number
  current: number
  hasNext: boolean
  hasPrev: boolean
  nextLink: string | undefined
  prevLink: string | undefined
}
```

The original `page.data.posts` will be modified to include only the specific chunk of data for that page.

If the above file were named `archive.md`, it would create a few pages when there are enough data to paginate: `archive/index.html`, `archive/page/2/index.html` and `archive/page/3/index.html` and so on.
