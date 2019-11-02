/// <reference path="../declarations.d.ts" />
import path from 'path'
import http from 'http'
import { fs } from 'saber-utils'
import { log, colors, Log } from 'saber-log'
import resolveFrom from 'resolve-from'
import merge from 'lodash.merge'
import getPort from 'get-port'
import { Pages, IPage, ICreatePageInput } from './Pages'
import { BrowserApi } from './BrowserApi'
import { Transformers } from './Transformers'
import configLoader from './utils/configLoader'
import resolvePackage from './utils/resolvePackage'
import builtinPlugins from './plugins'
import { Compiler } from './Compiler'
import { WebpackUtils } from './WebpackUtils'
import { hooks } from './hooks'
import { VueRenderer } from './vue-renderer'

export interface SaberConstructorOptions {
  cwd?: string
  verbose?: boolean
  dev?: boolean
  inspectWebpack?: boolean
}

export interface SaberOptions {
  cwd: string
  verbose?: boolean
  dev?: boolean
  inspectWebpack?: boolean
}

export interface SiteConfig {
  /** Apply to <html> tag */
  lang: string
  [k: string]: any
}

export interface ThemeConfig {
  [k: string]: any
}

export interface SaberPlugin {
  name: string
  apply: (api: Saber, options: any) => void | Promise<void>
  filterPlugins?: (
    plugins: ResolvedSaberPlugin[],
    options?: any
  ) => ResolvedSaberPlugin[]
}

export interface SaberConfigPlugin {
  resolve: string
  options?: { [k: string]: any }
}

export interface ResolvedSaberPlugin extends SaberPlugin {
  location: string
  options?: any
}

export interface WebpackContext {
  type: 'client' | 'server'
  [k: string]: any
}

export type PageType = 'page' | 'post'

export interface Permalinks {
  /**
   * Permalink format for normal pages
   * @default `/:slug.html`
   */
  page?: string
  /**
   * Permalink format for posts
   * @default `/posts/:slug.html`
   */
  post?: string
}

export interface SaberConfig {
  /** The path or name of your theme */
  theme?: string
  siteConfig?: SiteConfig
  themeConfig?: object
  locales?: {
    [localePath: string]: {
      siteConfig?: SiteConfig
      themeConfig?: ThemeConfig
    }
  }
  /**
   * Customize permalink format based on page types (page or post)
   */
  permalinks?: Permalinks | ((page: ICreatePageInput) => Permalinks)
  /** Build configurations */
  build?: {
    /**
     * The path to output generated files
     * Defaul to `./public`
     */
    outDir?: string
    /**
     * The root path where your website is localed
     * Default to `/`
     */
    publicUrl?: string
    /**
     * Extract CSS into standalone files
     * Default to `false`
     */
    extractCSS?: boolean
    /**
     * Toggle sourcemap for CSS
     * Default to `false`
     */
    cssSourceMap?: boolean
    /**
     * Options for CSS loaders
     */
    loaderOptions?: {
      /** sass-loader */
      sass?: any
      /** less-loader */
      less?: any
      /** stylus-loader */
      stylus?: any
      /** css-loader */
      css?: any
      /** postcss-loader */
      postcss?: any
    }
    /**
     * Toggle cache for webpack
     * Default to `true`
     */
    cache?: boolean
    /**
     * Compile pages on demand
     * @beta
     */
    lazy?: boolean
  }
  server?: {
    host?: string
    port?: number
  }
  plugins?: Array<string | SaberConfigPlugin>
  markdown?: {
    /** The path to a module or npm package name that slugifies the markdown headers. */
    slugify?: string
    /**
     * Options for the internal markdown-it plugin for generating markdown headings and heading anchors.
     */
    headings?: {
      /**
       * Inject markdown headings as `page.markdownHeadings`
       * @default `true`
       */
      markdownHeadings?: boolean
      /**
       * Generating permalinks
       * @default `false`
       */
      permalink?: boolean
      permalinkComponent?: string
      /**
       * Inject permalink before heading text.
       * @default `true`
       */
      permalinkBefore?: string
      /**
       * The permalink symbol.
       * @default `'#'`
       */
      permalinkSymbol?: string
    }
    /**
     * Show line numbers in code blocks
     * @default `false`
     */
    lineNumbers?: boolean
    /** markdown-it plugins */
    plugins?: MarkdownPlugin[]
    /** markdown-it options */
    options?: {
      [k: string]: any
    }
  }
  template?: {
    /**
     * Whether to open external links in new tab.
     * @default `true`
     */
    openLinkInNewTab?: boolean
    /**
     * A set of plugins that are used to transform Vue template.
     */
    plugins?: any[]
  }
}

export interface MarkdownPlugin {
  resolve: string
  options?: {
    [k: string]: any
  }
}

export class Saber {
  opts: SaberOptions
  initialConfig: SaberConfig
  // @ts-ignore
  config: Required<SaberConfig>
  pages: Pages
  browserApi: BrowserApi
  webpackUtils: WebpackUtils
  log: Log
  colors: typeof colors
  utils: typeof import('saber-utils')
  hooks: typeof hooks
  transformers: Transformers
  runtimePolyfills: Set<string>
  compilers: {
    [k: string]: Compiler
  }
  renderer: VueRenderer
  pkg: {
    path?: string
    data: {
      [k: string]: any
    }
  }
  configDir?: string
  configPath?: string
  theme?: string

  constructor(opts: SaberConstructorOptions = {}, config: SaberConfig = {}) {
    this.opts = {
      ...opts,
      cwd: path.resolve(opts.cwd || '.')
    }
    this.initialConfig = config
    this.pages = new Pages(this)
    this.browserApi = new BrowserApi(this)
    this.webpackUtils = new WebpackUtils(this)
    this.log = log
    this.colors = colors
    this.utils = require('saber-utils')
    this.hooks = hooks

    this.transformers = new Transformers()
    this.runtimePolyfills = new Set()
    this.compilers = {
      server: new Compiler('server', this),
      client: new Compiler('client', this)
    }

    const hookNames = Object.keys(this.hooks) as Array<keyof typeof hooks>
    for (const hook of hookNames) {
      const ignoreNames = ['theme-node-api', 'user-node-api']
      this.hooks[hook].intercept({
        register(tapInfo) {
          const { fn, name } = tapInfo
          tapInfo.fn = (...args: any[]) => {
            if (!ignoreNames.includes(name)) {
              const msg = `${hook} ${colors.dim(`(${name})`)}`
              log.verbose(msg)
            }

            return fn(...args)
          }

          return tapInfo
        }
      })
    }

    if (opts.verbose) {
      process.env.SABER_LOG_LEVEL = '4'
    }

    // Load package.json data
    const loadedPkg = configLoader.load({
      files: ['package.json'],
      cwd: this.opts.cwd
    })
    this.pkg = {
      ...loadedPkg,
      data: loadedPkg.data || {}
    }

    // To make TypeScript happy
    // We actually initialize them in `prepare()`
    // TODO: find a better way
    this.configDir = ''
    this.configPath = ''

    this.renderer = new VueRenderer()
  }

  get dev() {
    return Boolean(this.opts.dev)
  }

  get lazy() {
    return this.dev && this.config.build.lazy
  }

  async prepare() {
    // Load Saber config
    const { data: config, path: configPath } = configLoader.load({
      files: configLoader.CONFIG_FILES,
      cwd: this.opts.cwd
    })

    await this.setConfig(config, configPath)

    if (this.configPath) {
      log.info(
        `Using config file: ${colors.dim(
          path.relative(process.cwd(), this.configPath)
        )}`
      )
    }

    this.renderer.init(this)

    // Load theme
    if (this.config.theme) {
      this.theme = resolvePackage(this.config.theme, {
        cwd: this.configDir || this.opts.cwd,
        prefix: 'saber-theme-'
      })
      // When a theme is loaded from `node_modules` and `$theme/dist` directory exists
      // We use the `dist` directory instead
      if (/node_modules/.test(this.theme)) {
        const distDir = path.join(this.theme, 'dist')
        if (fs.existsSync(distDir)) {
          this.theme = distDir
        }
      }

      log.info(`Using theme: ${colors.dim(this.config.theme)}`)
      log.verbose(() => `Theme directory: ${colors.dim(this.theme)}`)
    } else {
      this.theme = this.renderer.defaultTheme
    }

    // Load built-in plugins
    for (const plugin of builtinPlugins) {
      await this.applyPlugin(require(plugin.resolve))
    }

    // Load user plugins
    await this.hooks.beforePlugins.promise()

    const userPlugins = this.getUserPlugins()
    if (userPlugins.length > 0) {
      log.info(
        `Using ${userPlugins.length} plugin${
          userPlugins.length > 1 ? 's' : ''
        } from config file`
      )
    }

    for (const plugin of userPlugins) {
      await this.applyPlugin(plugin, plugin.options, plugin.location)
    }

    await this.hooks.afterPlugins.promise()
  }

  async setConfig(config: SaberConfig, configPath = this.configPath) {
    this.configPath = configPath
    if (configPath) {
      this.configDir = path.dirname(configPath)
    } else {
      this.configDir = undefined
    }

    const initialRun = !this.config
    // @ts-ignore
    this.config = merge({}, config, this.initialConfig)
    // Validate config, apply default values, normalize some values
    this.config = require('./utils/validateConfig')(this.config, {
      dev: this.dev
    })

    // Make sure the port is available
    const { port } = this.config.server
    // @ts-ignore
    this.config.server._originalPort = port
    if (initialRun && port) {
      this.config.server.port = await getPort({
        port: getPort.makeRange(port, port + 1000),
        host: this.config.server.host
      })
    }
  }

  async applyPlugin(
    plugin: SaberPlugin,
    options?: any,
    pluginLocation?: string
  ) {
    await plugin.apply(this, options)

    if (!plugin.name.startsWith('builtin:')) {
      log.verbose(
        () =>
          `Using plugin "${colors.bold(plugin.name)}" ${
            pluginLocation ? colors.dim(pluginLocation) : ''
          }`
      )
    }
  }

  getUserPlugins() {
    // Plugins that are specified in user config, a.k.a. saber-config.js etc
    const plugins: ResolvedSaberPlugin[] =
      this.configDir && this.config.plugins
        ? this.config.plugins.map(p => {
            if (typeof p === 'string') {
              p = { resolve: p }
            }

            // Help!!!
            // @ts-ignore
            const location = resolveFrom(this.configDir, p.resolve)

            const resolvedPlugin = {
              ...require(location),
              location,
              options: p.options
            }

            return resolvedPlugin
          })
        : []

    const applyFilterPlugins = (
      plugins: ResolvedSaberPlugin[]
    ): ResolvedSaberPlugin[] => {
      type Handler = (plugins: ResolvedSaberPlugin[]) => ResolvedSaberPlugin[]
      const handlers = new Set<Handler>()

      for (const plugin of plugins) {
        const { filterPlugins, options } = plugin
        if (filterPlugins) {
          delete plugin.filterPlugins
          handlers.add(plugins => filterPlugins(plugins, options))
        }
      }

      if (handlers.size > 0) {
        for (const handler of handlers) {
          plugins = handler(plugins)
        }

        return applyFilterPlugins(plugins)
      }

      return plugins
    }

    return applyFilterPlugins(this.hooks.filterPlugins.call(plugins))
  }

  resolveCache(...args: string[]) {
    return this.resolveCwd('.saber', ...args)
  }

  resolveCwd(...args: string[]) {
    return path.resolve(this.opts.cwd, ...args)
  }

  resolveOwnDir(...args: string[]) {
    return path.join(__dirname, '../', ...args)
  }

  resolveOutDir(...args: string[]) {
    // @ts-ignore
    return this.resolveCwd(this.config.build.outDir, ...args)
  }

  getWebpackConfig(opts: WebpackContext) {
    opts = Object.assign({ type: 'client' }, opts)
    const chain = require('./webpack/webpack.config')(this, opts)
    this.hooks.chainWebpack.call(chain, opts)
    const config = this.hooks.getWebpackConfig.call(chain.toConfig(), opts)

    if (this.opts.inspectWebpack) {
      require('./utils/inspectWebpack')(config, opts.type)
    }

    return config
  }

  async run() {
    // Throw an error if both `public` and `.saber/public` exist
    // Because they are replaced by `static` and `public`
    // TODO: remove this error before v1.0
    const hasOldPublicFolder = await Promise.all([
      fs.pathExists(this.resolveCache('public')),
      fs.pathExists(this.resolveCwd('public')),
      fs.pathExists(this.resolveCwd('public/index.html'))
    ]).then(
      ([hasOldOutDir, hasPublicDir, hasNewPublicDir]) =>
        hasOldOutDir && hasPublicDir && !hasNewPublicDir
    )
    if (hasOldPublicFolder) {
      // Prevent from deleting public folder
      throw new Error(
        [
          `It seems you are using the ${colors.underline(
            colors.cyan('public')
          )} folder to store static files,`,
          ` this behavior has changed and now we use ${colors.underline(
            colors.cyan('static')
          )} folder for static files`,
          ` while ${colors.underline(
            colors.cyan('public')
          )} folder is used to output generated files,`,
          ` to prevent from unexpectedly deleting your ${colors.underline(
            colors.cyan('public')
          )} folder, please rename it to ${colors.underline(
            colors.cyan('static')
          )} and delete ${colors.underline(
            colors.cyan('.saber/public')
          )} folder as well`
        ].join('')
      )
    }

    await this.hooks.beforeRun.promise()

    await this.hooks.emitRoutes.promise()
  }

  // Build app in production mode
  async build(options: { skipCompilation?: boolean } = {}) {
    const { skipCompilation } = options
    await this.prepare()
    await this.run()

    if (!skipCompilation) {
      await this.renderer.build()
      await this.hooks.afterBuild.promise()
    }

    await this.renderer.generate()
    await this.hooks.afterGenerate.promise()
  }

  async serve() {
    await this.prepare()
    await this.run()

    const server = http.createServer(this.renderer.getRequestHandler())

    server.listen(this.config.server.port, this.config.server.host)
  }

  async serveOutDir() {
    await this.prepare()
    return require('./utils/serveDir')({
      dir: this.resolveOutDir(),
      host: this.config.server.host,
      port: this.config.server.port
    })
  }

  hasDependency(name: string) {
    return this.getDependencies().includes(name)
  }

  getDependencies() {
    return [
      ...Object.keys(this.pkg.data.dependencies || {}),
      ...Object.keys(this.pkg.data.devDependencies || {})
    ]
  }

  localResolve(name: string): string {
    return require('resolve-from').silent(this.opts.cwd, name)
  }

  localRequire(name: string): any {
    const resolved = this.localResolve(name)
    return resolved && require(resolved)
  }
}

export const createSaber = (
  opts: SaberConstructorOptions,
  config: SaberConfig
) => new Saber(opts, config)
