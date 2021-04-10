import { LogCategory, LogEntryConfig, LogLevel } from './common';
import { LogLevelFormatter } from './DefaultLogLevelFormatter';
import { LoggerTheme, LogLevelStyle } from './LoggerTheme';

export interface LogFormatter {
  theme: LoggerTheme;
  log: LogLevelFormatter;
  debug: LogLevelFormatter;
  info: LogLevelFormatter;
  warn: LogLevelFormatter;
  error: LogLevelFormatter;
  styleFor: (level: LogLevel) => LogLevelStyle;
  format: (level: LogLevel, category?: LogCategory, ...input: any) => string;
}

export type PrintFunction = (...args: any) => void;
export interface Logger {
  // raw: debugLib.Debug,
  log: PrintFunction;
  debug: PrintFunction;
  info: PrintFunction;
  warn: PrintFunction;
  error: PrintFunction;
  formatter: LogFormatter;
  category?: LogCategory;
  defaultConfig: LogEntryConfig;
  extend: (category: string) => Logger;
}
