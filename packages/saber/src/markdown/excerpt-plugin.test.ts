import { test } from 'uvu'
import assert from 'uvu/assert'
import Markdown from 'saber-markdown'
import excerptPlugin from 'saber/src/markdown/excerpt-plugin'
import { createMarkdownEnv } from './__helpers__/create-markdown-env'

test('use first paragraph as excerpt', () => {
  const md = new Markdown()
  const { env, page } = createMarkdownEnv()
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  assert.is(page.excerpt, '<p>hello</p>\n')
})

test('do not override page excerpt', () => {
  const md = new Markdown()
  const { env, page } = createMarkdownEnv({ excerpt: 'existing' })
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  md.use(excerptPlugin)
  assert.is(page.excerpt, 'existing')
})

test('disable excerpt', () => {
  const md = new Markdown()
  const { env, page } = createMarkdownEnv()
  page.excerpt = false
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  assert.is(page.excerpt, false)
})

test('<!-- more --> mark', () => {
  const md = new Markdown({
    html: true
  })
  const { env, page } = createMarkdownEnv()
  md.use(excerptPlugin)
  md.render(
    `
hello

world

<!-- more -->

wow
  `,
    env
  )
  assert.is(page.excerpt, '<p>hello</p>\n<p>world</p>\n')
})

test.run()
