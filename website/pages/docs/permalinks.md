---
title: Permalinks
layout: docs
---

Permalinks are the output path for your pages and posts. They allow you to structure the directories of your source code differently from the directories in your output.

By default we infer the permalink from the filename.

## Change Permalink Per Page

The simplest way to change a permalink is to extend the `page` object.

In a markdown page like `./pages/sub_folder/hello.md` you can do so to change the permalink to `/about`:

```markdown
---
permalink: /about
---
```

## Global Permalink Format

Setting a permalink for every page individually on your site is no fun. Luckily, Saber lets you set the permalink structure globally in your config file.

To change the global permalink format, you use the `permalinks` option in `saber-config.yml`. You can use placeholders to modify the output. For example:

```yaml
# Default values:
permalinks:
  post: /:year/:month/:day/:slug
  page: /:slug
```

Note that placeholders like `:year` and `:month` are parsed from the `page.createdAt` key which can be any valid date value like: `2015-02-31`, it defaults to the creation time of your page.

### Placeholders

Here’s the full list of placeholders available:

| Variable | Description                                                |
| -------- | ---------------------------------------------------------- |
| year     | Year from the page attribute `date`                        |
| month    | Month from the page attribute `date`                       |
| i_month  | Month from the page attribute `date`, without leading zero |
| day      | Day from the page attribute `date`                         |
| i_day    | Day from the page attribute `date`, without leading zero   |
| slug     | The filename of the page, without extension                |
