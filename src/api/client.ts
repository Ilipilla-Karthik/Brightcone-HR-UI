import axios, { AxiosError } from 'axios';

// If running in browser and targeting local backend, use relative '' to leverage
// Vite dev server proxy (/api -> :5150), preventing any CORS preflight port mismatches.
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined') {
    if (!envUrl || envUrl.includes('localhost:5150') || envUrl.includes('127.0.0.1:5150') || envUrl === window.location.origin) {
      return '';
    }
  }
  return envUrl || 'http://localhost:5150';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach stored token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brightcone_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized error parsing
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);
