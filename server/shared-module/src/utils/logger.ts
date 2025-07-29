/**
 * Simple logger utility for consistent logging across services
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogOptions {
  timestamp?: boolean;
  service?: string;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'unknown-service') {
    this.serviceName = serviceName;
  }

  private formatMessage(level: LogLevel, message: string, options: LogOptions = {}): string {
    const timestamp = options.timestamp !== false ? new Date().toISOString() : '';
    const service = options.service || this.serviceName;
    return `[${timestamp}] [${level}] [${service}] ${message}`;
  }

  debug(message: string, options: LogOptions = {}): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message, options));
  }

  info(message: string, options: LogOptions = {}): void {
    console.info(this.formatMessage(LogLevel.INFO, message, options));
  }

  warn(message: string, options: LogOptions = {}): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, options));
  }

  error(message: string | Error, options: LogOptions = {}): void {
    const errorMessage = message instanceof Error ? `${message.message}\n${message.stack}` : message;
    console.error(this.formatMessage(LogLevel.ERROR, errorMessage, options));
  }
}

// Create a default logger instance
export const createLogger = (serviceName: string): Logger => {
  return new Logger(serviceName);
};
