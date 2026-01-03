import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50/30 to-orange-50/30 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center animate-fadeIn">        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-red-100 rounded-full">
            <AlertTriangle size={80} className="text-red-600" />
          </div>
        </div>        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're sorry, but something unexpected happened. Our team has been
          notified and is working on a fix.
        </p>        <div className="inline-block px-6 py-3 bg-red-50 border border-red-200 rounded-xl mb-8">
          <p className="text-sm font-mono text-red-800">Error Code: 500</p>
        </div>        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transition"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            If the problem persists, please contact support:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@agri-ai.com"
              className="px-6 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              support@agri-ai.com
            </a>
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 text-sm text-green-600 hover:bg-green-50 rounded-lg font-medium transition"
            >
              Contact Form
            </button>
          </div>
        </div>        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-left">
          <h3 className="font-bold text-gray-900 mb-3">What you can do:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Check your internet connection</li>
            <li>• Clear your browser cache and cookies</li>
            <li>• Try using a different browser</li>
            <li>• Contact support if the issue continues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
