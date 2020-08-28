const path = require('path')
const babelLoader = require('babel-loader')
const { log } = require('saber-log')
const logUpdate = require('log-update')

// increment '0' to invalidate cache
const CACHE_KEY = `babel-cache-0`

module.exports = babelLoader.custom(babel => {
  const configs = new Set()

  return {
    customOptions(opts) {
      const custom = opts.customLoaderOptions
      const filename = path.join(custom.cwd, 'noop.js')
      const loader = Object.assign(
        custom.shouldCache
          ? {
              cacheCompression: false,
              cacheDirectory: path.join(
                custom.distDir,
                'cache',
                'saber-babel-loader'
              ),
              cacheIdentifier: JSON.stringify({
                key: CACHE_KEY,
                type: custom.type,
                config: babel.loadPartialConfig({
                  filename,
                  cwd: custom.cwd,
                  sourceFileName: filename
                }).options
              })
            }
          : {},
        opts
      )
      delete loader.customLoaderOptions

      return { loader, custom }
    },
    config(cfg, { customOptions }) {
      const options = Object.assign({}, cfg.options)
      if (cfg.hasFilesystemConfig()) {
        for (const file of [cfg.babelrc, cfg.config]) {
          if (file && !configs.has(file)) {
            configs.add(file)
            if (log.logLevel > 3) {
              logUpdate.clear()
              log.verbose(`Applying Babel config file ${file}`)
            }
          }
        }
      }

      const { filename = '' } = cfg.options
      options.presets.unshift(
        babel.createConfigItem(
          [
            require('../babel/preset'),
            {
              isServer: customOptions.type === 'server',
              // Like ts-loader's `appendTsSuffixTo: [/\.vue$/]` option
              alwaysEnableTypeScript: filename.endsWith('.vue')
                ? true
                : undefined
            }
          ],
          {
            type: 'preset'
          }
        )
      )

      return options
    }
  }
})
