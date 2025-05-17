import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;


export const adminDashboardApi = createApi({
  reducerPath: 'adminDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  keepUnusedDataFor: 24 * 60 * 60, // Cache data for 24 hours
  refetchOnMountOrArgChange: false, // Prevent refetch on mount
  tagTypes: ['Dashboard', 'Class', 'Subject', 'Teacher', 'Parent', 'Student'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => ({
        url: 'admin/dashboard/summary',
        headers: {
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          Expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Dashboard'],
      extraOptions: { maxRetries: 1 },
    }),
    addReportComment: builder.mutation({
      query: ({ reportId, message }) => ({
        url: `reports/${reportId}/comments`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Dashboard', 'ParentDashboard'],
    }),
    resetAdminNumber: builder.mutation({
      query: () => ({
        url: 'admin/reset-number',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createTeacher: builder.mutation({
      query: (formData) => ({
        url: 'auth/register-teacher',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    updateTeacher: builder.mutation({
      query: ({ teacherId, formData }) => ({
        url: `teacher/update-teacher/${teacherId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteTeacher: builder.mutation({
      query: (teacherId) => ({
        url: `teacher/delete-teacher/${teacherId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createClass: builder.mutation({
      query: (classData) => ({
        url: 'class/create-class',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteClass: builder.mutation({
      query: (classId) => ({
        url: `class/delete-class/${classId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    updateClass: builder.mutation({
      query: ({ classId, classData }) => ({
        url: `class/update-class/${classId}`,
        method: 'PUT',
        body: classData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createSubject: builder.mutation({
      query: (subjectData) => ({
        url: 'subject/create-subject',
        method: 'POST',
        body: subjectData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    updateSubject: builder.mutation({
      query: ({ subjectId, subjectData }) => ({
        url: `subject/update-subject/${subjectId}`,
        method: 'PUT',
        body: subjectData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteSubject: builder.mutation({
      query: (subjectId) => ({
        url: `subject/delete-subject/${subjectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createParent: builder.mutation({
      query: (parentData) => ({
        url: 'auth/register-parent',
        method: 'POST',
        body: parentData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteParent: builder.mutation({
      query: (parentId) => ({
        url: `parent/delete/${parentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteStudent: builder.mutation({
      query: (studentId) => ({
        url: `student/delete-student/${studentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createStudent: builder.mutation({
      query: (formData) => ({
        url: 'auth/register-student',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    updateStudent: builder.mutation({
      query: ({ studentId, formData }) => ({
        url: `student/update-student/${studentId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    generateVoucher: builder.mutation({
      query: (formData) => ({
        url: 'voucher/generate-voucher',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    createAnnouncement: builder.mutation({
      query: (announcementData) => ({
        url: 'announcements',
        method: 'POST',
        body: announcementData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useAddReportCommentMutation,
  useResetAdminNumberMutation,
  useCreateClassMutation,
  useDeleteClassMutation,
  useUpdateClassMutation,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useCreateParentMutation,
  useDeleteParentMutation,
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
  useGenerateVoucherMutation,
  useCreateAnnouncementMutation,
} = adminDashboardApi;