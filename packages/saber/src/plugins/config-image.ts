import { SaberPlugin } from '../types'
import getFileNames from '../utils/getFileNames'

const ID = 'builtin:config-image'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.chainWebpack.tap(ID, config => {
      const filename = getFileNames(!api.dev).image

      config.module
        .rule('image')
        .test([/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/])
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
          name: filename,
          // inline the file if smaller than 2KB
          limit: 20000
        })

      config.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        // SVG files use file-loader directly
        // See https://github.com/facebookincubator/create-react-app/pull/1180
        .loader(require.resolve('file-loader'))
        .options({
          name: filename
        })
    })
  }
}

export default plugin
