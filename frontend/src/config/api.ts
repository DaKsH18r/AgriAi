// Central API configuration
// VITE_API_BASE_URL should be the backend base URL WITHOUT /api suffix
// Example: https://agriai-production-3a70.up.railway.app

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (envUrl) {
    // Remove trailing slash if present, append /api
    return `${envUrl.replace(/\/$/, "")}/api`;
  }

  // Fallback for local development only
  return "http://localhost:8000/api";
};

// Backend base URL for OAuth (without /api)
export const getBackendBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  
  return "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl();
export const BACKEND_BASE_URL = getBackendBaseUrl();
