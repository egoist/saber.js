import { test } from 'uvu'
import assert from 'uvu/assert'
const resolvePackage = require('saber/src/utils/resolvePackage')

test('resolvePackage', () => {
  assert.is(resolvePackage('foo', { cwd: false }), 'foo')
  assert.is(resolvePackage('@foo/bar', { cwd: false }), '@foo/bar')
  assert.is(
    resolvePackage('foo', { prefix: 'prefix-', cwd: false }),
    'prefix-foo'
  )
  assert.is(
    resolvePackage('prefix-foo', { prefix: 'prefix-', cwd: false }),
    'prefix-foo'
  )
  assert.is(
    resolvePackage('@foo/bar', { prefix: 'prefix-', cwd: false }),
    '@foo/prefix-bar'
  )
  assert.is(
    resolvePackage('@foo/prefix-bar', { prefix: 'prefix-', cwd: false }),
    '@foo/prefix-bar'
  )
})

test.run()
