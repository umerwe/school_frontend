// src/api/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshTokens: builder.mutation({
      query: () => ({
        url: '/auth/refresh-tokens',
        method: 'POST',
      }),
    }),
  }),
});

export const { useRefreshTokensMutation } = authApi;