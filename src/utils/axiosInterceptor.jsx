import axios from 'axios';
import { store } from '../store/store';
import { logout, updateTokens } from '../store/slices/userSlice';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
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
  // For successful responses, just return them
  (response) => {
    serverDownCounter = 0; // Reset server down counter
    return response;
  },
  
  // For errors, handle token refresh or server down
  async (error) => {
    const originalRequest = error.config;
    
    // Handle server down (no response)
    if (!error.response) {
      serverDownCounter++;
      
      if (serverDownCounter >= MAX_SERVER_RETRIES) {
        serverDownCounter = 0;
        
        // Only redirect if not already on session expired page
        if (window.location.pathname !== '/session-expired') {
          store.dispatch(logout());
          window.location.href = '/session-expired';
        }
      }
      
      return Promise.reject(error);
    }
    
    // Handle token expiration (401 error)
    if (error.response.status === 401 && !originalRequest._retry) {
      // Skip refreshing for refresh token endpoint
      if (originalRequest.url?.includes('/auth/refresh-tokens')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      // Start refresh process if not already refreshing
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Try to get new tokens
          const response = await api.post('/auth/refresh-tokens');
          const { newAccessToken, newRefreshToken } = response.data.data;
          
          // Update tokens in store
          store.dispatch(updateTokens({ newAccessToken, newRefreshToken }));
          
          // Update current request auth header
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Process queued requests with new token
          requestQueue.forEach(req => req.resolve(newAccessToken));
          requestQueue = [];
          
          isRefreshing = false;
          
          // Retry original request with new token
          return api(originalRequest);
        } 
        catch (refreshError) {
          // Failed to refresh token
          isRefreshing = false;
          
          // Reject all queued requests
          requestQueue.forEach(req => req.reject(refreshError));
          requestQueue = [];
          
          // Logout and redirect
          store.dispatch(logout());
          
          if (window.location.pathname !== '/session-expired') {
            window.location.href = '/session-expired';
          }
          
          return Promise.reject(refreshError);
        }
      } 
      else {
        // If already refreshing, add this request to queue
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
    
    // For any other error, just reject
    return Promise.reject(error);
  }
);

export default api;