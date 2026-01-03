import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center animate-fadeIn">        <div className="mb-8 relative">
        <div className="text-[200px] font-bold text-gray-200 leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search
            size={80}
            className="text-green-500/30 animate-pulse-slow"
          />
        </div>
      </div>        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Need help? Try these:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Dashboard", path: "/app" },
              { label: "Documentation", path: "/docs" },
              { label: "Contact Support", path: "/contact" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg font-medium transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
