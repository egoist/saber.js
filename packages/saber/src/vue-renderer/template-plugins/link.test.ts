import { test } from 'uvu'
import assert from 'uvu/assert'
import posthtml from 'posthtml'
import plugin from './link'

const transform = (source: string) =>
  posthtml([plugin()])
    .process(source, {
      // @ts-ignore
      recognizeSelfClosing: true
    })
    .then(res => res.html)

test('basic', async () => {
  const html = await transform(`
  <a href="foo">foo</a>
  <a href="https://example.com">foo</a>
  <a href="mailto:i@example.com">foo</a>
  <saber-link to="/foo">foo</saber-link>
  <saber-link :to="foo">foo</saber-link>
  `)
  assert.is(
    html,
    `
  <saber-link to="foo">foo</saber-link>
  <saber-link to="https://example.com">foo</saber-link>
  <saber-link to="mailto:i@example.com">foo</saber-link>
  <saber-link to="/foo">foo</saber-link>
  <saber-link :to="foo">foo</saber-link>
  `
  )
})

test('ignore', async () => {
  const html = await transform(`<a href="foo" saber-ignore>foo</a>`)
  assert.is(html, `<a href="foo">foo</a>`)
})

test.run()
