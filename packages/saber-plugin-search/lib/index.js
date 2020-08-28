// @ts-check
const { join } = require('path')

const ID = 'search'

let db = {}

function getLocale(locale) {
  return db[locale]
}

/** @type {import('saber').SaberPlugin} */
const plugin = {
  name: ID,

  apply: (api, options) => {
    const { index } = Object.assign(
      {
        index: ['type', 'title', 'excerpt', 'permalink']
      },
      options
    )

    const { fs } = api.utils

    async function generateLocale(localePath) {
      const pages = []

      await Promise.all(
        api.pages.store.find().map(async page => {
          if (page.draft || !page.type) {
            return
          }

          const matchedLocalePath = api.pages.getMatchedLocalePath(
            page.permalink
          )
          if (localePath !== matchedLocalePath) {
            return
          }

          const item = {}

          for (const element of index) {
            const value = page[element]
            if (value !== undefined) {
              if (element === 'content') {
                item.content = await api.renderer.renderPageContent(
                  page.permalink
                )
              } else {
                item[element] = page[element]
              }
            }
          }

          pages.push(item)
        })
      )

      return pages
    }

    async function generateDatabase() {
      const allLocalePaths = ['/'].concat(Object.keys(api.config.locales || {}))

      const results = await Promise.all(
        allLocalePaths.map(localePath => generateLocale(localePath))
      )

      const localDb = {}
      results.forEach((result, i) => {
        const locale = allLocalePaths[i].slice(1) || 'default'
        localDb[locale] = result
      })

      return localDb
    }

    api.browserApi.add(join(__dirname, 'saber-browser.js'))

    if (api.dev) {
      api.hooks.postCreateServer.tap(ID, server => {
        server.get('/_saber/plugin-search/:locale.json', async (req, res) => {
          db = await generateDatabase()
          const dbByLocale = getLocale(req.params.locale)
          if (dbByLocale) {
            res.writeHead(200, {
              'Content-Type': 'application/json'
            })
            return res.end(JSON.stringify(dbByLocale))
          }

          res.statusCode = 404
          res.end()
        })
      })
    } else {
      api.hooks.afterGenerate.tapPromise(ID, async () => {
        const db = await generateDatabase()
        for (const locale of Object.keys(db)) {
          const items = db[locale]
          const path = api.resolveOutDir(
            '_saber',
            'plugin-search',
            `${locale}.json`
          )
          await fs.ensureDir(api.resolveOutDir('_saber', 'plugin-search'))
          await fs.writeJson(path, items)
        }
      })
    }
  }
}

module.exports = plugin
