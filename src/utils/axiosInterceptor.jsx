import axios from 'axios';
import { store } from '../store/store';
import { logout, updateTokens } from '../store/slices/userSlice';

const baseUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD || 'https://api.production.com'
    : import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:3000';

const api = axios.create({
  baseURL: baseUrl, // Fixed typo
  withCredentials: true,
  timeout: 8000 // 8 seconds timeout
});

// Count failed server connections
let serverDownCounter = 0;
const MAX_SERVER_RETRIES = 3;

// Token refresh state
let isRefreshing = false;
let requestQueue = [];

// Response interceptor - handles response errors and token refresh
api.interceptors.response.use(
  (response) => {
    serverDownCounter = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle server down
    if (!error.response) {
      serverDownCounter++;
      if (serverDownCounter >= MAX_SERVER_RETRIES) {
        serverDownCounter = 0;
        store.dispatch(logout());
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    // Handle token expiration (401 error)
    if (error.response.status === 401 && !originalRequest._retry) {
      // Skip if this is already a refresh token request
      if (originalRequest.url.includes('/auth/refresh-tokens')) {
        store.dispatch(logout());
        window.location.href = '/';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await api.post('/auth/refresh-tokens', {}, {
            withCredentials: true,
            _retry: true // Mark this as a retry to prevent infinite loops
          });

          const { newAccessToken, newRefreshToken } = response.data.data;
          store.dispatch(updateTokens({ newAccessToken, newRefreshToken }));
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Process queued requests
          requestQueue.forEach(req => req.resolve(newAccessToken));
          requestQueue = [];
          
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          requestQueue.forEach(req => req.reject(refreshError));
          requestQueue = [];
          
          store.dispatch(logout());
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err)
          });
        });
      }
    }

    // For any other error
    return Promise.reject(error);
  }
);

export default api;