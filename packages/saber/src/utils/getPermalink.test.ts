import { test } from 'uvu'
import assert from 'uvu/assert'
import getPermalink from 'saber/src/utils/getPermalink'

test('use default permalink', () => {
  const samples = [
    { slug: 'index', permalink: '/' },
    { slug: 'foo/index', permalink: '/foo' },
    { slug: 'foo/bar', permalink: '/foo/bar' }
  ]
  for (const sample of samples) {
    const receivedPermalink = getPermalink(
      [],
      {
        slug: sample.slug,
        type: 'page',
        createdAt: new Date('2019-01-01')
      },
      {}
    )
    assert.is(receivedPermalink, sample.permalink)
  }
})

test('remove .html extension', () => {
  const samples = [
    { slug: 'index', permalink: '/' },
    { slug: 'foo/index', permalink: '/foo' },
    { slug: 'foo/bar', permalink: '/foo/bar' }
  ]
  for (const sample of samples) {
    const receivedPermalink = getPermalink(
      [],
      {
        slug: sample.slug,
        type: 'page',
        createdAt: new Date('2019-01-01')
      },
      {
        page: '/:slug'
      }
    )
    assert.is(receivedPermalink, sample.permalink)
  }
})

test.run()
