import { format } from 'date-fns';
import { isEmpty, isNil, times, toString } from 'lodash';
import { chalkPastelYellow, chalkPink, chalkVeryLtGrey } from './colors';
import { DefaultLogger } from './DefaultLogger';
import { DefaultLoggerTheme } from './DefaultLoggerTheme';
import { DefaultLogLevelFormatter, LogLevelFormatter } from './DefaultLogLevelFormatter';
import { LogFormatter } from './Logger';
import { DateTimeFormatter, LoggerTheme, StyledText, StyleFunction } from './LoggerTheme';

// const clarityTimestamp = (date: Date | null) => format(isNil(date) ? new Date() : date, 'yyMMdd')
// const readableTimestamp = (date: Date | null) => `(As of ${format(isNil(date) ? new Date() : date, 'PP')})
// const logTimeIso = (date?: Date | null) => formatISO(isNil(date) ? new Date() : date, { format: 'basic' })
// const logTime = (date?: Date | null) => format(isNil(date) ? new Date() : date, "HH:mm:ss.SSS")
// const logDate = (date?: Date | null) => format(isNil(date) ? new Date() : date, "yyyy-MM-dd")
const logTimestamp = (date?: Date | null) =>
  format(isNil(date) ? new Date() : date, 'yyyy-MM-dd|HH:mm:ss.SSS');


type LogLevel = 'LOG' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'; // | 'TRACE'
type StringGetter = () => string;

export type LogCategory = string | null;
export type LogEntrySectionFunction = (
  logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  category?: LogCategory,
) => StyledText | null;
export type LogEntrySection = LogEntrySectionFunction | StyledText;
export type LogEntryConfig = Array<LogEntrySection>;

// const formatTimestamp = (time: Date | string) => chalk.yellow(time)
export const formatTime = (time: unknown) => chalkPink(time);
export const formatDate: DateTimeFormatter = (date: unknown) =>
  chalkPastelYellow(date);

export const isString = (styledText: StyledText): styledText is string =>
  typeof styledText === 'string';
export const isStringGetter = (styledText: StyledText): styledText is StringGetter =>
  typeof styledText !== 'string';
export const extractString = (styledText: StyledText): string => {
  if (typeof styledText === 'string') {
    return styledText;
  } else {
    return styledText();
  }
};

export const isLogEntrySectionFunction = (
  section: LogEntrySection,
): section is LogEntrySectionFunction =>
  typeof section === 'function' && section.length > 0 && section.length <= 4;
const isStyledText = (section: LogEntrySection): section is StyledText =>
  typeof section === 'string' ||
  (typeof section === 'function' && section.length < 1);

export const evaluateLogEntrySection = (
  entry: LogEntrySection,
  logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  category?: LogCategory,
): StyledText | null => {
  if (isStyledText(entry)) {
    if (isString(entry)) {
      return entry;
    } else if (isStringGetter(entry)) {
      return entry();
    }
  }

  if (isLogEntrySectionFunction(entry)) {
    return entry(logLevel, logLevelStyle, category);
  }

  return null;
};

export const logFormatTimestamp = (
  _logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  _category?: LogCategory,
): StyledText => {
  const [d, t] = logTimestamp().split('|');
  return `${formatDate(d)}${logLevelStyle.separatorStyle('|')}${formatTime(t)}`;
};

export const logFormatCategory = (
  styleFunction: StyleFunction,
  category?: LogCategory,
): StyledText | null => {
  if (isNil(category) || isEmpty(category)) {
    return null;
  }

  return `${chalkVeryLtGrey('[')}${styleFunction(category)}${chalkVeryLtGrey(
    ']',
  )}`;
};

const logEntryStart: LogEntrySection =
  DefaultLoggerTheme.defaultStyleSet.logBegin;
const logEntryIcon: LogEntrySection = (
  _logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  _category?: LogCategory,
) => logLevelStyle.applyTo(logLevelStyle.icon);
const logEntryType: LogEntrySection = (
  logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  _category?: LogCategory,
) => logLevelStyle.applyTo(logLevel.padStart(5, ' '));
const logEntryTimestamp: LogEntrySection = (
  logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  category?: LogCategory,
) => logFormatTimestamp(logLevel, logLevelStyle, category);
const logEntryCategory: LogEntrySection = (
  _logLevel: LogLevel,
  logLevelStyle: LogLevelStyle,
  category?: LogCategory,
) => logFormatCategory(logLevelStyle.applyTo, category);
const logEntryEnd: LogEntrySection = DefaultLoggerTheme.defaultStyleSet.logEnd;

const createDefaultConfig = (): LogEntryConfig => [
  logEntryStart,
  logEntryIcon,
  logEntryType,
  logEntryTimestamp,
  logEntryCategory,
  logEntryEnd,
];

const combineSections = (
  sections: LogEntryConfig,
  logLevel: LogLevel,
  style: LogLevelStyle,
  category?: LogCategory,
): string => {
  return sections
    .map((section) =>
      evaluateLogEntrySection(section, logLevel, style, category),
    )
    .filter((text) => text != null)
    .join(style.makeSeparator());
};

class LogLevelStyle {
  logLevel: LogLevel;
  icon: StyledText;
  separator: string;
  separatorStyle: StyleFunction;
  makeSeparator: () => string;
  applyTo: StyleFunction;

  constructor(
    level: LogLevel,
    icon: StyledText,
    separator: string,
    separatorStyle: StyleFunction,
    applyStyle: StyleFunction,
  ) {
    this.logLevel = level;
    this.icon = icon;
    this.separator = separator;
    this.separatorStyle = separatorStyle;
    this.makeSeparator = () =>
      extractString(this.separatorStyle(extractString(this.separator)));
    this.applyTo = applyStyle;
  }
}

class DefaultLogFormatter implements LogFormatter {
  config: LogEntryConfig;
  theme: LoggerTheme;
  log: LogLevelFormatter;
  debug: LogLevelFormatter;
  info: LogLevelFormatter;
  warn: LogLevelFormatter;
  error: LogLevelFormatter;

  private defaultFormatter: LogLevelFormatter;

  constructor(config?: LogEntryConfig | null) {
    this.config = config ?? createDefaultConfig();
    this.defaultFormatter = new DefaultLogLevelFormatter(this.config);
    this.theme = new DefaultLoggerTheme();
    this.log = this.defaultFormatter;
    this.debug = this.defaultFormatter;
    this.info = this.defaultFormatter;
    this.warn = this.defaultFormatter;
    this.error = this.defaultFormatter;
  }

  styleFor = (level: LogLevel): LogLevelStyle => {
    switch (level) {
      case 'DEBUG':
        return this.theme.debug;
      case 'ERROR':
        return this.theme.error;
      case 'INFO':
        return this.theme.info;
      case 'LOG':
        return this.theme.log;
      case 'WARN':
        return this.theme.warn;
    }
  };

  format = (level: LogLevel, category?: string, ...input: any): string => {
    const style = this.styleFor(level);
    return this.defaultFormatter.format(level, style, category, input);
  };
}

type Primitive = bigint | boolean | number | string;
const primitives = ['bigint', 'boolean', 'number', 'string'];

function isPrimitive(input: unknown): input is Primitive {
  return primitives.indexOf(typeof input) >= 0;
}

type Nil = null | undefined;
type Maybe<T> = T | Nil;
function isSome<T>(input?: Maybe<T>): input is T {
  return input != null && input != undefined && typeof input !== 'undefined';
}

function isNone(input?: Maybe<unknown>): input is Nil {
  return input == null || input == undefined || typeof input === 'undefined';
}

type Either<L, R> = L | R;
type Result<T, E extends Error | string = Error> = Either<T, E>;

function makeCategory(input?: unknown): Maybe<string> {
  if (isNone(input)) {
    return null;
  }

  if (isPrimitive(input)) {
    return String(input);
  }

  if (Array.isArray(input)) {
    return `[${input
      .map((val) => makeCategory(val))
      .filter((val) => !isNone(val))
      .join(':')}]`;
  }

  if (typeof input === 'object') {
    const s = Object.keys(input)
      .map((key) => [key, makeCategory(input[key])] as [string, Maybe<string>])
      .filter(([_, m]) => isSome(m))
      .map(([s1, s2]) => `[${s1}:${s2}]`)
      .join(':');

    return `{${s}}`;
  }

  function makeEmptyArgs(count: number): {}[] {
    return times(count, () => ({}));
  }

  if (typeof input === 'function') {
    return makeCategory(
      input.length === 0 ? input() : input(...makeEmptyArgs(input.length)),
    );
  }

  return toString(input);
}

export { LogLevel, Nil, Maybe, Either, Result, Primitive, StringGetter };

export { DefaultLogger, DefaultLogFormatter, DefaultLogLevelFormatter, LogLevelStyle };

export {
  isSome,
  isNone,

  createDefaultConfig,
  combineSections,
  makeCategory,
}
