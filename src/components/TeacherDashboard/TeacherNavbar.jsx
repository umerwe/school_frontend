import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  BookOpen,
  Users,
  Menu,
  X,
  Search,
  LogOut,
  UserCircle,
  GraduationCap,
  Calendar,
  Clock,
  Megaphone,
  ChevronDown,
  Settings,
  User2,
  Bot,
  MessageSquare,
  Bell,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/userSlice";
import { message } from "antd";
import axios from "axios";
import { teacherDashboardApi, useGetDashboardSummaryQuery, useResetNumberMutation } from "../../store/slices/teacherDashboardApi";

export default function TeacherNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector((store) => store.userSlice.user);
  const dropdownRef = useRef();
  const sidebarRef = useRef();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [newAnnouncementsCount, setNewAnnouncementsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch dashboard summary data
  const { data: dashboardData, isError, error } = useGetDashboardSummaryQuery();

  // Reset number mutation
  const [resetNumber, { isLoading: isResetting }] = useResetNumberMutation();

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobile) {
        setShowMobileSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUnreadAnnouncementsCount = () => {
    try {
      const count = dashboardData?.teacherNumber.number ?? 0;
      setNewAnnouncementsCount(count);
    } catch (err) {
      message.error("Error fetching announcements count");
      setNewAnnouncementsCount(0);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchUnreadAnnouncementsCount();
    } else {
      message.error("User ID not found. Please log in again.");
    }
  }, [currentUser?._id, dashboardData]);

  useEffect(() => {
    const interval = setInterval(fetchUnreadAnnouncementsCount, 60000);
    return () => clearInterval(interval);
  }, [currentUser?._id, dashboardData]);

  const resetAnnouncementCount = async () => {
    try {
      await resetNumber(currentUser._id).unwrap();
      setNewAnnouncementsCount(0);
    } catch (error) {
      message.error(error?.data?.message || "Error resetting announcements count");
    }
  };

  useEffect(() => {
    if (location.pathname === "/teacher-dashboard/announcements") {
      resetAnnouncementCount();
    }
  }, [location.pathname, currentUser?._id]);

  const handleLogout = async () => {
    setIsDropdownVisible(false);

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;

    try {
      await axios.post(
        `${baseUrl}auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(teacherDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:teacherDashboardApi');
      dispatch(logout());
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(teacherDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:teacherDashboardApi');
      dispatch(logout());
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/teacher-dashboard" },
    { icon: <BookOpen size={20} />, label: "My Subjects", path: "/teacher-dashboard/subjects" },
    { icon: <Users size={20} />, label: "My Class", path: "/teacher-dashboard/classes" },
    { icon: <GraduationCap size={20} />, label: "My Students", path: "/teacher-dashboard/students" },
    { icon: <UserCircle size={20} />, label: "Submit Marks", path: "/teacher-dashboard/marks/submit" },
    { icon: <BookOpen size={20} />, label: "Submitted Marks", path: "/teacher-dashboard/marks/all" },
    { icon: <Calendar size={20} />, label: "Mark Attendance", path: "/teacher-dashboard/attendance" },
    { icon: <Clock size={20} />, label: "View Attendance", path: "/teacher-dashboard/attendance/history" },
    {
      icon: (
        <div className="relative">
          <Megaphone size={20} />
          {newAnnouncementsCount > 0 ? (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full"
              data-testid="announcement-badge"
            >
              {newAnnouncementsCount}
            </span>
          ) : null}
        </div>
      ),
      label: "Announcements",
      path: "/teacher-dashboard/announcements",
      onClick: async () => {
        await resetAnnouncementCount();
      },
    },
    { icon: <Bot size={20} />, label: "AI Assistant", path: "/teacher-dashboard/ai-assistant" },
  ];

  return (
    <div className="flex h-screen min-w-[340px] overflow-hidden bg-gray-50 relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-indigo-500 text-white h-full transition-all duration-300 ease-in-out ${isMobile
          ? `fixed top-0 left-0 z-20 w-64 shadow-xl rounded-sm ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`
          : isSidebarOpen
            ? 'w-64 md:w-58'
            : 'w-20'
          } shadow-xl z-10 rounded-sm`}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-indigo-400">
          {(isSidebarOpen || isMobile) && (
            <div className="flex items-center gap-1">
              <GraduationCap className="h-8 md:h-10 w-8 md:w-10 text-amber-400 -rotate-[15deg]" />
              <span
                style={{ fontFamily: "Nunito, sans-serif" }}
                className="text-xl md:text-[22px] font-extrabold tracking-wide mt-1"
              >
                <span className="text-white">e</span>
                <span className="text-white">School</span>
                <span className="text-white">.</span>
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-white p-1 sm:p-1.5 rounded-md hover:bg-indigo-400 transition-colors ml-1"
          >
            {(isSidebarOpen || isMobile) ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="px-2 sm:px-3 pb-0 pt-3">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (item.onClick) item.onClick();
                  if (isMobile) setShowMobileSidebar(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${location.pathname === item.path
                  ? "bg-indigo-400 shadow-lg shadow-indigo-900/20"
                  : "text-white hover:bg-indigo-400 hover:text-white hover:translate-x-1"
                  }`}
              >
                <span
                  className={`flex-shrink-0 ${location.pathname === item.path
                    ? "text-indigo-100"
                    : "text-white hover:text-white"
                    }`}
                >
                  {item.icon}
                </span>
                {(isSidebarOpen || isMobile) && (
                  <span
                    className={`text-sm font-medium ${location.pathname === item.path
                      ? "text-white"
                      : "text-white hover:text-white"
                      }`}
                    style={{
                      fontFamily: "Nunito, sans-serif",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && isMobile && (
        <div
          className="fixed inset-0 bg-gray-800/30 backdrop-blur-md z-10"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-indigo-600 mr-2"
              >
                <Menu size={22} />
              </button>
            )}
            <div className="flex items-center">
              <User2 size={20} className="text-indigo-500 mr-1 sm:mr-2" />
              <span
                style={{ fontFamily: "Nunito, sans-serif" }}
                className="text-md md:text-lg font-bold mt-1 text-gray-700 flex items-center"
              >
                {isMobile ? "Teacher" : "Teacher"}
                <span className="text-indigo-500 ml-1 text-xs sm:text-sm bg-indigo-100 px-2 md:px-3 py-0.5 mt-0.5 md:mt-0 rounded-full">
                  Dashboard
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="relative pt-1">
              <button
                onClick={() => {
                  navigate('/teacher-dashboard/announcements');
                  if (currentUser?._id) {
                     resetNotificationCount(currentUser._id).unwrap().catch((err) => {
                        message.error(err?.data?.message || "Error resetting notifications count");
                      });
                  }
                }}
                className="text-gray-600 hover:text-indigo-600 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {newAnnouncementsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {newAnnouncementsCount}
                  </span>
                )}
              </button>
            </div>

            {isSearchVisible && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 sm:px-4 py-1.5 sm:py-2 pr-8 border border-gray-200 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 w-48 sm:w-64 shadow-sm"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchVisible(false)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-1 sm:gap-2 cursor-pointer group"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                <div className="w-8 sm:w-8 h-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br border-2 border-indigo-400 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white">
                  {currentUser?.logo ? (
                    <img
                      src={currentUser.logo}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={16} />
                  )}
                </div>
                {!isMobile && (
                  <div className="flex items-center">
                    <ChevronDown
                      size={14}
                      className={`text-gray-600 transition-transform duration-200 ${isDropdownVisible ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
              </div>

              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 md:w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-3 sm:px-4 py-3 sm:py-4 border-b bg-gradient-to-r from-indigo-50 to-gray-50">
                    <p
                      className="text-xs sm:text-sm font-semibold text-gray-900"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {capitalizeWords(currentUser?.name) || "Teacher"}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate mt-0.5"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {currentUser?.email || "teacher@gmail.com"}
                    </p>
                  </div>
                  <ul className="py-1 sm:py-2">
                    <li
                      onClick={() => {
                        setIsDropdownVisible(false);
                        navigate("/teacher-dashboard/profile");
                      }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 hover:bg-indigo-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      <Settings className="text-indigo-500" size={16} />
                      <span
                        className="text-xs sm:text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Profile Settings
                      </span>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 hover:bg-red-50 cursor-pointer text-red-500 transition-colors"
                    >
                      <LogOut size={16} />
                      <span
                        className="text-xs sm:text-sm font-medium"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Logout
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}