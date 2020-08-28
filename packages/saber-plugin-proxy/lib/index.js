const proxy = require('http-proxy-middleware')

const ID = 'proxy'

exports.name = ID

exports.apply = (api, { routes = {} } = {}) => {
  api.hooks.onCreateServer.tap(ID, httpServer => {
    Object.keys(routes).forEach(requestedRoute => {
      const options = routes[requestedRoute]
      let opts = {}
      if (typeof options === 'string') opts = { target: options }
      else opts = options
      const p = proxy(opts)
      httpServer.use(requestedRoute, p)
    })
  })
}
