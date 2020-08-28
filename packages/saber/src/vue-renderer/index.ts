import path from 'path'
import { fs, slash } from 'saber-utils'
import { log } from 'saber-log'
import { BundleRenderer } from 'vue-server-renderer'
import { SyncWaterfallHook } from 'tapable'
import { readJSON } from './utils'
import renderHTML from './render-html'
import { Compiler } from 'webpack'
import { Saber } from '..'

function runCompiler(compiler: Compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function resolveVueApp(...args: string[]) {
  return path.join(__dirname, '../../vue-app', ...args)
}

function removeTrailingSlash(input: string) {
  if (input === '/') {
    return input
  }

  return input.replace(/\/$/, '')
}

const ID = 'vue-renderer'

export class VueRenderer {
  // @ts-ignore fix this later
  api: Saber
  visitedRoutes: Set<string>
  builtRoutes: Set<string>
  hooks: {
    getVueLoaderOptions: SyncWaterfallHook
  }
  private _writingRoutes?: boolean
  private _prevRoutes?: string
  renderer?: BundleRenderer

  constructor() {
    // In dev mode pages will be built when visited
    this.visitedRoutes = new Set()
    this.builtRoutes = new Set()

    this.hooks = {
      getVueLoaderOptions: new SyncWaterfallHook(['options'])
    }
  }

  init(api: Saber) {
    this.api = api

    this.api.hooks.chainWebpack.tap(ID, (config, { type }) => {
      config.entry(type).add(resolveVueApp(`entry-${type}.js`))

      config.output.path(api.resolveCache(`dist-${type}`))

      config.resolve.extensions.merge(['.vue'])

      // Use locally installed Vue if possible
      if (api.hasDependency('vue')) {
        config.resolve.alias.set(
          'vue',
          path.dirname(api.localResolve('vue/package.json')!)
        )
      } else {
        // Otherwise use the one shipped with Saber
        config.resolve.alias.set(
          'vue',
          path.dirname(require.resolve('vue/package.json'))
        )
      }

      config.plugin('vue').use(require('vue-loader/lib/plugin'))

      // Transform js files in vue-app folder
      config.module.rule('js').include.add(resolveVueApp())

      const vueLoaderOptions = this.hooks.getVueLoaderOptions.call(
        Object.assign(
          {
            compilerOptions: {
              modules: []
            },
            transformAssetUrls: {},
            prettify: false
          },
          api.webpackUtils.getCacheOptions('vue-loader', () => ({
            // Increse `key` to invalid cache
            key: 0,
            type,
            'vue-loader': require('vue-loader/package.json').version,
            'vue-template-compiler': require('vue-template-compiler/package.json')
              .version
          }))
        )
      )

      const pageLoaderOptions = {
        getPageById: (pageId: string) => api.pages.store.by('id', pageId),
        getTransformerByContentType: (contentType: string) =>
          api.transformers.get(contentType),
        resolveCache: api.resolveCache.bind(api)
      }
      const pagePropLoaderOptions = {
        getPagePublicFields: api.pages.getPagePublicFields.bind(api.pages)
      }

      config.module
        .rule('transform-template')
        .resourceQuery(/\?vue&type=template/)
        .use('transform-template-loader')
        .loader(require.resolve('./transform-template-loader'))
        .options({
          plugins: require('./template-plugins')(api)
        })

      // Add `saber-page` rule under `js` rule to handle .js pages
      // prettier-ignore
      config.module
        .rule('js')
        .oneOf('saber-page')
          .before('normal')
          .resourceQuery(query => {
            return /saberPage/.test(query) && !/type=script/.test(query)
          })
          .use('vue-loader')
            .loader('vue-loader')
            .options(vueLoaderOptions)
            .end()
          .use('saber-page-loader')
            .loader(require.resolve('./saber-page-loader'))
            .options(pageLoaderOptions)

      // Handle .vue components and .vue pages
      // prettier-ignore
      config.module.rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
          .loader('vue-loader')
          .options(vueLoaderOptions)
          .end()
        // saber-page-loader will return original content
        // if the resource query doesn't contain `saberPage`
        .use('saber-page-loader')
          .loader(require.resolve('./saber-page-loader'))
          .options(pageLoaderOptions)

      // Get the available extensions for pages
      // Excluding .vue and .js pages because we handled them in their own rules
      const { supportedExtensions } = api.transformers
      const pageExtensions = supportedExtensions
        .map(ext => new RegExp(`\\.${ext}$`))
        .filter(re => !re.test('.js') && !re.test('.vue'))
        .concat(/\.saberpage$/)

      config.module
        .rule('saber-page')
        .test(pageExtensions)
        .resourceQuery(query => {
          return /saberPage/.test(query)
        })
        .use('vue-loader')
        .loader('vue-loader')
        .options(vueLoaderOptions)
        .end()
        .use('saber-page-loader')
        .loader(require.resolve('./saber-page-loader'))
        .options(pageLoaderOptions)

      // Handle `<page-prop>` block in .vue file
      config.module
        .rule('page-prop')
        .type('javascript/auto')
        .resourceQuery(/blockType=page-prop/)
        .use('page-prop-loader')
        .loader(require.resolve('./page-prop-loader'))
        .options(pagePropLoaderOptions)

      if (type === 'server') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/server-plugin'), [
            {
              filename: '../bundle-manifest/server.json'
            }
          ])

        const externals = config.get('externals') || []
        config.externals(
          externals.concat([
            require('webpack-node-externals')({
              whitelist: [
                'saber/config',
                'saber/variables',
                /\.(?!(?:jsx?|json)$).{1,5}(\?.+)?$/i
              ]
            })
          ])
        )
      } else if (type === 'client') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/client-plugin'), [
            {
              filename: '../bundle-manifest/client.json'
            }
          ])
      }
    })

    api.hooks.emitRoutes.tapPromise('vue-renderer', () => this.writeRoutes())
  }

  get defaultTheme() {
    return resolveVueApp('theme')
  }

  async writeRoutes() {
    if (this._writingRoutes) {
      return
    }

    this._writingRoutes = true

    const pages = this.api.pages.store.find()

    const routesFromPages = pages
      .map(page => {
        const relativePath = slash(page.internal.relative!)
        const absolutePath = slash(page.internal.absolute!)
        const chunkNameComment = `/* webpackChunkName: "page--${
          page.internal.isFile
            ? path
                .relative(this.api.resolveCwd('pages'), absolutePath)
                .replace(/[^a-z0-9_-]/gi, '-')
            : page.id
        }" */ `
        // Always give the path a resource query
        const componentPath = page.internal.isFile
          ? `${absolutePath}?saberPage=${page.id}`
          : `#cache/pages/${page.id}.saberpage?saberPage=${page.id}`
        return `{
          path: ${JSON.stringify(page.permalink)},
          meta: {
            __relative: '${relativePath}',
            __pageId: '${page.id}'
          },
          component: function() {
            ${
              this.api.lazy && !this.visitedRoutes.has(page.permalink)
                ? `return Promise.resolve({render: function(h){return h('div', {}, ['Please refresh..'])}})`
                : `
            return import(${chunkNameComment}${JSON.stringify(componentPath)})
            `
            }
          }
        }`
      })
      .join(',\n')

    const redirectRoutesInBrowser = [...this.api.pages.redirectRoutes.values()]
      .filter(route => route.redirectInBrowser)
      .map(
        route => `{ path: '${route.fromPath}', redirect: '${route.toPath}' }`
      )
      .join(',\n')

    const routes = `
    export default [
      ${routesFromPages ? `${routesFromPages},` : ''}
      ${redirectRoutesInBrowser ? `${redirectRoutesInBrowser},` : ''}
      // An addtional route to catch all other requests, i.e. 404 page
      {
        path: '*',
        name: 404,
        component: function () {
          return import(/* webpackChunkName: "404-page" */ ${JSON.stringify(
            slash(resolveVueApp('404.vue'))
          )})
        }
      }
    ]`

    if (routes !== this._prevRoutes) {
      this._prevRoutes = routes
      await fs.outputFile(this.api.resolveCache('routes.js'), routes, 'utf8')
    }

    this._writingRoutes = false
  }

  async build() {
    const clientConfig = this.api.getWebpackConfig({ type: 'client' })
    const serverConfig = this.api.getWebpackConfig({ type: 'server' })

    // Remove dist-client
    await fs.remove(this.api.resolveCache('dist-client'))

    const webpack: typeof import('webpack') = require('webpack')

    const clientCompiler = webpack(clientConfig)
    const serverCompiler = webpack(serverConfig)
    await Promise.all([
      runCompiler(clientCompiler),
      runCompiler(serverCompiler)
    ])
  }

  async initRenderer({
    clientManifest,
    serverBundle
  }: {
    clientManifest: any
    serverBundle: any
  }) {
    const {
      createBundleRenderer
    }: typeof import('vue-server-renderer') = require('vue-server-renderer')

    const isFirstTime = !this.renderer

    if (serverBundle && clientManifest) {
      log.verbose(`Creating server renderer`)
      this.renderer = createBundleRenderer(serverBundle, {
        clientManifest,
        runInNewContext: false,
        inject: false,
        basedir: this.api.resolveCache('dist-server')
      })
    }

    await this.api.hooks.postCreateRenderer.promise(this.renderer, isFirstTime)

    return this.renderer
  }

  async renderPageContent(url: string, { scoped = false } = {}) {
    if (!this.renderer) {
      throw new Error(`Vue renderer hasn't been initialized!`)
    }
    const random = 'asdhkBJKAbjkf@3^1_a=--+'
    const startingMark = `__mark_page_content_start__${random}`
    const endingMark = `__mark_page_content_stop__${random}`
    const context = {
      url,
      markPageContent: [startingMark, endingMark]
    }
    const html = await this.renderer.renderToString(context)
    const content = html.slice(
      html.indexOf(startingMark) + startingMark.length,
      html.indexOf(endingMark)
    )

    return scoped
      ? content
      : content.replace(/((?: data-v-[a-z0-9]{8})+)>/gm, '>')
  }

  async generate() {
    const outDir = this.api.resolveOutDir()

    // Remove output directory
    await fs.remove(outDir)

    const serverBundle = readJSON(
      this.api.resolveCache('bundle-manifest/server.json')
    )
    const clientManifest = readJSON(
      this.api.resolveCache('bundle-manifest/client.json')
    )
    const renderer = await this.initRenderer({ serverBundle, clientManifest })

    const getOutputFilePath = (permalink: string) => {
      const filename = permalink.endsWith('.html')
        ? permalink
        : permalink.replace(/\/?$/, '/index.html')
      return path.join(outDir, filename)
    }

    const writeFiles = (
      routes: Array<{ permalink: string; outputFilePath: string }>
    ) =>
      Promise.all(
        routes.map(async route => {
          log.info('Generating', path.relative(outDir, route.outputFilePath))
          try {
            const { context, html } = await renderHTML(renderer, {
              url: route.permalink,
              isProd: true,
              hooks: this.api.hooks
            })
            const exportedPage = {
              content: html,
              path: route.outputFilePath
            }
            await this.api.hooks.preExportPage.promise(context, exportedPage)
            await fs.outputFile(route.outputFilePath, html, 'utf8')
            await this.api.hooks.postExportPage.promise(context, exportedPage)
          } catch (error) {
            log.error(`Failed to render ${route.permalink}`)
            throw error
          }
        })
      )

    await writeFiles(
      [
        ...this.api.pages.store.find(),
        {
          permalink: '/__never_existed__.html',
          outputFilePath: '404.html'
        }
      ].map(page => ({
        permalink: page.permalink,
        outputFilePath: getOutputFilePath(page.outputFilePath || page.permalink)
      }))
    )

    // Copy .saber/dist-client/ to public/_saber/
    await fs.copy(
      this.api.resolveCache('dist-client'),
      path.join(outDir, '_saber')
    )

    // Copy static files to outDir
    const copyStaticFiles = async (dir: string) => {
      if (await fs.pathExists(dir)) {
        await fs.copy(dir, outDir)
      }
    }

    // Copy files in $theme/static/ to the root of public/
    await copyStaticFiles(path.join(this.api.theme, 'static'))
    // Copy files in static/ to the root of public/
    await copyStaticFiles(this.api.resolveCwd('static'))
  }

  getRequestHandler() {
    const webpack: typeof import('webpack') = require('webpack')
    const server: ReturnType<typeof import('polka')> = require('polka')()
    const createDevMiddleware: typeof import('webpack-dev-middleware') = require('webpack-dev-middleware')
    const createHotMiddleware: typeof import('webpack-hot-middleware') = require('webpack-hot-middleware')

    this.api.hooks.postCreateServer.call(server)

    const clientConfig = this.api.getWebpackConfig({ type: 'client' })

    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

    const clientCompiler = webpack(clientConfig)

    const devMiddleware = createDevMiddleware(clientCompiler as any, {
      logLevel: 'silent',
      publicPath: clientConfig.output.publicPath
    })

    const hotMiddleware = createHotMiddleware(clientCompiler as any, {
      log: false
    })

    const serverConfig = this.api.getWebpackConfig({ type: 'server' })
    const serverCompiler = webpack(serverConfig)
    // @ts-ignore
    const mfs = new webpack.MemoryOutputFileSystem()
    serverCompiler.outputFileSystem = mfs

    let serverBundle: any
    let clientManifest: any

    type AllCompilers = { ready?: boolean; hasError?: boolean }
    type AllCompilersReadyHandler = (allCompilers: AllCompilers) => void

    const onceAllCompilersAreReady = (handler: AllCompilersReadyHandler) => {
      const listener = ({ allCompilers }: { allCompilers: AllCompilers }) => {
        if (allCompilers.ready) {
          Object.values(this.api.compilers).forEach(compiler => {
            compiler.off('status-changed', listener)
          })
          handler(allCompilers)
        }
      }

      Object.values(this.api.compilers).forEach(compiler => {
        compiler.on('status-changed', listener)
      })
    }

    this.api.compilers.server.on('status-changed', ({ status }) => {
      if (status === 'success') {
        serverBundle = readJSON(
          this.api.resolveCache('bundle-manifest/server.json'),
          mfs.readFileSync.bind(mfs)
        )
        this.initRenderer({ serverBundle, clientManifest })
      }
    })

    this.api.compilers.client.on('status-changed', ({ status }) => {
      if (status === 'success') {
        clientManifest = readJSON(
          this.api.resolveCache('bundle-manifest/client.json'),
          // @ts-ignore
          clientCompiler.outputFileSystem.readFileSync.bind(
            clientCompiler.outputFileSystem
          )
        )
        this.initRenderer({ serverBundle, clientManifest })
      }
    })

    serverCompiler.watch({}, error => {
      if (error) {
        console.error(error)
      }
    })

    server.get('/_saber/pages', (_, res) => {
      res.setHeader('content-type', 'text/html')
      res.end(`
      <script>
      window.pages = ${require('devalue')(this.api.pages.store.find())}
      console.log(pages)
      </script>
      `)
    })

    server.get('/_saber/visit-page', async (req, res) => {
      // eslint-disable-next-line
      let [, pathname, hash] =
        /^([^#]+)(#.+)?$/.exec(req.query.route as string) || []
      pathname = removeTrailingSlash(pathname)
      const fullPath = pathname + (hash || '')

      res.end()

      if (this.builtRoutes.has(pathname)) {
        log.info(`Navigating to ${fullPath}`)
        hotMiddleware.publish({
          action: 'router:push',
          route: fullPath,
          id: req.query.id,
          alreadyBuilt: true
        })
      } else {
        log.info(`Compiling ${fullPath}`)
        onceAllCompilersAreReady(({ hasError }) => {
          log.info(`Navigating to ${fullPath}`)
          this.builtRoutes.add(pathname)
          hotMiddleware.publish({
            action: 'router:push',
            route: fullPath,
            id: req.query.id,
            hasError
          })
        })
        this.visitedRoutes.add(pathname)
        await this.writeRoutes()
      }
    })

    server.use(
      require('serve-static')(this.api.resolveCwd('static'), {
        dotfiles: 'allow'
      })
    )
    server.use(
      require('serve-static')(path.join(this.api.theme, 'static'), {
        dotfiles: 'allow'
      })
    )

    server.use(devMiddleware)
    server.use(hotMiddleware)

    server.get('*', async (req, res) => {
      if (!req.headers.accept || !req.headers.accept.includes('text/html')) {
        res.statusCode = 404
        return res.end('404')
      }

      if (!this.renderer) {
        return res.end(`Please wait for compilation and refresh..`)
      }

      const render = async () => {
        log.verbose(`Rendering page ${req.url}`)

        const { html } = await renderHTML(this.renderer, {
          url: req.url,
          isProd: false,
          hooks: this.api.hooks
        })

        res.setHeader('content-type', 'text/html')
        res.end(html)
      }

      if (!this.api.lazy) {
        return render()
      }

      const pathname = removeTrailingSlash(decodeURI(req.path))

      if (this.builtRoutes.has(pathname)) {
        render()
      } else {
        onceAllCompilersAreReady(() => {
          this.builtRoutes.add(pathname)
          render()
        })
        this.visitedRoutes.add(pathname)
        await this.writeRoutes()
      }
    })

    return server.handler.bind(server)
  }
}
