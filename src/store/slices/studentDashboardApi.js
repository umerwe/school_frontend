export const studentDashboardApi = createApi({
  reducerPath: 'studentDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
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
    resetAnnouncementsCount: builder.mutation({
      query: (studentId) => ({
        url: `student/${studentId}/reset-number`,
        method: 'POST',
      }),
      invalidatesTags: ['StundentDashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useResetAnnouncementsCountMutation,
} = studentDashboardApi;