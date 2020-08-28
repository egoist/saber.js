// @ts-check

/** @type {import('saber').SaberConfig} */
const config = {
  siteConfig: {
    title: 'Saber',
    description: 'A framework for building modern static websites.',
    lang: 'en'
  },
  theme: '../other-packages/saber-theme-docs/src',
  markdown: {
    headings: {
      permalink: true
    },
    plugins: [{ resolve: 'markdown-it-footnote' }]
  },
  build: { lazy: true, extractCSS: true },
  permalinks: { post: '/blog/:slug' },
  themeConfig: {
    navLinks: [
      {
        title: 'Guide',
        link: '/docs'
      },
      {
        title: 'Community',
        children: [
          {
            title: 'Discord',
            link: 'https://chat.saber.land'
          },
          {
            title: 'Twitter',
            link: 'https://twitter.com/saber_land'
          },
          {
            title: 'GitHub',
            link: 'https://github.com/saberland/saber'
          }
        ]
      },
      {
        title: 'Blog',
        link: '/blog'
      }
    ],
    sidebarMenu: [
      {
        title: 'Basics',
        children: [
          { title: 'Introduction', link: '/docs' },
          { title: 'Installation', link: '/docs/installation' },
          { title: 'Project Structure', link: '/docs/project-structure' },
          { title: 'Pages', link: '/docs/pages' },
          { title: 'Layouts', link: '/docs/layouts' },
          { title: 'Permalinks', link: '/docs/permalinks' },
          { title: 'Routing', link: '/docs/routing' },
          { title: 'Themes', link: '/docs/themes' },
          { title: 'Markdown Features', link: '/docs/markdown-features' },
          {
            title: 'Using Vue in Markdown',
            link: '/docs/using-vue-in-markdown'
          },
          {
            title: 'Manipulating <head>',
            link: '/docs/manipulating-head'
          },
          { title: 'Page Transition', link: '/docs/page-transition' },
          { title: 'Internationalization', link: '/docs/i18n' },
          {
            title: 'Working with Webpack',
            link: '/docs/working-with-webpack'
          },
          { title: 'Deployment', link: '/docs/deployment' }
        ]
      },
      {
        title: 'Using Data',
        children: [
          { title: 'Data Source', link: '/docs/data-source' },
          { title: 'Built-in Sources', link: '/docs/built-in-sources' },
          { title: 'Pagination', link: '/docs/pagination' },
          { title: 'Saber Supplied Data', link: '/docs/saber-supplied-data' }
        ]
      },
      {
        title: 'Styles and Assets',
        children: [
          { title: 'Using CSS Modules', link: '/docs/css-modules' },
          {
            title: 'Using CSS Preprocessors',
            link: '/docs/css-preprocessors'
          },
          { title: 'Using PostCSS', link: '/docs/postcss' },
          {
            title: 'Using Images, Fonts and Files',
            link: '/docs/images-fonts-and-files'
          },
          { title: 'Using the Static Folder', link: '/docs/static-folder' }
        ]
      },
      {
        title: 'References',
        children: [
          { title: 'Saber Config', link: '/docs/saber-config' },
          { title: 'Built-in Components', link: '/docs/components' },
          { title: 'Plugin API', link: '/docs/plugin-api' },
          { title: 'Saber Instance', link: '/docs/saber-instance' },
          { title: 'Saber Browser APIs', link: '/docs/browser-apis' },
          { title: 'Saber Node APIs', link: '/docs/node-apis' },
          { title: 'Page Interface', link: '/docs/page-interface' }
        ]
      }
    ]
  },
  plugins: [
    {
      resolve: '../packages/saber-plugin-google-analytics',
      options: { trackId: 'UA-54857209-16' }
    },
    { resolve: '../packages/saber-plugin-prismjs' },
    {
      resolve: '../packages/saber-plugin-pwa',
      options: {
        generateSWOptions: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/,
              handler: 'StaleWhileRevalidate'
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/s\//,
              handler: 'StaleWhileRevalidate'
            }
          ]
        }
      }
    },
    {
      resolve: '../packages/saber-plugin-search'
    },
    {
      resolve: '../packages/saber-plugin-image'
    },
    {
      resolve: '../packages/saber-plugin-code-copy',
      options: {
        buttonStyle: {
          border: 'none'
        }
      }
    }
  ],
  template: {
    openLinkInNewTab: true
  }
}

module.exports = config
