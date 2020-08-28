export default [
  { resolve: require.resolve('./source-pages') },
  { resolve: require.resolve('./extend-browser-api') },
  { resolve: require.resolve('./extend-node-api') },
  { resolve: require.resolve('./transformer-markdown') },
  { resolve: require.resolve('./transformer-default') },
  { resolve: require.resolve('./transformer-components') },
  { resolve: require.resolve('./config-css') },
  { resolve: require.resolve('./config-image') },
  { resolve: require.resolve('./config-font') },
  { resolve: require.resolve('./config-other-loaders') },
  { resolve: require.resolve('./watch-config') },
  { resolve: require.resolve('./layouts') },
  { resolve: require.resolve('./emit-saber-variables') },
  { resolve: require.resolve('./emit-runtime-polyfills') },
  { resolve: require.resolve('./inject-data') },
  { resolve: require.resolve('./pagination') }
]
