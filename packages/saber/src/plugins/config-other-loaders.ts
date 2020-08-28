import { SaberPlugin } from '../types'

const ID = 'builtin:config-other-loaders'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.chainWebpack.tap(ID, config => {
      // GraphQL
      config.module
        .rule('graphql')
        .test(/\.(graphql|gql)$/)
        .use('graphql-tag')
        .loader('graphql-tag/loader')

      config.module
        .rule('toml')
        .merge({
          type: 'json'
        })
        .test(/\.toml$/)
        .use('toml-loader')
        .loader(require.resolve('../webpack/loaders/toml-loader'))

      config.module
        .rule('yaml')
        .test(/\.ya?ml$/)
        .merge({
          type: 'json'
        })
        .use('yaml-loader')
        .loader(require.resolve('../webpack/loaders/yaml-loader'))
    })
  }
}

export default plugin
