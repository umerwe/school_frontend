import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;

export const teacherDashboardApi = createApi({
  reducerPath: 'teacherDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['TeacherDashboard'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => 'teacher/dashboard/summary',
      transformResponse: (response) => response.data,
      providesTags: ['TeacherDashboard'],
    }),
    submitAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: 'attendance',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['TeacherDashboard','StudentDashboard','ParentDashboard'],
    }),
    submitMarks: builder.mutation({
      query: (marksData) => ({
        url: 'marks/submit-marks',
        method: 'POST',
        body: marksData,
      }),
      invalidatesTags: ['TeacherDashboard','StudentDashboard','ParentDashboard'],
    }),
    deleteMarks: builder.mutation({
      query: (recordId) => ({
        url: `marks/delete-marks/${recordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TeacherDashboard','StudentDashboard','ParentDashboard'],
    }),
    resetNumber: builder.mutation({
      query: (teacherId) => ({
        url: `teacher/${teacherId}/reset-number`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['TeacherDashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useSubmitAttendanceMutation,
  useSubmitMarksMutation,
  useDeleteMarksMutation,
  useResetNumberMutation,
} = teacherDashboardApi;