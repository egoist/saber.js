import getFileNames from '../utils/getFileNames'
import { SaberPlugin } from '../types'

const ID = 'builtin:config-font'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.chainWebpack.tap(ID, config => {
      const filename = getFileNames(!api.dev).font
      config.module
        .rule('font')
        .test(/\.(eot|otf|ttf|woff|woff2)(\?.*)?$/)
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
          name: filename
        })
    })
  }
}

export default plugin
