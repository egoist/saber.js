const path = require('path')
const url = require('url')
const { Feed } = require('feed')
const { getFeedPath } = require('./utils')

const ID = 'generate-feed'

exports.name = ID

exports.apply = (api, options = {}) => {
  // Plugin options
  options = Object.assign(
    {
      limit: 30,
      generator: 'Saber.js',
      copyright: 'All rights reserved'
    },
    options
  )

  const { siteConfig } = api.config
  if (!siteConfig.url) {
    throw new Error(`siteConfig.url is required for saber-plugin-generate-feed`)
  }

  const jsonFeedPath = getFeedPath(options.jsonFeed, 'feed.json')
  const atomFeedPath = getFeedPath(options.atomFeed, 'atom.xml')
  const rss2FeedPath = getFeedPath(options.rss2Feed, 'rss2.xml')

  const feedLinks = {
    json: jsonFeedPath && url.resolve(siteConfig.url, jsonFeedPath),
    atom: atomFeedPath && url.resolve(siteConfig.url, atomFeedPath),
    rss2: rss2FeedPath && url.resolve(siteConfig.url, rss2FeedPath)
  }

  api.hooks.afterGenerate.tapPromise(ID, async () => {
    // Prepare posts
    const posts = []
    for (const page of api.pages.values()) {
      if (page.attributes.type === 'post' && !page.attributes.draft) {
        const { excerpt } = page.attributes
        posts.push({
          title: page.attributes.title,
          id: page.attributes.permalink,
          link: url.resolve(siteConfig.url, page.attributes.permalink),
          description: excerpt && excerpt.replace(/<(?:.|\n)*?>/gm, ''),
          content: page.content,
          date: page.attributes.updatedAt,
          published: page.attributes.createdAt
        })
      }
    }
    // Order by published
    const items = posts
      .sort((a, b) => {
        return b.published - a.published
      })
      .slice(0, options.limit)

    // Feed instance
    const feed = new Feed({
      title: siteConfig.title,
      description: siteConfig.description,
      id: siteConfig.url,
      link: siteConfig.url,
      copyright: options.copyright,
      generator: options.generator,
      author: siteConfig.author,
      feedLinks
    })

    // Add posts to feed
    items.forEach(post => {
      feed.addItem(post)
    })

    const { log } = api
    const { fs } = api.utils

    const writeFeed = async (fileName, content) => {
      log.info(`Generating ${fileName}`)
      await fs.outputFile(
        path.join(api.resolveCache('public'), fileName),
        content,
        'utf8'
      )
    }

    await Promise.all([
      jsonFeedPath && writeFeed(jsonFeedPath, feed.json1()),
      atomFeedPath && writeFeed(atomFeedPath, feed.atom1()),
      rss2FeedPath && writeFeed(rss2FeedPath, feed.rss2())
    ])
  })

  api.hooks.defineVariables.tap(ID, variables => {
    return Object.assign(variables, {
      feedLink: feedLinks.atom || feedLinks.rss2 || feedLinks.json,
      feedLinks
    })
  })
}
