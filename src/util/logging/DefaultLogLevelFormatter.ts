import { LogEntryConfig, LogLevel, LogLevelStyle, combineSections, createDefaultConfig, LogCategory } from './common';

export interface LogLevelFormatter {
  sections: LogEntryConfig;
  format: (
    level: LogLevel,
    levelStyle: LogLevelStyle,
    category?: LogCategory,
    ...input: any
  ) => string;
}


export class DefaultLogLevelFormatter implements LogLevelFormatter {
  sections: LogEntryConfig;

  format = (
    level: LogLevel,
    levelStyle: LogLevelStyle,
    category?: string,
    ...input: any
  ): string => {
    return `${combineSections(
      this.sections,
      level,
      levelStyle,
      category
    )} ${levelStyle.applyTo(input)}`;
  };

  constructor(sections?: LogEntryConfig | null) {
    this.sections = sections ?? createDefaultConfig();
  }
}
