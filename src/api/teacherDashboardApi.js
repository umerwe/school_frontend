import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const teacherDashboardApi = createApi({
  reducerPath: 'teacherDashboardApi',
  baseQuery: baseQueryWithReauth,
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
      invalidatesTags: ['TeacherDashboard','StudentDashboard','ParentDashboard','Dashboard'],
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