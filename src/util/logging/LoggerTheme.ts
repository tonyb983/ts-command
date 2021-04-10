import { extractString, LogLevel, StringGetter } from "./common";

export type StyledText = string | StringGetter;
export type StyleFunction = (...args: any) => StyledText;
// type DateTimeAuthor = (date?: Date) => string
export type DateTimeFormatter = (date: Date | String) => string;

// type DateTimeFunction = DateTimeAuthor | DateTimeFormatter

// type Color = string | [Number, Number, Number] | (() => string)

export interface LogLevelStyle {
  logLevel: LogLevel;
  icon: StyledText;
  separator: string;
  separatorStyle: StyleFunction;
  makeSeparator: () => string;
  applyTo: StyleFunction;
}

export const createLogLevelStyle = (
  logLevel: LogLevel,
  icon: StyledText,
  separator: string,
  separatorStyle: StyleFunction,
  applyStyle: StyleFunction
): LogLevelStyle => ({
  logLevel,
  icon,
  separator,
  separatorStyle,
  applyTo: applyStyle,
  makeSeparator: () => extractString(separatorStyle(separator))
})

export interface LoggerTheme {
  log: LogLevelStyle;
  debug: LogLevelStyle;
  info: LogLevelStyle;
  warn: LogLevelStyle;
  error: LogLevelStyle;
}
