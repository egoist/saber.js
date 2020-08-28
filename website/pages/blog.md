---
title: Blog
layout: blog
injectData:
  posts:
    source: $pages
    options:
      type:
        $eq: post
      $sort:
        createdAt: true
---
