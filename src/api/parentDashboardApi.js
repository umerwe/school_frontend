import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const parentDashboardApi = createApi({
  reducerPath: 'parentDashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ParentDashboard', 'Dashboard'],
  endpoints: (builder) => ({
    getParentDashboardSummary: builder.query({
      query: () => 'parent/dashboard/summary',
      transformResponse: (response) => response.data,
      providesTags: ['ParentDashboard'],
    }),
    getParentAiResponse: builder.mutation({
      query: (prompt) => ({
        url: `parent-ai`,
        method: 'POST',
        body: { prompt },
      }),
      transformResponse: (response) => ({
        data: {
          children: response.data.children.map(child => ({
            id: child.id,
            name: child.name,
            result: child.result
          }))
        }
      }),
      transformErrorResponse: (response) => ({
        status: response.status,
        data: response.data || { error: 'Something went wrong' }
      }),
    }),
    submitParentReport: builder.mutation({
      query: (reportData) => ({
        url: 'parent/submit/reports',
        method: 'POST',
        body: reportData,
      }),
      invalidatesTags: ['ParentDashboard', 'Dashboard'],
    }),
    createCheckoutSession: builder.mutation({
      query: (voucherData) => ({
        url: 'create-checkout-session',
        method: 'POST',
        body: voucherData,
      }),
      transformResponse: (response) => response,
    }),
    verifyPayment: builder.mutation({
      query: (voucherData) => ({
        url: 'verify-payment',
        method: 'POST',
        body: voucherData,
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['ParentDashboard'],
    }),
    resetNotificationCount: builder.mutation({
      query: (parentId) => ({
        url: `parent/${parentId}/reset-number`,
        method: 'POST',
        body: {},
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['ParentDashboard'],
    }),
    resetReportCommentsCount: builder.mutation({
      query: (parentId) => ({
        url: `parent/${parentId}/reset-report-comments-number`,
        method: 'POST',
        body: {},
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetParentDashboardSummaryQuery,
  useSubmitParentReportMutation,
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
  useResetNotificationCountMutation,
  useResetReportCommentsCountMutation,
  useGetParentAiResponseMutation
} = parentDashboardApi;