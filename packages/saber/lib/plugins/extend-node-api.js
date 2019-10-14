const fs = require('fs')
const path = require('path')
const { spawn, execSync } = require('child_process')
const notifier = require('node-notifier')

const { log, colors } = require('saber-log')

const ID = 'builtin:extend-node-api'

exports.name = ID

exports.apply = api => {
  const handleNodeApiFile = (nodeApiFile, nodeApiId) => {
    let nodeApi = {}

    const updateNodeApi = () => {
      if (fs.existsSync(nodeApiFile)) {
        delete require.cache[nodeApiFile]
        nodeApi = require(nodeApiFile)
      } else {
        nodeApi = {}
      }
    }

    updateNodeApi()

    const getHookHandler = hookName => nodeApi[hookName] || __noopHandler__
    const addHook = hookName => {
      const hook = api.hooks[hookName]
      if (hook) {
        const tapType = hook.call ? 'tap' : 'tapPromise'
        hook[tapType](nodeApiId, (...args) => {
          const hookHandler = getHookHandler(hookName)
          if (hookHandler.name !== '__noopHandler__') {
            log.verbose(() => `${hookName} ${colors.dim(`(${nodeApiId})`)}`)
          }

          if (tapType === 'tap') {
            return hookHandler.call(api, ...args)
          }

          return Promise.resolve(hookHandler.call(api, ...args))
        })
      }
    }

    // Hooks that should be added before `afterPlugins` hook
    const preHooks = ['beforePlugins', 'filterPlugins']

    for (const preHook of preHooks) {
      addHook(preHook)
    }

    api.hooks.afterPlugins.tap(nodeApiId, () => {
      for (const hookName of Object.keys(api.hooks)) {
        if (preHooks.includes(hookName)) {
          continue
        }

        addHook(hookName)
      }
    })

    if (api.dev && !/node_modules/.test(nodeApiFile)) {
      require('chokidar')
        .watch(nodeApiFile, {
          ignoreInitial: true
        })
        .on('all', async action => {
          await updateNodeApi()
          // Remove all child pages
          api.pages.removeWhere(page => page.internal.parent)
          await Promise.all(
            [...api.pages.values()].map(async page => {
              // Recreate the page
              api.pages.createPage(page)
              // A page has been created
              await api.hooks.onCreatePage.promise(page)
            })
          )
          // All pages are created
          await api.hooks.onCreatePages.promise()
          // Emit pages
          await api.hooks.emitPages.promise()
          // Emit route file
          await api.hooks.emitRoutes.promise()
          log.warn(
            `${action[0].toUpperCase()}${action.substring(1)} ${nodeApiFile}`
          )
          // Because you might also update webpack config in saber-node.js
          // Which we can't (?) automatically reload
          log.warn(`saber-node.js was changed, you need to restart the server.`)

          notifier.notify({
            title: 'Saber',
            icon: path.join('../assets', 'icon-saber.png'),
            message:
              'saber-node.js was changed, you need to restart the server.',
            wait: true,
            closeLabel: 'close',
            actions: 'restart'
          })

          notifier.on('click', () => {
            execSync(
              `pkill -f ${path.join(process.cwd(), 'node_modules/.bin/saber')}`
            )
            const command = spawn(process.env.npm_execpath, ['run', 'dev'])
            command.stdout.on('data', data => {
              console.log(`${data}`)
            })
          })
        })
    }
  }

  handleNodeApiFile(path.join(api.theme, 'saber-node.js'), 'theme-node-api')
  handleNodeApiFile(api.resolveCwd('saber-node.js'), 'user-node-api')
}

function __noopHandler__(arg) {
  return arg
}
