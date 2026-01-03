import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  dismissible = false,
  onDismiss,
}) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
        <div className="flex-1">
          <h3 className="font-bold text-red-900 mb-1">Something went wrong</h3>
          <p className="text-red-700">{message}</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          )}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
