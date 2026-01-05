// Production-safe API configuration
// VITE_API_BASE_URL MUST be set in environment (e.g., https://agriai-production-3a70.up.railway.app)

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Set it in your environment variables."
  );
}

// Clean URL: remove trailing slash
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "") + "/api";

// Backend base URL for OAuth (without /api suffix)
export const BACKEND_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");
