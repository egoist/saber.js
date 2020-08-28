// @ts-check
const path = require('path')
const pug = require('pug')
const extractSFCBlocks = require('extract-sfc-blocks')

const ID = 'transformer-pug'

/** @type {import('saber').SaberPlugin} */
module.exports = {
  name: ID,

  apply: api => {
    api.transformers.add('pug', {
      extensions: ['pug'],
      transform(page) {
        const { body, frontmatter } = api.transformers.parseFrontmatter(
          page.content
        )
        const { base: basename, dir: dirname } = path.parse(
          page.internal.absolute || ''
        )
        // @ts-ignore we can omit the callback
        const html = pug.render(body, {
          filename: basename,
          basedir: dirname
        })
        const { html: pageContent, blocks } = extractSFCBlocks(html)
        Object.assign(page, frontmatter)
        page.content = pageContent
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

    api.hooks.chainWebpack.tap(ID, config => {
      config.module
        .rule('pug')
        .test(/\.pug$/)
        .use('pug-loader')
        .loader(require.resolve('./pug-plain-loader'))
    })
  }
}
