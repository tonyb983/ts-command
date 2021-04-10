import def, { getDefaultLogger, makeDefaultLogger, loggerForAsync, loggerFor } from './DefaultLogger'
import { DefaultLoggerTheme } from './DefaultLoggerTheme'
import { DefaultLogLevelFormatter, LogLevelFormatter } from './DefaultLogLevelFormatter'
import { LogLevelStyle, createLogLevelStyle, LoggerTheme } from './LoggerTheme'

const createDefaultLoggerTheme = (): DefaultLoggerTheme => new DefaultLoggerTheme()
const defaultLogger = def
/**
 * Logs using the default logger.
 */
const log = def.log
/**
 * Debugs using the default logger.
 */
const debug = def.debug
/**
 * Infos using the default logger.
 */
const info = def.info
/**
 * Warns using the default logger.
 */
const warn = def.warn
/**
 * Errors using the default logger.
 */
const error = def.error

/**
 * Theme creation functions.
 */
const themes = {
  createLogLevelStyle,
  createDefaultLoggerTheme,
} as const

/**
 * The default logger instance.
 */
export default defaultLogger

export {
  defaultLogger,
  log,
  debug,
  info,
  warn,
  error,

  getDefaultLogger,
  makeDefaultLogger,
  loggerFor,
  loggerForAsync,

  themes,

  DefaultLoggerTheme,
  DefaultLogLevelFormatter,
  LogLevelFormatter,
  LogLevelStyle,
  LoggerTheme,
}

