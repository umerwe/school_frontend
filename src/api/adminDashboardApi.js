import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const adminDashboardApi = createApi({
  reducerPath: 'adminDashboardApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 24 * 60 * 60,
  refetchOnMountOrArgChange: false,
  tagTypes: ['Dashboard', 'Class', 'Subject', 'Teacher', 'Parent', 'Student', 'AdminAI'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => ({
        url: 'admin/dashboard/summary',
        headers: {
          'Cache-Control': 'public, max-age=86400',
          Expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Dashboard'],
      extraOptions: { maxRetries: 1 },
    }),
    // Admin AI endpoint
    getAdminAiResponse: builder.mutation({
      query: ({ userId, prompt }) => ({
        url: `admin-ai/${userId}`,
        method: 'POST',
        body: { prompt },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => ({
        status: response.status,
        data: response.data || { error: 'Something went wrong' }
      }),
      invalidatesTags: ['AdminAI'],
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
    changePassword: builder.mutation({
      query: ({ id, oldPassword, newPassword, role }) => ({
        url: `auth/change-password/${id}`,
        method: 'POST',
        body: { oldPassword, newPassword, role },
      }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetAdminAiResponseMutation, // New export for Admin AI
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
  useChangePasswordMutation,
} = adminDashboardApi;