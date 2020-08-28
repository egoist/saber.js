# saber-plugin-netlify-redirect

Automatically generate or update `_redirects` file in your public folder for [Netlify](https://www.netlify.com/docs/redirects/).

## Install

```bash
yarn add saber-plugin-netlify-redirect
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-netlify-redirect
```

Then you can create redirects using the [`pages.createRedirect`](<https://saber.land/docs/saber-instance#pages.createredirect(config)>) API.

Since Netlify automatically rewrites routes like `/about` to `/about.html`, this plugin will also create redirects for all `.html` routes so that `/about` will be redirected to `/about.html` when it does not exist.

## License

MIT.
