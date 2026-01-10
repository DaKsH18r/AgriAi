/**
 * Error Logging Service
 * Centralized error logging for production monitoring
 */

import { API_BASE_URL } from "../config/api";

interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorLogger {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  /**
   * Log client-side error to backend
   */
  async logError(
    error: Error,
    errorInfo?: { componentStack?: string }
  ): Promise<void> {
    const errorData: ErrorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    try {
      const token = localStorage.getItem("token");
      await fetch(`${this.apiUrl}/errors/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(errorData),
      });
    } catch (err) {
      // Fallback to console if logging fails
      console.error("Failed to log error:", err);
      console.error("Original error:", error);
    }
  }

  /**
   * Log custom event
   */
  async logEvent(
    eventName: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${this.apiUrl}/analytics/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          event: eventName,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent fail for analytics
      console.debug("Analytics event not logged:", eventName);
    }
  }
}

export const errorLogger = new ErrorLogger();
