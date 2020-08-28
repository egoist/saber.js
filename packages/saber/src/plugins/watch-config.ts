import { fs } from 'saber-utils'
import { log } from 'saber-log'
import deepEqual from 'fast-deep-equal'
import { CONFIG_FILES } from '../utils/configLoader'
import { SaberPlugin, SaberConfig } from '../'

const ID = 'builtin:emit-config'

const WatchConfigPlugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.beforeRun.tapPromise(ID, async () => {
      const outPath = api.resolveCache('config.json')

      const emit = (config: SaberConfig) =>
        fs.outputFile(
          outPath,
          JSON.stringify({
            siteConfig: config.siteConfig || {},
            themeConfig: config.themeConfig || {},
            locales: config.locales || {}
          }),
          'utf8'
        )

      const checkIfConfigChanged = (
        newConfig: SaberConfig,
        prevConfig: SaberConfig
      ) => {
        const dropUnnecessary = (config: SaberConfig) =>
          Object.assign({}, config, {
            siteConfig: undefined,
            themeConfig: undefined,
            locales: undefined
          })
        if (
          !deepEqual(dropUnnecessary(newConfig), dropUnnecessary(prevConfig))
        ) {
          log.warn(
            `Found a change in your Saber config file, restart server to see the effect.`
          )
        }
      }

      // Emit config.json anyways
      await emit(api.config)

      if (api.dev) {
        const cwd = api.configDir || api.resolveCwd()
        const watcher = require('chokidar').watch(CONFIG_FILES, {
          ignoreInitial: true,
          cwd
        })
        const reloadConfig = async () => {
          const {
            configPath: newConfigPath,
            config: newConfig
          } = api.loadConfig()
          const prevConfig = api.config
          checkIfConfigChanged(newConfig, prevConfig)
          api.setConfig(newConfig, newConfigPath)
          await api.hooks.postUpdateConfigFile.promise()
          await emit(newConfig)
        }
        watcher.on('all', () => {
          reloadConfig()
        })
      }
    })
  }
}

export default WatchConfigPlugin
