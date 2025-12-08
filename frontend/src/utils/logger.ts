/**
 * Production-grade logging utility
 *
 * Usage:
 *   logger.error('Failed to fetch data', { userId, error });
 *   logger.warn('Rate limit approaching', { requests: 95 });
 *   logger.info('User logged in', { userId });
 *
 * Future: Integrate with services like:
 *   - Sentry for error tracking
 *   - LogRocket for session replay
 *   - DataDog for metrics
 */

type LogLevel = "info" | "warn" | "error";

interface LogData {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, data?: LogData) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data,
    };

    // In development: console output
    if (this.isDevelopment) {
      const consoleMethod =
        level === "error"
          ? console.error
          : level === "warn"
          ? console.warn
          : console.log;
      consoleMethod(`[${level.toUpperCase()}]`, message, data || "");
    } else {
      // In production: send to logging service
      // TODO: Integrate with Sentry/LogRocket/DataDog
      if (level === "error") {
        // For now, still log errors to console in production
        console.error(logEntry);
        // Future: window.Sentry?.captureException(...)
      }
    }
  }

  info(message: string, data?: LogData) {
    this.log("info", message, data);
  }

  warn(message: string, data?: LogData) {
    this.log("warn", message, data);
  }

  error(message: string, data?: LogData) {
    this.log("error", message, data);
  }
}

export const logger = new Logger();
