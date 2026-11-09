/// <reference types="vite/client" />
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create central Axios instance for BuyBright Marketplace
export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api',
  timeout: 2500,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: injects JWT bearer token if user is signed in
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem('buybright_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Graceful fallback if localStorage is unavailable
  }
  return config;
});

// Response interceptor with graceful offline handling and 401 session clearing
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('buybright_token');
        localStorage.removeItem('buybright_auth_user');
      } catch {
        // Ignore storage error
      }
    }
    // Suppress console spam when backend is offline during frontend-only design workflow
    if (error.response?.status !== 503 && error.code !== 'ERR_NETWORK') {
      console.warn('API Notice:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
