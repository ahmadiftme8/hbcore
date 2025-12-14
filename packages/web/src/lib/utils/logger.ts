/**
 * Logger utility for centralized logging
 * Only logs in development mode by default
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

function createLogger(level: LogLevel, shouldLog: boolean): (...args: unknown[]) => void {
  if (!shouldLog) {
    return () => {
      // No-op in production
    };
  }

  return (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console[level](...args);
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger: Logger = {
  debug: createLogger('debug', isDevelopment),
  info: createLogger('info', isDevelopment),
  warn: createLogger('warn', isDevelopment),
  error: createLogger('error', true), // Always log errors
};
