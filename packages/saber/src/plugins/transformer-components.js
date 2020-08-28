const { slash } = require('saber-utils')

exports.name = 'builtin:transformer-components'

const getPageComponent = page => {
  return `<script>
  import PageComponent from "${slash(page.internal.absolute)}"

  export default {
    render(h) {
      return h('layout-manager', {
        scopedSlots: {
          component(props) {
            return h(PageComponent, { props })
          }
        }
      })
    }
  }
  </script>
  `
}

exports.apply = api => {
  api.transformers.add('vue', {
    extensions: ['vue'],
    transform(page) {
      const sfc = require('vue-template-compiler').parseComponent(page.content)
      if (sfc.script) {
        const { data } = require('../utils/parseAttributes')(
          sfc.script.content,
          page.internal.absolute
        )
        Object.assign(page, data)
      }
    },
    getPageComponent
  })

  api.transformers.add('js', {
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    transform(page) {
      const { data } = require('../utils/parseAttributes')(
        page.content,
        page.internal.absolute
      )
      Object.assign(page, data)
    },
    getPageComponent
  })
}
