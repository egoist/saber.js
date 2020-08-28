import { colors } from './colors'

const chars = {
  info: colors.cyan('info'),
  success: colors.green('success'),
  warning: colors.yellow('warning'),
  error: colors.red('error')
}

interface ILogConstructorOptions {
  logLevel?: number
}

/**
 * Check if a value is `undefined`
 */
const defined = (n: any) => typeof n !== 'undefined'

export class Log {
  options: ILogConstructorOptions

  constructor() {
    this.options = {}
  }

  setOptions(options: ILogConstructorOptions) {
    this.options = Object.assign({}, this.options, options)
  }

  // 4: error, warning, info/success, verbose
  // 3: error, warning, info/success
  // 2: error and wanring
  // 1: error
  // 0: nothing
  get logLevel() {
    const logLevel = defined(this.options.logLevel)
      ? this.options.logLevel
      : defined(process.env.SABER_LOG_LEVEL)
      ? process.env.SABER_LOG_LEVEL
      : 3
    return Number(logLevel)
  }

  /**
   * Log anything using `console.log`
   */
  log(...args: any[]) {
    console.log(...args)
  }

  /**
   * Verbose logs
   */
  verbose(...args: any[]) {
    if (this.logLevel < 4) return

    const messages = args.map(arg => (typeof arg === 'function' ? arg() : arg))
    this.log(colors.dim('[verbose]'), ...messages)
  }

  /**
   * Info logs
   */
  info(...args: any[]) {
    if (this.logLevel < 3) return

    this.log(`[${chars.info}]`, ...args)
  }

  /**
   * Warning logs
   */
  warn(...args: any[]) {
    if (this.logLevel < 2) return

    this.log(`[${chars.warning}]`, ...args)
  }

  /**
   * Error logs
   */
  error(...args: any[]) {
    if (this.logLevel < 1) return

    this.log(`[${chars.error}]`, ...args)
  }

  /**
   * Success logs
   */
  success(...args: any[]) {
    if (this.logLevel < 3) return

    this.log(`[${chars.success}]`, ...args)
  }
}

const log = new Log()

export { log, colors, chars }
