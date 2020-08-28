const os = require('os')
const { log, colors } = require('saber-log')
const prettyTime = require('pretty-ms')
const logUpdate = require('log-update')
const prettyBytes = require('../../utils/prettyBytes')

const progressLogs = new Map()

module.exports = class PrintStatusPlugin {
  constructor({ api, type }) {
    this.api = api
    this.type = type
  }

  apply(compiler) {
    compiler.hooks.invalid.tap('show-rebuild-reason', file => {
      const d = new Date()
      log.info(
        colors.dim(
          `(${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}) Rebuilding ${
            this.type
          } due to changes in ${file.replace(os.homedir(), '~')}`
        )
      )
    })

    if (
      this.api.opts.progress !== false &&
      !process.env.CI &&
      process.stdout.isTTY
    ) {
      const { ProgressPlugin } = require('webpack')
      const progressPlugin = new ProgressPlugin((per, message, ...args) => {
        const msg =
          per === 1
            ? null
            : `${(per * 100).toFixed(2)}% ${message} ${args
                .map(arg => {
                  const message = arg.replace(os.homedir(), '~')
                  return message.length > 40
                    ? `...${message.substr(
                        message.length - 39 - this.type.length - 2
                      )}`
                    : message
                })
                .join(' ')}`
        progressLogs.set(this.type, msg)
        const messages = [...progressLogs.keys()]
          .filter(type => progressLogs.get(type))
          .map(
            type => `[${colors.whiteBright(type)}] ${progressLogs.get(type)}`
          )
        logUpdate(messages.join('\n'))
      })
      progressPlugin.apply(compiler)
    }

    compiler.hooks.done.tap('print-status', stats => {
      logUpdate.clear()

      const logFiles = stateful => {
        stats
          .toString({
            colors: true,
            chunks: false,
            modules: false,
            children: false,
            version: false,
            assets: false,
            timings: false,
            hash: false
          })
          .split('\n')
          .forEach(line => {
            if (stateful) {
              log.info(line)
            } else {
              log.log(line)
            }
          })
      }

      if (stats.hasErrors() || stats.hasWarnings()) {
        logFiles()
      } else {
        if (log.logLevel > 3) {
          logFiles(true)
        }

        log.success(
          `Compiled ${this.type} successfully in ${prettyTime(
            Date.now() - stats.startTime
          )}!`
        )
        // Only show URL for client build
        if (this.api.dev && this.type === 'client') {
          const host =
            this.api.config.server.host === '0.0.0.0'
              ? 'localhost'
              : this.api.config.server.host
          const { port } = this.api.config.server
          if (port !== this.api.actualServerPort) {
            log.warn(
              `Port ${port} is used by another app, Saber is using a new port`
            )
          }

          log.info(
            `Available at ${colors.underline(
              `http://${host}:${this.api.actualServerPort}`
            )}`
          )
          log.info(
            colors.dim(
              `${prettyBytes(process.memoryUsage().heapUsed)} memory used`
            )
          )
        }
      }
    })
  }
}
