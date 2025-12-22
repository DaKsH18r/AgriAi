import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorDisplay({
  message = "Unable to load data. Please try again.",
  onRetry,
  showRetry = true,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-4">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
}
