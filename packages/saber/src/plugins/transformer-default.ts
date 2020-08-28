import { SaberPlugin } from '../types'

const ID = 'builtin:transformer-markdefault'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.transformers.add('default', {
      extensions: [],
      getPageComponent(page) {
        return `
          <template>
            <layout-manager>
              ${page.content || ''}
            </layout-manager>
          </template>
        `
      }
    })
  }
}

export default plugin
