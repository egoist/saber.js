// @ts-check
const extractSFCBlocks = require('extract-sfc-blocks')

const ID = 'transformer-html'

/** @type {import('saber').SaberPlugin} */
module.exports = {
  name: ID,

  apply: api => {
    api.transformers.add('html', {
      extensions: ['html'],
      transform(page) {
        const { body, frontmatter } = api.transformers.parseFrontmatter(
          page.content
        )
        const { html, blocks } = extractSFCBlocks(body)
        Object.assign(page, frontmatter)
        page.content = html
        page.internal.hoistedTags = blocks
      },
      getPageComponent(page) {
        return `<template>
          <layout-manager>
            ${page.content || ''}
          </layout-manager>
        </template>
        `
      }
    })
  }
}
