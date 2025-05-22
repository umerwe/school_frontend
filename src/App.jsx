import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import LoginForm from './components/LoginForm.jsx';
import AdminRegisterForm from './components/Admin/AdminRegisterForm.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';

import ClassList from './components/Classes/ClassList.jsx';
import ClassForm from './components/Classes/ClassForm.jsx';
import EditClass from './components/Classes/EditClass.jsx';

import SubjectList from './components/Subjects/SubjectList.jsx';
import SubjectForm from './components/Subjects/SubjectForm.jsx';
import EditSubject from './components/Subjects/EditSubject.jsx';

import TeacherList from './components/Teachers/TeacherList.jsx';
import TeacherForm from './components/Teachers/TeacherForm.jsx';
import TeacherProfile from './components/Teachers/TeacherProfile.jsx';

import StudentList from './components/Students/StudentList.jsx';
import StudentForm from './components/Students/StudentForm.jsx';
import StudentProfile from './components/Students/StudentProfile.jsx';

import AdminProfile from './components/Admin/AdminProfile.jsx';

import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard.jsx';
import TeacherProfileDashboard from './components/TeacherDashboard/TeacherProfileDashboard.jsx';
import TeacherSubjects from './components/TeacherDashboard/TeacherSubjects.jsx';
import ClassDetailView from './components/TeacherDashboard/ClassDetailView.jsx';
import SubmitMarks from './components/TeacherDashboard/SubmitMarks.jsx';
import AllMarks from './components/TeacherDashboard/AllMarks.jsx';
import TeacherStudentList from './components/TeacherDashboard/TeacherStudentList.jsx';


import TeacherAttendance from './components/TeacherDashboard/TeacherAttendance.jsx';
import TeacherAttendanceHistory from './components/TeacherDashboard/TeacherAttendanceHistory.jsx';
import SessionExpired from './components/SessionExpired.jsx';

// PrivateRoute.jsx
import { useEffect, useState } from 'react';
import api from '../src/utils/axiosInterceptor.jsx';
import StudentDashboard from './components/StudentDashboard/StudentDashboard.jsx';
import StudentProfileDashboard from './components/StudentDashboard/StudentProfileDashboard.jsx';
import StudentSubjects from './components/StudentDashboard/StudentSubjects.jsx';
import StudentMarks from './components/StudentDashboard/StudentMarks.jsx';
import StudentAttendance from './components/StudentDashboard/StudentAttendance.jsx';
import AdminAnnouncementForm from './components/Admin/AdminAnnouncementForm.jsx';
import StudentAnnouncements from './components/StudentDashboard/StudentAnnouncements.jsx';
import TeacherAnnouncements from './components/TeacherDashboard/TeacherAnnouncements.jsx';
import AdminAi from './components/Admin/AdminAi.jsx';
import UpdateTeacher from './components/Teachers/UpdateTeacher.jsx';
import UpdateStudent from './components/Students/UpdateStudent.jsx';
import ParentList from './components/Parents/ParentsList.jsx';
import ParentForm from './components/Parents/ParentForm.jsx';
import ParentDashboard from './components/ParentDashboard/ParentDashboard.jsx'
import ParentProfile from './components/ParentDashboard/ParentProfile.jsx';
import ParentChildren from './components/ParentDashboard/ParentChildren.jsx';
import ParentAttendance from './components/ParentDashboard/ParentAttendance.jsx';
import CreateVoucher from './components/Admin/CreateVoucher.jsx';
import VoucherList from './components/Admin/VouchersList.jsx';
import ParentVouchers from './components/ParentDashboard/ParentVouchers.jsx';
import PaymentSuccess from './components/ParentDashboard/ParentSuccess.jsx';
import PaymentCanceled from './components/ParentDashboard/PaymentCancel.jsx';
import Announcements from './components/ParentDashboard/Announcements.jsx';
import AdminAnnouncements from './components/Admin/Announcements.jsx'
import Dashboard from './components/Admin/Dashboard.jsx';
import TeacherDb from './components/TeacherDashboard/Dashboard.jsx';
import ParentDb from './components/ParentDashboard/Dashboard.jsx';
import FeeStatus from './components/StudentDashboard/FeeStatus.jsx';
import StudentAi from './components/StudentDashboard/StudentAi.jsx';
import ParentAi from './components/ParentDashboard/ParentAi.jsx';
import StudentDb from './components/StudentDashboard/Dashboard.jsx'
import ChildMarks from './components/ParentDashboard/ChildsMarks.jsx';
import TeacherAi from './components/TeacherDashboard/TeacherAi.jsx';
import ViewReports from './components/ParentDashboard/ViewReport.jsx';
import AdminReports from './components/Admin/AdminReport.jsx';
import SubmitReport from './components/ParentDashboard/SubmitReport.jsx';
import Attendance from './components/Admin/Attendance.jsx';
import DotPulseLoader from './components/DotPulseLoader.jsx'

function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useSelector((store) => store.userSlice);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerDown, setIsServerDown] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!isAuthenticated || !user) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        await api.get('/auth/verify-session', {
          withCredentials: true
        });
        
        if (isMounted) {
          setIsLoading(false);
          setIsServerDown(false);
        }
      } catch (error) {
        if (!error.response) {
          if (isMounted) {
            setIsServerDown(true);
            setIsLoading(false);
          }
          return;
        }

        // If 401, let interceptor handle it
        if (error.response?.status === 401 && isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, dispatch]);

  if (isLoading) {
    return <DotPulseLoader />;
  }

  // If not authenticated, redirect to home (login) page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />; // Changed from /session-expired to /
  }

  // Server down UI
  if (isServerDown) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Server Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We're unable to connect to the server. Please try again later.
          </p>
          <button
            onClick={() => {
              setIsServerDown(false);
              setIsLoading(true);
              // Try to reconnect immediately
              api
                .get('/auth/verify-session')
                .then(() => setIsLoading(false))
                .catch(() => setIsServerDown(true));
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect based on user role
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher-dashboard" replace />;
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      case 'parent':
        return <Navigate to="/parent-dashboard" replace />;
      default:
        // If no valid role, logout and redirect
        dispatch(logout());
        return <Navigate to="/session-expired" replace />;
    }
  }

  // All checks passed, render children
  return children;
}

// App.jsx
function App() {
  const { user, isAuthenticated } = useSelector((store) => store.userSlice);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          path="/"
          element={
            isAuthenticated && user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : user.role === 'teacher' ? (
                <Navigate to="/teacher-dashboard" replace />
              ) : user.role === 'parent' ? (
                <Navigate to="/parent-dashboard" replace />
              ) : user.role === 'student' ? (
                <Navigate to="/student-dashboard" replace />
              ) : (
                // Fallback for unknown roles
                <Navigate to="/session-expired" replace />
              )
            ) : (
              <LoginForm />
            )
          }
        />
        <Route path="/session-expired" element={<SessionExpired />} />

        <Route
          path="/admin-register"
          element={!isAuthenticated ? <AdminRegisterForm /> : <Navigate to="/" replace />}
        />

        {/* Protected routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="classes/new" element={<ClassForm />} />
          <Route path="classes/:id/edit" element={<EditClass />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/new" element={<SubjectForm />} />
          <Route path="subjects/:id/edit" element={<EditSubject />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/:teacherId/update" element={<UpdateTeacher />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          <Route path="teacher/profile" element={<TeacherProfile />} />
          <Route path="parents" element={<ParentList />} />
          <Route path="parents/new" element={<ParentForm />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:studentId/update" element={<UpdateStudent />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="student/profile" element={<StudentProfile />} />
          <Route path="announcement/new" element={<AdminAnnouncementForm />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="ai-assistant" element={<AdminAi />} />
          <Route path="vouchers" element={<VoucherList />} />
          <Route path="create-voucher" element={<CreateVoucher />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<TeacherDb />} />
          <Route path="profile" element={<TeacherProfileDashboard />} />
          <Route path="subjects" element={<TeacherSubjects />} />
          <Route path="classes" element={<ClassDetailView />} />
          <Route path="students" element={<TeacherStudentList />} />
          <Route path="student/profile" element={<StudentProfile />} />
          <Route path="marks/submit" element={<SubmitMarks />} />
          <Route path="marks/all" element={<AllMarks />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="attendance/history" element={<TeacherAttendanceHistory />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="ai-assistant" element={<TeacherAi />} />
        </Route>

        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentDb />} />
          <Route path="profile" element={<StudentProfileDashboard />} />
          <Route path="subjects" element={<StudentSubjects />} />
          <Route path="marks" element={<StudentMarks />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="fee-status" element={<FeeStatus />} />
          <Route path="ai-assistant" element={<StudentAi />} />
        </Route>

        <Route
          path="/parent-dashboard"
          element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<ParentDb />} />
          <Route path="profile" element={<ParentProfile />} />
          <Route path="children" element={<ParentChildren />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="fees" element={<ParentVouchers />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-canceled" element={<PaymentCanceled />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="marks" element={<ChildMarks />} />
          <Route path="ai-assistant" element={<ParentAi />} />
          <Route path="submit-report" element={<SubmitReport />} />
          <Route path="view-reports" element={<ViewReports />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;