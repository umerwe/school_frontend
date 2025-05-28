import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { logout, updateTokens } from '../store/slices/userSlice';

const baseUrl =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_LOCAL;

export const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { tokens } = getState().userSlice;
    if (tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }
    return headers;
  },
});

let isManualLogout = false;
let isRefreshingToken = false;
let refreshPromise = null;

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle server down/network errors
  if (result.error && (result.error.status === 'FETCH_ERROR' || result.error.status === 503)) {
    window.location.href = '/server-down';
    return result;
  }

  if (result?.error?.status === 401 && !isManualLogout) {
    // If already refreshing, wait for the existing refresh to complete
    if (isRefreshingToken && refreshPromise) {
      try {
        await refreshPromise;
        // Retry the original request with potentially new tokens
        result = await baseQuery(args, api, extraOptions);
        return result;
      } catch (error) {
        return result;
      }
    }

    // Start token refresh process
    isRefreshingToken = true;
    refreshPromise = (async () => {
      try {
        // Try to refresh tokens
        const refreshResult = await baseQuery(
          { url: '/auth/refresh-tokens', method: 'POST' },
          api,
          extraOptions
        );
        
        if (refreshResult.data?.data) {
          // Store the new tokens
          api.dispatch(updateTokens(refreshResult.data.data));
          return true;
        } else {
          // Refresh failed - logout the user
          api.dispatch(logout({ manual: false }));
          window.location.href = '/session-expired';
          return false;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        api.dispatch(logout({ manual: false }));
        window.location.href = '/session-expired';
        return false;
      } finally {
        isRefreshingToken = false;
        refreshPromise = null;
      }
    })();

    const refreshSuccess = await refreshPromise;
    
    if (refreshSuccess) {
      // Retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    }
  }
  
  return result;
};

export const setManualLogout = (value) => {
  isManualLogout = value;
};