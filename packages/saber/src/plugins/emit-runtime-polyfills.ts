import { SaberPlugin } from '../types'
import { fs, slash } from 'saber-utils'

const ID = 'builtin:emit-runtime-polyfills'

let previousPolyfills: string

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.postPlugins.tap(ID, () => {
      api.hooks.emitRoutes.tapPromise(ID, async () => {
        const polyfills = [...api.runtimePolyfills]
          .map(file => `import '${slash(file)}'`)
          .join('\n')
        if (polyfills !== previousPolyfills) {
          await fs.outputFile(
            api.resolveCache('runtime-polyfills.js'),
            polyfills,
            'utf8'
          )
          // eslint-disable-next-line require-atomic-updates
          previousPolyfills = polyfills
        }
      })
    })
  }
}

export default plugin
