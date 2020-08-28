#!/usr/bin/env node
import cac from 'cac'
import registerCommands from './cli-commands'

const cli = cac()
registerCommands(cli)

cli.option('-V, --verbose', 'Output verbose logs')
cli.option('--no-progress', 'Disable progress bar')

cli.version(require('../package').version)

cli.help()

cli.parse()

process.on('SIGINT', () => {
  const { log } = require('saber-log')
  log.log('')
  log.info(`See you later, master!`) // <-- Saber says
  process.exit()
})

process.on('unhandledRejection', error => {
  const { log } = require('saber-log')
  log.error(error)
  process.exitCode = 1
})
