import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

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

import { useRefreshTokensMutation } from '../src/api/authApi.js';
import { initializeAuth, logout, updateTokens } from '../src/store/slices/userSlice.js';
import DotPulseLoader from '../src/components/DotPulseLoader.jsx';
import ServerDown from './components/ServerDown.jsx';
import ChangeTeacherPassword from './components/Teachers/ChangePassword.jsx';
import ChangeStudentPassword from './components/Students/ChangePassword.jsx';
import ChangeParentPassword from './components/Parents/ChangePassword.jsx';
import ChangeAdminPassword from './components/Admin/ChangePassword.jsx';

// Token utility functions
export const checkTokenExpiration = (token, bufferSeconds = 0) => {
  if (!token) return true;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return decoded.exp < (now + bufferSeconds);
  } catch (e) {
    return true;
  }
};

export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (e) {
    return null;
  }
};

export const getTimeUntilExpiration = (token) => {
  const expTime = getTokenExpirationTime(token);
  if (!expTime) return 0;
  
  return Math.max(0, expTime - Date.now());
};

// Token Manager Hook
const useTokenManager = () => {
  const { tokens, isAuthenticated } = useSelector((store) => store.userSlice);
  const dispatch = useDispatch();
  const [refreshTokens] = useRefreshTokensMutation();
  const intervalRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const [tokenStatus, setTokenStatus] = useState({
    accessTokenValid: true,
    refreshTokenValid: true,
    timeUntilAccessExpiry: null,
    timeUntilRefreshExpiry: null,
  });

  const updateTokenStatus = () => {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      setTokenStatus({
        accessTokenValid: false,
        refreshTokenValid: false,
        timeUntilAccessExpiry: null,
        timeUntilRefreshExpiry: null,
      });
      return;
    }

    const accessTokenValid = !checkTokenExpiration(tokens.accessToken, 30);
    const refreshTokenValid = !checkTokenExpiration(tokens.refreshToken, 0);
    const timeUntilAccessExpiry = getTimeUntilExpiration(tokens.accessToken);
    const timeUntilRefreshExpiry = getTimeUntilExpiration(tokens.refreshToken);

    setTokenStatus({
      accessTokenValid,
      refreshTokenValid,
      timeUntilAccessExpiry,
      timeUntilRefreshExpiry,
    });

    return { accessTokenValid, refreshTokenValid };
  };

  const handleTokenRefresh = async () => {
    if (isRefreshingRef.current || !tokens?.refreshToken) return;

    // Check if refresh token is expired (no buffer for refresh token)
    if (checkTokenExpiration(tokens.refreshToken, 0)) {
      dispatch(logout({ manual: false }));
      return;
    }

    // Check if access token needs refresh (with 30-second buffer)
    if (!checkTokenExpiration(tokens.accessToken, 30)) {
      return; // Access token is still valid
    }

    isRefreshingRef.current = true;

    try {
      const result = await refreshTokens().unwrap();
      dispatch(updateTokens(result));
    } catch (error) {
      dispatch(logout({ manual: false }));
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const checkAndRefreshTokens = async () => {
    if (!isAuthenticated || !tokens?.accessToken || !tokens?.refreshToken) {
      return;
    }

    // First check if refresh token is expired (exact expiry, no buffer)
    if (checkTokenExpiration(tokens.refreshToken, 0)) {
      console.log('Refresh token expired, logging out');
      dispatch(logout({ manual: false }));
      return;
    }

    // Update token status
    const status = updateTokenStatus();
    
    // If access token is expired or about to expire (30-second buffer), refresh it
    if (!status.accessTokenValid && !isRefreshingRef.current) {
      await handleTokenRefresh();
    }
  };

  // Initialize token status on mount
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken && tokens?.refreshToken) {
      updateTokenStatus();
    }
  }, [tokens, isAuthenticated]);

  // Set up periodic token checking
  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check tokens immediately
    checkAndRefreshTokens();

    // Set up interval to check every minute
    intervalRef.current = setInterval(() => {
      checkAndRefreshTokens();
    }, 60000); // 60 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, tokens?.accessToken, tokens?.refreshToken]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    tokenStatus,
    refreshTokensManually: handleTokenRefresh,
  };
};

function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isManualLogout, tokens } = useSelector((store) => store.userSlice);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const dispatch = useDispatch();
  const [refreshTokens] = useRefreshTokensMutation();

  useEffect(() => {
    const checkTokens = async () => {
      if (!isAuthenticated || !tokens?.accessToken || !tokens?.refreshToken) {
        setIsCheckingSession(false);
        return;
      }

      // Check refresh token expiry first (exact expiry, no buffer)
      const isRefreshTokenExpired = checkTokenExpiration(tokens.refreshToken, 0);
      
      if (isRefreshTokenExpired) {
        dispatch(logout({ manual: false }));
        setIsCheckingSession(false);
        return;
      }

      // Check access token with buffer for proactive refresh
      const isAccessTokenExpired = checkTokenExpiration(tokens.accessToken, 30);

      // Only refresh on initial load if access token is expired or about to expire
      // The useTokenManager hook will handle periodic refreshing
      if (isAccessTokenExpired) {
        try {
          const result = await refreshTokens().unwrap();
          dispatch(updateTokens(result));
        } catch (error) {
          dispatch(logout({ manual: false }));
        }
      }

      setIsCheckingSession(false);
    };

    checkTokens();
  }, [isAuthenticated, tokens, dispatch, refreshTokens]);

  if (isCheckingSession) {
    return <DotPulseLoader />;
  }

  if (!isAuthenticated || !user) {
    return isManualLogout ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/session-expired" replace />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
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
        dispatch(logout({ manual: false }));
        return <Navigate to="/session-expired" replace />;
    }
  }

  return children;
}

// App.jsx
function App() {
  const { user, isAuthenticated } = useSelector((store) => store.userSlice);
  const dispatch = useDispatch();
  
  // Initialize token manager for automatic token checking
  const { tokenStatus } = useTokenManager();

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

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
                // Fallback for unknown roles - treat as logout
                <Navigate to="/" replace />
              )
            ) : (
              <LoginForm />
            )
          }
        />
        <Route path="/session-expired" element={<SessionExpired />} />
        <Route path="/server-down" element={<ServerDown />} />

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
          <Route path="change-password" element={<ChangeAdminPassword />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="classes/new" element={<ClassForm />} />
          <Route path="classes/:id/edit" element={<EditClass />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/new" element={<SubjectForm />} />
          <Route path="subjects/:id/edit" element={<EditSubject />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/:teacherId/update" element={<UpdateTeacher />} />
          <Route path="teachers/:teacherId/change-password" element={<ChangeTeacherPassword />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          <Route path="teacher/profile" element={<TeacherProfile />} />
          <Route path="parents" element={<ParentList />} />
          <Route path="parents/new" element={<ParentForm />} />
          <Route path="parents/:id/change-password" element={<ChangeParentPassword />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:studentId/update" element={<UpdateStudent />} />
          <Route path="students/:studentId/change-password" element={<ChangeStudentPassword />} />
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