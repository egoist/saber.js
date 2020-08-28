const yaml = require('js-yaml')

module.exports = function(source) {
  return JSON.stringify(yaml.safeLoad(source))
}
