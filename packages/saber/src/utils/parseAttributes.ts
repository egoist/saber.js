import path from 'path'
import resolveFrom from 'resolve-from'
import { TODO } from '../types'

const babelDir = path.dirname(require.resolve('@babel/core/package'))
const parser = require(resolveFrom(babelDir, '@babel/parser'))
const traverse: typeof import('@babel/traverse') = require(resolveFrom(
  babelDir,
  '@babel/traverse'
))
const generator = require(resolveFrom(babelDir, '@babel/generator'))

/**
 * Extract the `export const page` part from a page
 * @param content The content of a page
 * @param filepath The absolute path to the path
 */
module.exports = (content: string, filepath: string) => {
  const ast = parser.parse(content, {
    sourceFilename: filepath,
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'objectRestSpread', 'classProperties']
  })

  let data = {}

  traverse.default(ast, {
    ObjectExpression(path: TODO) {
      const name =
        path.parent &&
        path.parent.type === 'VariableDeclarator' &&
        path.parent.id.name

      if (name !== 'page') {
        return
      }

      const isConst =
        path.parentPath.parent && path.parentPath.parent.kind === 'const'
      if (!isConst) {
        return
      }

      const isExport =
        path.parentPath.parentPath &&
        path.parentPath.parentPath.parent.type === 'ExportNamedDeclaration'
      if (!isExport) {
        return
      }

      const { confident, value } = path.evaluate()
      if (confident) {
        data = value
        path.node.properties = []
      } else {
        throw new Error(
          `"${name}" is supposed to have the same value when executed in runtime and build time.`
        )
      }
    }
  })

  const { code } = generator.default(ast)

  return {
    data,
    code
  }
}
