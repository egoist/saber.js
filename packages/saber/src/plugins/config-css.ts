import { log, colors } from 'saber-log'
import logUpdate from 'log-update'
import merge from 'lodash.merge'
import { SaberPlugin, TODO } from '../types'
import { Rule } from 'webpack-chain'
import getFileNames from '../utils/getFileNames'

const ID = 'builtin:config-css'

const plugin: SaberPlugin = {
  name: ID,
  apply(api) {
    api.hooks.chainWebpack.tap(ID, (config, { type }) => {
      const {
        extractCSS,
        loaderOptions,
        cssSourceMap: sourceMap
      } = api.config.build
      const isServer = type === 'server'
      // Disable CSS extraction in dev mode for better build performance(?)
      const shouldExtract = extractCSS && !api.dev
      // if building for production but not extracting CSS, we need to minimize
      // the embbeded inline CSS as they will not be going through the optimizing
      // plugin.
      const needInlineMinification = !api.dev && !shouldExtract
      const fileNames = getFileNames(!api.dev)

      const cssnanoOptions: any = {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      }
      if (sourceMap) {
        cssnanoOptions.map = { inline: false }
      }

      const extractOptions = {
        filename: fileNames.css,
        chunkFilename: fileNames.css.replace(/\.css$/, '.chunk.css')
      }

      const createCSSRule = (
        lang: string,
        test: RegExp,
        loader?: string,
        options?: any
      ) => {
        const applyLoaders = (rule: Rule | Rule<Rule>, modules: boolean) => {
          if (shouldExtract && !isServer) {
            rule
              .use('extract-css-loader')
              .loader(require('mini-css-extract-plugin').loader)
              .options({
                // only enable hot in development
                hmr: process.env.NODE_ENV === 'development',
                // if hmr does not work, this is a forceful method.
                reloadAll: true
              })
          } else {
            rule
              .use('vue-style-loader')
              .loader(require.resolve('vue-style-loader'))
              .options({
                sourceMap
              })
          }

          const cssLoaderOptions = Object.assign(
            {
              sourceMap,
              modules,
              localIdentName: '[local]_[hash:base64:5]',
              importLoaders:
                1 + // stylePostLoader injected by vue-loader
                1 + // postcss-loader
                (needInlineMinification ? 1 : 0),
              exportOnlyLocals: isServer && shouldExtract
            },
            loaderOptions.css
          )

          rule
            .use('css-loader')
            .loader(require.resolve('css-loader'))
            .options(cssLoaderOptions)

          if (needInlineMinification) {
            rule
              .use('minify-inline-css')
              .loader(require.resolve('@egoist/postcss-loader'))
              .options({
                plugins: [require('cssnano')(cssnanoOptions)]
              })
          }

          rule
            .use('postcss-loader')
            .loader(require.resolve('@egoist/postcss-loader'))
            .options(
              Object.assign(
                {
                  sourceMap,
                  onConfigFile(configFile: string, resourcePath: string) {
                    if (log.logLevel > 3) {
                      logUpdate.clear()
                      log.verbose(
                        `Applying PostCSS config file ${configFile} to:`
                      )
                      log.verbose(colors.dim(resourcePath))
                    }
                  }
                },
                loaderOptions.postcss
              )
            )

          if (loader) {
            rule
              .use(loader)
              .loader(loader)
              .options(Object.assign({ sourceMap }, options))
          }
        }

        const baseRule = config.module.rule(lang).test(test)

        // rules for <style lang="module">
        const vueModulesRule = baseRule
          .oneOf('vue-modules')
          .resourceQuery(/module/)
        applyLoaders(vueModulesRule, true)

        // rules for <style>
        const vueNormalRule = baseRule.oneOf('vue').resourceQuery(/\?vue/)
        applyLoaders(vueNormalRule, false)

        // rules for *.module.* files
        const extModulesRule = baseRule
          .oneOf('normal-modules')
          .test(/\.module\.\w+$/)
        applyLoaders(extModulesRule, true)

        // rules for normal CSS imports
        const normalRule = baseRule.oneOf('normal')
        applyLoaders(normalRule, false)
      }

      if (shouldExtract && !isServer) {
        config
          .plugin('extract-css')
          .use(require('mini-css-extract-plugin'), [extractOptions])

        const splitChunks = config.optimization.get('splitChunks')
        config.optimization.splitChunks(
          merge({}, splitChunks, {
            cacheGroups: {
              styles: {
                name: 'styles',
                // necessary to ensure async chunks are also extracted
                test: (m: TODO) => {
                  return m.type && m.type.includes('css/mini-extract')
                },
                chunks: 'all',
                enforce: true
              }
            }
          })
        )

        const OptimizeCSSPlugin = require('@intervolga/optimize-cssnano-plugin')
        config.plugin('optimize-css').use(OptimizeCSSPlugin, [
          {
            sourceMap,
            cssnanoOptions
          }
        ])
      }

      createCSSRule('css', /\.css$/)
      createCSSRule('postcss', /\.p(ost)?css$/)

      const sassImplementation = api.hasDependency('sass')
        ? api.localRequire('sass')
        : undefined
      createCSSRule(
        'scss',
        /\.scss$/,
        'sass-loader',
        Object.assign(
          {
            implementation: sassImplementation
          },
          loaderOptions.sass
        )
      )
      createCSSRule(
        'sass',
        /\.sass$/,
        'sass-loader',
        Object.assign(
          {
            indentedSyntax: true,
            implementation: sassImplementation
          },
          loaderOptions.sass
        )
      )

      createCSSRule('less', /\.less$/, 'less-loader', loaderOptions.less)
      createCSSRule(
        'stylus',
        /\.styl(us)?$/,
        'stylus-loader',
        Object.assign(
          {
            preferPathResolver: 'webpack'
          },
          loaderOptions.stylus
        )
      )
    })
  }
}

export default plugin
