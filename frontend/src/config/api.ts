export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
