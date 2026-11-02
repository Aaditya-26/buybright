/// <reference types="vite/client" />
import axios, { AxiosError } from 'axios';

// Create central Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor with graceful offline handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Suppress console spam when backend is offline during frontend-only design workflow
    if (error.response?.status !== 503 && error.code !== 'ERR_NETWORK') {
      console.warn('API Notice:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
