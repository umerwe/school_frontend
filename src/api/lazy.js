// src/api/lazy.js
export let adminDashboardApi;
export let teacherDashboardApi;
export let studentDashboardApi;
export let parentDashboardApi;

export async function initializeApis() {
  const adminApi = await import('./adminDashboardApi');
  const teacherApi = await import('./teacherDashboardApi');
  const studentApi = await import('./studentDashboardApi');
  const parentApi = await import('./parentDashboardApi');

  adminDashboardApi = adminApi.adminDashboardApi;
  teacherDashboardApi = teacherApi.teacherDashboardApi;
  studentDashboardApi = studentApi.studentDashboardApi;
  parentDashboardApi = parentApi.parentDashboardApi;
}