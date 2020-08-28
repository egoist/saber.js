// @ts-check
const path = require('path')
const fs = require('fs')
const JoyCon = require('joycon').default

const joycon = new JoyCon({
  stopDir: path.dirname(process.cwd())
})

joycon.addLoader({
  test: /\.ya?ml$/,
  loadSync: filepath =>
    require('js-yaml').safeLoad(fs.readFileSync(filepath, 'utf8'))
})

joycon.addLoader({
  test: /\.toml$/,
  loadSync: filepath => require('toml').parse(fs.readFileSync(filepath, 'utf8'))
})

module.exports = {
  /**
   * Load config files synchronously
   * @param {import('joycon').Options} opts
   */
  load(opts) {
    joycon.clearCache()
    return joycon.loadSync(opts)
  },
  /**
   * Resolve config files synchronously
   * @param {import('joycon').Options} opts
   */
  resolve(opts) {
    joycon.clearCache()
    return joycon.resolveSync(opts)
  },
  CONFIG_FILES: [
    'saber-config.json',
    'saber-config.js',
    'saber-config.yml',
    'saber-config.toml'
  ]
}
