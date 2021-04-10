import {
  bgRgb,
  greenBright,
  cyanBright,
  red,
  whiteBright
} from 'chalk';
import { error, info, warning } from 'log-symbols';
import { bullet, tick } from 'figures';
import { createLogLevelStyle, LoggerTheme, LogLevelStyle } from './LoggerTheme';
import { chalkOrange } from './colors';



export class DefaultLoggerTheme implements LoggerTheme {
  log: LogLevelStyle;
  debug: LogLevelStyle;
  info: LogLevelStyle;
  warn: LogLevelStyle;
  error: LogLevelStyle;

  static defaultStyleSet = {
    debugOutput: console.debug,
    debugStyle: greenBright,
    debugIcon: bullet,
    debugName: 'DEBUG' as const,
    logOutput: console.log,
    logStyle: bgRgb(30, 30, 30).rgb(220, 200, 220),
    logIcon: tick,
    logName: 'LOG' as const,
    infoOutput: console.info,
    infoStyle: cyanBright,
    infoIcon: info,
    infoName: 'INFO' as const,
    warnOutput: console.warn,
    warnStyle: chalkOrange,
    warnIcon: warning,
    warnName: 'WARN' as const,
    errorOutput: console.error,
    errorStyle: red.bold,
    errorIcon: error,
    errorName: 'ERROR' as const,
    logBegin: '',
    logSeparatorChar: '|',
    logSeparatorFormat: (input: unknown) => whiteBright(input),
    logEnd: whiteBright(':'),
  };

  constructor() {
    this.log = createLogLevelStyle(
      DefaultLoggerTheme.defaultStyleSet.logName,
      DefaultLoggerTheme.defaultStyleSet.logIcon,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorChar,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorFormat,
      DefaultLoggerTheme.defaultStyleSet.logStyle
    );
    this.debug = createLogLevelStyle(
      DefaultLoggerTheme.defaultStyleSet.debugName,
      DefaultLoggerTheme.defaultStyleSet.debugIcon,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorChar,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorFormat,
      DefaultLoggerTheme.defaultStyleSet.debugStyle
    );
    this.info = createLogLevelStyle(
      DefaultLoggerTheme.defaultStyleSet.infoName,
      DefaultLoggerTheme.defaultStyleSet.infoIcon,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorChar,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorFormat,
      DefaultLoggerTheme.defaultStyleSet.infoStyle
    );
    this.warn = createLogLevelStyle(
      DefaultLoggerTheme.defaultStyleSet.warnName,
      DefaultLoggerTheme.defaultStyleSet.warnIcon,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorChar,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorFormat,
      DefaultLoggerTheme.defaultStyleSet.warnStyle
    );
    this.error = createLogLevelStyle(
      DefaultLoggerTheme.defaultStyleSet.errorName,
      DefaultLoggerTheme.defaultStyleSet.errorIcon,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorChar,
      DefaultLoggerTheme.defaultStyleSet.logSeparatorFormat,
      DefaultLoggerTheme.defaultStyleSet.errorStyle
    );
  }
}
