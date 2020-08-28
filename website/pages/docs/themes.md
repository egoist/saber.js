---
title: Themes
layout: docs
---

It's easy to create a theme, you just have to create a new folder. To start using your theme,modify the `theme` setting in your site's `saber-config.yml`:

```yaml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

A theme should have following folder structure:

```bash
.
├── saber-browser.js # optional
├── saber-node.js    # optional
└── layouts          # required
```

Theme layouts are populated under `$theme/layouts` directory and this directory is required, layouts in `$projectRoot/layouts` will still work and take higher priority.

## Ejecting

If you are using a theme from npm and wish to modify it to better suit your needs, you might want to eject it. This will copy over its source code to `./theme`, allowing you to edit it.

```bash
saber eject-theme
```

The above command will use the files from `node_modules`, but if you want the source code from the repository instead, add the `--git` flag. This will clone the theme's Git repository as a submodule, which adds the benefits of easier upgradability, contribution to the upstream code and better version control management.

## Submitting Themes

We showcase high-quality official and community themes [on this page](/themes), you can follow this guide to get your theme included:

First you need to fork Saber and clone it to your local machine:

```bash
git clone git@github.com:YOUR_USERNAME/saber.git
```

Then add a preview image to `website/pages/theme/previews` folder, there're some requirements that the image should meet:

- Using PNG format.
- Using npm package name as the filename, e.g. `saber-theme-minima.png`.
- The size should be `1024x768` or `2048x1536`. Tip: you can use Chrome devtools to resize and screenshot the web page.
- Under 80KB, you can compress it using [TinyPNG](https://tinypng.com/).

Finally open `website/pages/theme/_themes.yml` and add your theme, here's an example:

```yaml
- name: Minima
  npm: saber-theme-minima
  demo: https://minima.saber.land
  repo: https://github.com/saberland/saber-theme-minima
  tags:
    - Blog
    - Clean
    - Minimal
```
