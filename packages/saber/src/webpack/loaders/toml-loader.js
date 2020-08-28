const toml = require('toml')

module.exports = function(source) {
  return JSON.stringify(toml.parse(source))
}
