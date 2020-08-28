---
title: Deployment
layout: docs
---

The command `saber build` creates a `public` directory with a production build of your app. Set up your favorite HTTP server to properly serve static `.html` files and other static assets.

## Built-in Static Server

You can use the built-in static server via the `saber serve` command, it automatically serves the `public` directory:

```bash
cd my-site
yarn saber build
yarn saber serve
```

This is great for previewing the production build locally.

## Other Solutions

You don't need the built-in static server in order to serve a Saber application, it works just fine with most static servers, for example you can use [`sirv-cli`](https://github.com/lukeed/sirv/tree/master/packages/sirv-cli):

```bash
npx sirv-cli public
```

Or [`serve`](https://github.com/vercel/serve):

```bash
npx serve public
```

## Building for Relative Paths

By default, Saber produces a build assuming your app is hosted at the server root.
To override this, specify the [`build.publicUrl`](./saber-config.md#publicurl) in your Saber config file, for example:

```js
// saber.config.js
module.exports = {
  build: {
    publicUrl: '/blog/'
  }
}
```

## [Netlify](https://www.netlify.com/)

**To setup continuous delivery:**

With this setup Netlify will build and deploy when you push to git or open a pull request:

1. [Start a new netlify project](https://app.netlify.com/signup)
2. Pick your Git hosting service and select your repository
3. Click `Build your site`

Since Netlify automatically rewrites routes like `/foo` to `/foo.html` when `/foo` doesn't exist, you may need [saber-plugin-netlify-redirect](https://github.com/saberland/saber/tree/master/packages/saber-plugin-netlify-redirect) to fix this.

## [GitHub Pages](https://pages.github.com/)

### Step 1: Install `gh-pages` and add `deploy` to `scripts` in `package.json`

```bash
npm i -D gh-pages
```

Alternatively you may use `yarn`:

```bash
yarn add gh-pages --dev
```

Add the following `scripts` in your `package.json`:

```diff
  "scripts": {
+   "predeploy": "npm run build",
+   "deploy": "gh-pages -d public -t",
    "dev": "saber",
    "build": "saber build",
```

### Step 2: Add `.nojekyll` to turn off Jekyll

Adding a file `.nojekyll` (with empty content) to the `static/` folder to [turn off Jekyll integration of GitHub Pages](https://help.github.com/en/articles/files-that-start-with-an-underscore-are-missing).

### Step 3: Optionally, configure the domain or repository path

If you are using a custom domain, you can configure it with GitHub Pages by adding a `CNAME` file to the `static/` folder.

Your `CNAME` file should look like this:

```
mywebsite.com
```

If you are using a repository-level gh-pages deployment (`[username].github.io/[repository name]`), [set the `publicUrl` property in the Saber configuration file](#building-for-relative-paths). This is not required for account-level gh-pages deployments (`[username].github.io`).

### Step 4: Deploy the site by running `npm run deploy`

Then run:

```bash
npm run deploy
```

### Step 5: For a project page, ensure your project’s settings use `gh-pages`

Finally, make sure GitHub Pages option in your GitHub project settings is set to use the `gh-pages` branch:

![gh-pages-setting](@/images/gh-pages-setting.png)

## [Vercel](https://vercel.com/)

[Vercel](https://vercel.com) is a cloud platform that enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with zero configuration. They provide a global edge network, SSL encryption, asset compression, cache invalidation, and more.

### Step 1: Deploying your Saber Website to Vercel

To deploy your Saber app with a [Vercel for Git Integration](https://vercel.com/docs/git-integrations), make sure it has been pushed to a Git repository.

Import the project into Vercel using the [Import Flow](https://vercel.com/import/git). During the import, you will find all relevant options preconfigured for you; however, you can choose to change any of these options, a list of which can be found [here](https://vercel.com/docs/build-step#build-&-development-settings).

After your project has been imported, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/platform/deployments#preview), and all changes made to the [Production Branch](https://vercel.com/docs/git-integrations#production-branch) (commonly "main") will result in a [Production Deployment](https://vercel.com/docs/platform/deployments#production).

Once deployed, you will get a URL to see your app live, such as the following: [https://my-saber-app-dxcikdrgk.now.sh/](https://my-saber-app-dxcikdrgk.now.sh/).

## [Firebase](https://firebase.google.com/)

To host and deploy your site to Firebase.

### Step 1: Create a new web app and select "Also setup Firebase Hosting for this app"

### Step 2: Add the required Firebase scripts to the body of your site

```js
// saber.browser.js
export default ({ setHead }) => {
  setHead({
    script: [
      {
        src: '/__/firebase/6.6.1/firebase-app.js',
        body: true
      },
      {
        src: '/__/firebase/init.js',
        body: true
      }
    ]
  })
}
```

### Step 3: Install the Firebase CLI, login and create a firebase config in the root of your project.

```bash
npm install -g firebase-tools # Install the CLI
firebase login # This will open a new browser window follow the instructions
firebase init # Follow the instructions, choose the hosting option
```

### Step 4: Add the following `script` in your `package.json`:

```diff
  "scripts": {
    "dev": "saber",
    "build": "saber build",
+   "deploy": "npm run build && firebase deploy"
```

Deploy your site

```
npm run deploy
```

### Step 5: To configure firebase to strip trailing slash (Optional)

Add `"trailingSlash: false` to your `firebase.json` config.

```js
// firebase.json example
{
  "hosting": {
    "public": "public",
    "cleanUrls": true,
    "trailingSlash": false,
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

## Docker

[TODO]

PR welcome for using a docker image to build and serve your Saber application.
