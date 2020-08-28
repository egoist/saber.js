import { resolve } from 'path'
import hash from 'hash-sum'
import { SaberPlugin } from '../../types'
import { DataFactory } from '../../DataStore'

const ID = 'builtin:inject-data'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    const cache: Map<string, any> = new Map()
    const dataFileDir = api.resolveCwd('data')

    const getDataFactory = (source: string) => {
      if (api.dataStore.hasData(source)) {
        const data = api.dataStore.getData(source)!
        return { isFile: false, dataFactory: data.factory }
      }
      const dataFilePath = resolve(dataFileDir, source)
      return { isFile: true, dataFactory: require(dataFilePath) as DataFactory }
    }

    api.hooks.postPlugins.tap(ID, () => {
      api.hooks.postCreatePages.tapPromise(ID, async () => {
        const activeCacheKeys: Set<string> = new Set()

        for (const page of api.pages.store.find()) {
          if (!page.injectData) {
            continue
          }
          const pageIndentifier = page.internal.absolute || page.id
          for (const injectAs of Object.keys(page.injectData)) {
            const config = page.injectData[injectAs]
            if (!config.source) {
              throw new Error(
                `Failed to inject data, use "source" option to specify data source on page: ${pageIndentifier}`
              )
            }
            const cacheKey = `${config.source}::${page.id}::${injectAs}::${hash(
              config
            )}`
            activeCacheKeys.add(cacheKey)
            if (cache.has(cacheKey)) {
              page.data[injectAs] = cache.get(cacheKey)
            } else {
              const { dataFactory } = getDataFactory(config.source)
              page.data[injectAs] = await dataFactory(config.options || {}, api)
              cache.set(cacheKey, page.data[injectAs])
            }
            if (!page.data[injectAs]) {
              throw new Error(
                `Data source "${config.source}" is not returning a JSON object, which is not allowed!`
              )
            }
          }
        }

        // Clean up outdated cache
        for (const key of cache.keys()) {
          if (!activeCacheKeys.has(key)) {
            cache.delete(key)
          }
        }
      })
    })

    if (api.dev) {
      const chokidar: typeof import('chokidar') = require('chokidar')

      const watcher = chokidar.watch(['**/*.js', '!**/_*'], {
        cwd: dataFileDir,
        ignoreInitial: true
      })

      const updateCache = async (file: string) => {
        const absolutePath = resolve(dataFileDir, file)
        delete require.cache[absolutePath]
        for (const key of cache.keys()) {
          if (key.startsWith(file)) {
            cache.delete(key)
          }
        }
        try {
          // Rebuild pages
          await api.hooks.postCreatePages.promise()
          // Emit pages
          await api.hooks.emitPages.promise()
        } catch (err) {
          api.log.error(err)
        }
      }

      watcher
        .on('unlink', file => {
          updateCache(file)
        })
        .on('change', file => {
          updateCache(file)
        })
    }
  }
}

export default plugin
