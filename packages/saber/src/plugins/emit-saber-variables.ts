import { SaberPlugin } from '../types'

import { fs } from 'saber-utils'

const ID = 'builtin:emit-saber-variables'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.beforeRun.tapPromise(ID, async () => {
      const variables = {}
      api.hooks.defineVariables.call(variables)
      await fs.outputFile(
        api.resolveCache('variables.json'),
        JSON.stringify(variables),
        'utf8'
      )
    })
  }
}

export default plugin
