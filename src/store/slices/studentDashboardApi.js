import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentDashboardApi = createApi({
  reducerPath: 'studentDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['StudentDashboard'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => 'student/dashboard/summary',
      transformResponse: (response) => response.data,
      providesTags: ['StudentDashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
} = studentDashboardApi;