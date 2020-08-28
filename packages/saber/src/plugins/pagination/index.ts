import urlJoin from 'url-join'
import { SaberPlugin } from '../../types'
import { getPaginationLink, paginateArray } from './utils'

const ID = 'builtin:pagination'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    const date = new Date()

    api.hooks.postPlugins.tap(ID, () => {
      api.hooks.postCreatePages.tap(ID, () => {
        for (const page of api.pages.store.find()) {
          if (!page.pagination || page.parent) {
            continue
          }
          const data = page.data[page.pagination.data]
          if (!Array.isArray(data)) {
            throw new Error(
              `Saber failed to create pagination for ${page.internal.absolute ||
                page.id} The page data "${
                page.pagination.data
              }" is not an array`
            )
          }
          const paginatedData = paginateArray(data, {
            size: page.pagination.size,
            first: page.pagination.first
          })
          const totalPages = paginatedData.length

          for (const [index, items] of paginatedData.entries()) {
            const permalink =
              index === 0
                ? page.permalink
                : urlJoin(page.permalink, `page/${index + 1}`)
            const newPage = Object.assign({}, page, {
              id: index === 0 ? page.id : `${page.id}__page__${index}`,
              parent: page.parent || (index === 0 ? undefined : page.id),
              permalink,
              createdAt: page.createdAt || date,
              updatedAt: page.updatedAt || date,
              data: {
                ...page.data,
                [page.pagination.data]: items,
                pagination: {
                  hasPrev: index !== totalPages - 1,
                  hasNext: index !== 0,
                  total: totalPages,
                  current: index + 1,
                  prevLink: getPaginationLink(index + 2, page.permalink),
                  nextLink: getPaginationLink(index, page.permalink)
                }
              }
            })
            api.pages.createPage(newPage)
          }
        }
      })
    })
  }
}

export default plugin
