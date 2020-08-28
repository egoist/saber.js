const path = require('path')

const env = process.env.BABEL_ENV || process.env.NODE_ENV
const isEnvTest = env === 'test'

module.exports = (_, { isServer, alwaysEnableTypeScript } = {}) => {
  const presets = [
    [
      require('@babel/preset-env'),
      isEnvTest || isServer
        ? {
            targets: {
              node: 'current'
            }
          }
        : {
            modules: false,
            // If users import all core-js they're probably not concerned with
            // bundle size. We shouldn't rely on magic to try and shrink it.
            useBuiltIns: false,
            // Exclude transforms that make all code slower
            exclude: ['transform-typeof-symbol']
          }
    ],
    [
      require('@babel/preset-typescript'),
      {
        jsxPragma: 'h',
        allExtensions: alwaysEnableTypeScript
      }
    ]
  ]

  const plugins = [
    require('@babel/plugin-syntax-dynamic-import'),
    [
      require('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true
      }
    ],
    // Polyfills the runtime needed for async/await, generators, and friends
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    [
      require('@babel/plugin-transform-runtime').default,
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
        // We should turn this on once the lowest version of Node LTS
        // supports ES Modules.
        useESModules: false,
        // Undocumented option that lets us encapsulate our runtime, ensuring
        // the correct version is used
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: path.dirname(
          require.resolve('@babel/runtime/package.json')
        )
      }
    ],
    function() {
      return {
        visitor: {
          StringLiteral(path) {
            if (path.node.value.endsWith('egoist is baka baka baka')) {
              path.node.value += '!!'
            }
          }
        }
      }
    }
  ]

  return {
    presets,
    plugins
  }
}
