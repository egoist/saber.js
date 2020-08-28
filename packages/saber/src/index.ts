import path from 'path'
import http from 'http'
import { fs } from 'saber-utils'
import { log, colors, Log } from 'saber-log'
import resolveFrom from 'resolve-from'
import merge from 'lodash.merge'
import getPort from 'get-port'
import { Pages } from './Pages'
import { BrowserApi } from './BrowserApi'
import { Transformers } from './Transformers'
import configLoader from './utils/configLoader'
import resolvePackage from './utils/resolvePackage'
import builtinPlugins from './plugins'
import { Compiler } from './Compiler'
import { WebpackUtils } from './WebpackUtils'
import { hooks } from './hooks'
import { VueRenderer } from './vue-renderer'
import { validateConfig, ValidatedSaberConfig } from './utils/validateConfig'
import {
  SaberOptions,
  SaberConfig,
  SaberConstructorOptions,
  SaberPlugin,
  ResolvedSaberPlugin,
  WebpackContext
} from './types'
import { DataStore } from './DataStore'

export { SaberConfig, SaberConstructorOptions, SaberPlugin }

export class Saber {
  opts: SaberOptions
  initialConfig: SaberConfig
  config: ValidatedSaberConfig
  pages: Pages
  browserApi: BrowserApi
  webpackUtils: WebpackUtils
  log: Log
  colors: typeof colors
  utils: typeof import('saber-utils')
  hooks: typeof hooks
  transformers: Transformers
  runtimePolyfills: Set<string>
  dataStore: DataStore
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
  theme: string
  actualServerPort?: number

  constructor(opts: SaberConstructorOptions = {}, config: SaberConfig = {}) {
    this.opts = {
      ...opts,
      cwd: path.resolve(opts.cwd || '.')
    }
    this.initialConfig = config
    this.pages = new Pages(this)
    this.browserApi = new BrowserApi(this)
    this.webpackUtils = new WebpackUtils(this)
    this.dataStore = new DataStore()
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

    // Load Saber config
    const loadedConfig = this.loadConfig()
    this.config = loadedConfig.config
    this.configPath = loadedConfig.configPath
    this.configDir = this.configPath && path.dirname(this.configPath)
    if (this.configPath) {
      log.info(
        `Using config file: ${colors.dim(
          path.relative(process.cwd(), this.configPath)
        )}`
      )
    }

    this.renderer = new VueRenderer()
    this.renderer.init(this)

    // Load theme
    if (this.config.theme) {
      this.theme = resolvePackage(this.config.theme, {
        cwd: this.configDir || this.opts.cwd,
        prefix: 'saber-theme-'
      })
      // When a theme is loaded from `node_modules` and `$theme/dist` directory exists
      // We use the `dist` directory instead
      if (this.theme.includes('node_modules')) {
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
  }

  loadConfig(configFiles = configLoader.CONFIG_FILES) {
    const { data, path: configPath } = configLoader.load({
      files: configFiles,
      cwd: this.opts.cwd
    })
    return {
      config: validateConfig(merge({}, data, this.initialConfig), {
        dev: this.dev
      }),
      configPath
    }
  }

  setConfig(config: ValidatedSaberConfig, configPath?: string) {
    this.config = config
    this.configPath = configPath
    this.configDir = configPath && path.dirname(configPath)
  }

  get dev() {
    return Boolean(this.opts.dev)
  }

  get lazy() {
    return this.dev && this.config.build.lazy
  }

  async prepare() {
    // Load built-in plugins
    for (const plugin of builtinPlugins) {
      const resolvedPlugin = require(plugin.resolve)
      await this.applyPlugin(resolvedPlugin.default || resolvedPlugin)
    }

    // Load user plugins
    await this.hooks.prePlugins.promise()

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

    await this.hooks.postPlugins.promise()
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

            const location = resolveFrom(this.configDir as string, p.resolve)

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
    return this.resolveCwd(this.config.build.outDir, ...args)
  }

  getWebpackConfig(opts: WebpackContext) {
    opts = Object.assign({ type: 'client' }, opts)
    const chain = require('./webpack/webpack.config').default(this, opts)
    this.hooks.chainWebpack.call(chain, opts)
    const config = this.hooks.getWebpackConfig.call(chain.toConfig(), opts)

    if (this.opts.inspectWebpack) {
      require('./utils/inspectWebpack').default(config, opts.type)
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

    const server = http.createServer(
      this.renderer.getRequestHandler() as http.RequestListener
    )

    // Make sure the port is available
    const { host, port = 3000 } = this.config.server
    this.actualServerPort = await getPort({
      port: getPort.makeRange(port, port + 1000),
      host
    })

    server.listen(this.actualServerPort, host)
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

  localResolve(name: string): string | null {
    return require('resolve-from').silent(this.opts.cwd, name)
  }

  localRequire<T = any>(name: string): T {
    const resolved = this.localResolve(name)
    return resolved && require(resolved)
  }
}

export const createSaber = (
  opts: SaberConstructorOptions,
  config: SaberConfig
) => new Saber(opts, config)
