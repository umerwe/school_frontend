import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;

export const parentDashboardApi = createApi({
  reducerPath: 'parentDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['ParentDashboard', 'Dashboard'],
  endpoints: (builder) => ({
    getParentDashboardSummary: builder.query({
      query: () => 'parent/dashboard/summary',
      transformResponse: (response) => response.data,
      providesTags: ['ParentDashboard'],
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
      transformResponse: (response) => response.data,
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
      invalidatesTags: ['ParentDashboard'],
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
} = parentDashboardApi;