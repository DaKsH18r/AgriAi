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

    if (this.isDevelopment) {
      const consoleMethod =
        level === "error"
          ? console.error
          : level === "warn"
            ? console.warn
            : console.log;
      consoleMethod(`[${level.toUpperCase()}]`, message, data || "");
    } else {
      if (level === "error") {
        console.error(logEntry);
      }
    }
  }

  info(message: string, data?: LogData) {
    this.log("info", message, data);
  }

  warn(message: string, data?: LogData) {
    this.log("warn", message, data);
  }

  error(message: string, data?: LogData | unknown) {
    this.log("error", message, data as LogData);
  }
}

export const logger = new Logger();
