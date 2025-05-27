import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const studentDashboardApi = createApi({
  reducerPath: 'studentDashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['StudentDashboard'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => 'student/dashboard/summary',
      transformResponse: (response) => response.data,
      providesTags: ['StudentDashboard'],
    }),
    resetAnnouncementsCount: builder.mutation({
      query: (studentId) => ({
        url: `student/${studentId}/reset-number`,
        method: 'POST',
      }),
      invalidatesTags: ['StudentDashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useResetAnnouncementsCountMutation,
} = studentDashboardApi;