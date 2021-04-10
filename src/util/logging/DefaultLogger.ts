import { LogCategory, LogEntryConfig, DefaultLogFormatter, createDefaultConfig, makeCategory } from './common';
import { DefaultLoggerTheme } from "./DefaultLoggerTheme";
import { LogFormatter, Logger, PrintFunction } from './Logger';

class DefaultLogger implements Logger {
  log: PrintFunction;
  debug: PrintFunction;
  info: PrintFunction;
  warn: PrintFunction;
  error: PrintFunction;
  formatter: LogFormatter;
  category?: LogCategory;

  extend = (category: string): Logger => {
    return new DefaultLogger(this, category);
  };

  defaultConfig: LogEntryConfig;
  private isLogger = (
    input: LogEntryConfig | Logger | null
  ): input is Logger => {
    return input != null && !Array.isArray(input);
  };
  private isLoggerConfig = (
    input: LogEntryConfig | Logger | null
  ): input is LogEntryConfig => {
    return input != null && Array.isArray(input);
  };

  private setLogFunctions = () => {
    this.log = (input) => DefaultLoggerTheme
      .defaultStyleSet
      .logOutput(this.formatter.format(DefaultLoggerTheme.defaultStyleSet.logName, this.category, input));
    this.debug = (input) => DefaultLoggerTheme
      .defaultStyleSet
      .debugOutput(this.formatter.format(DefaultLoggerTheme.defaultStyleSet.debugName, this.category, input));
    this.info = (input) => DefaultLoggerTheme
      .defaultStyleSet
      .infoOutput(this.formatter.format(DefaultLoggerTheme.defaultStyleSet.infoName, this.category, input));
    this.warn = (input) => DefaultLoggerTheme
      .defaultStyleSet
      .warnOutput(this.formatter.format(DefaultLoggerTheme.defaultStyleSet.warnName, this.category, input));
    this.error = (input) => DefaultLoggerTheme
      .defaultStyleSet
      .errorOutput(this.formatter.format(DefaultLoggerTheme.defaultStyleSet.errorName, this.category, input));
  };

  private setFromOther = (input: Logger, category?: LogCategory) => {
    this.defaultConfig = input.defaultConfig;
    this.formatter = input.formatter;
    if (category) {
      this.category = input.category
        ? `${input.category}:${category}`
        : category;
    } else {
      this.category = category;
    }
    this.setLogFunctions();
  };

  private setDefaults = (category?: LogCategory) => {
    this.formatter = new DefaultLogFormatter(this.defaultConfig);
    this.category = category;
    this.setLogFunctions();
  };

  constructor(input?: LogEntryConfig | Logger | null, category?: LogCategory) {
    if (this.isLogger(input)) {
      this.setFromOther(input, category);
    } else {
      this.defaultConfig = this.isLoggerConfig(input)
        ? input
        : createDefaultConfig();
      this.setDefaults(category);
    }
  }

  static withCategory = (category: string): Logger => {
    return new DefaultLogger(createDefaultConfig(), category);
  };
}

const loggerFor = <T extends unknown = any>(typeOrLabel?: T): Logger => {
  const c = makeCategory(typeOrLabel);
  if (c) {
    return DefaultLogger.withCategory(c);
  } else {
    return new DefaultLogger();
  }
};

const loggerForAsync = <T extends unknown = any>(
  typeOrLabel?: T,
): Promise<Logger> => {
  const c = makeCategory(typeOrLabel);
  if (c) {
    return Promise.resolve(DefaultLogger.withCategory(c));
  } else {
    return Promise.resolve(new DefaultLogger());
  }
};


const makeDefaultLogger = (): Logger => new DefaultLogger();

const def = DefaultLogger.withCategory('Default');

const getDefaultLogger = (): Logger => def;

export default def

export {
  DefaultLogger,
  loggerFor,
  loggerForAsync,
  makeDefaultLogger,
  getDefaultLogger
}
