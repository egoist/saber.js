import path from 'path'
import Config from 'webpack-chain'
import getFileNames from '../utils/getFileNames'
import { Saber } from '..'
import PrintStatusPlugin from './plugins/PrintStatusPlugin'

export default (api: Saber, { type }: { type: 'server' | 'client' }) => {
  const config = new Config()

  config.mode(api.dev ? 'development' : 'production')
  config.devtool(
    type === 'server'
      ? 'source-map'
      : api.dev
      ? 'cheap-module-source-map'
      : false
  )

  const fileNames = getFileNames(!api.dev)

  config.output
    .publicPath(`${api.config.build.publicUrl}_saber/`)
    .filename(fileNames.js)

  config.resolve.extensions.merge(['.mjs', '.js', '.json', '.wasm'])

  // Disable performance hints
  config.performance.hints(false)

  if (type === 'server') {
    config.output.libraryTarget('commonjs2')
    config.target('node')
  }

  config.resolve.alias.set('#pages', api.resolveCwd('pages'))
  config.resolve.alias.set('#cache', api.resolveCwd('.saber'))
  config.resolve.alias.set('#theme', api.theme)
  config.resolve.alias.set('@', api.opts.cwd)
  config.resolve.alias.set('saber-config$', api.resolveCache('config.json'))
  config.resolve.alias.set('saber/config$', api.resolveCache('config.json'))
  config.resolve.alias.set(
    'saber/variables$',
    api.resolveCache('variables.json')
  )

  const ownModulesDir = path.join(
    path.dirname(require.resolve('vue/package')),
    '..'
  )
  config.resolve.modules.add('node_modules').add(ownModulesDir)
  config.resolveLoader.modules.add('node_modules').add(ownModulesDir)

  config.module
    .rule('js')
    .test(/\.js$/)
    .include.add(filepath => {
      if (api.browserApi.has(filepath)) {
        return true
      }

      if (/node_modules/.test(filepath)) {
        return false
      }

      return true
    })
    .end()
    .oneOf('normal')
    .use('babel-loader')
    .loader(require.resolve('./loaders/babel-loader'))
    .options({
      customLoaderOptions: {
        distDir: api.resolveCache(),
        cwd: api.resolveCwd(),
        shouldCache: api.webpackUtils.shouldCache,
        type
      }
    })

  config.plugin('timefix').use(require('time-fix-plugin'))

  config.plugin('envs').use(require('webpack').DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(config.get('mode'))
    }
  ])

  config.plugin('constants').use(require('webpack').DefinePlugin, [
    {
      'process.browser': type === 'client',
      'process.client': type === 'client',
      'process.server': type === 'server',
      __DEV__: api.dev,
      __PUBLIC_URL__: JSON.stringify(api.config.build.publicUrl),
      __LAZY__: api.config.build.lazy && api.dev,
      __SABER_VERSION__: JSON.stringify(require('../../package.json').version)
    }
  ])

  config.plugin('print-status').use(PrintStatusPlugin, [
    {
      api,
      type
    }
  ])

  if (api.compilers[type]) {
    api.compilers[type].injectToWebpack(config)
  }

  return config
}
