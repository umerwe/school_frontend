import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import {
  Users,
  BookOpen,
  User,
  UserPlus,
  Menu,
  X,
  Search,
  LogOut,
  UserCircle,
  Bell,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  Settings,
  Landmark,
  Ticket,
  FileText,
  Bot,
  MessageSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/userSlice";
import { message } from "antd";
import { adminDashboardApi, useGetDashboardSummaryQuery, useResetAdminNumberMutation } from '../../store/slices/adminDashboardApi';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector((store) => store.userSlice.user);
  const dropdownRef = useRef();

  const { data: dashboardData, error: dashboardError } = useGetDashboardSummaryQuery();
  const [resetAdminNumber] = useResetAdminNumberMutation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [newReportsCount, setNewReportsCount] = useState(0);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update reports count from dashboard data
  useEffect(() => {
    if (dashboardData?.adminNumber !== undefined) {
      setNewReportsCount(dashboardData.adminNumber.number);
    } else if (dashboardError) {
      message.error(dashboardError?.data?.message || "Error fetching reports count");
      setNewReportsCount(0);
    }
  }, [dashboardData, dashboardError]);

  // Validate user presence
  useEffect(() => {
    if (!currentUser?._id) {
      message.error("User ID not found. Please log in again.");
    }
  }, [currentUser?._id]);

  // Reset reports count when navigating to Parent Reports page
  const resetReportsCount = async () => {
    try {
      await resetAdminNumber().unwrap();
      setNewReportsCount(0);
    } catch (error) {
      message.error(error?.data?.message || "Error resetting reports count");
    }
  };

  useEffect(() => {
    if (location.pathname === "/admin-dashboard/reports") {
      resetReportsCount();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsDropdownVisible(false);

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;

    try {
      // Call logout API
      await axios(`${baseUrl}auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear RTK Query cache
      dispatch(adminDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:adminDashboardApi');

      // Dispatch logout action to clear user state
      dispatch(logout());

      // Navigate and reload
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: Clear everything even if API fails
      dispatch(adminDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:adminDashboardApi');
      dispatch(logout());
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  // Capitalize name for display
  const capitalizeName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "";

  // Menu items with Parent Reports badge
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin-dashboard" },

    // Academic
    { icon: <Users size={20} />, label: "Classes", path: "/admin-dashboard/classes" },
    { icon: <BookOpen size={20} />, label: "Subjects", path: "/admin-dashboard/subjects" },
    { icon: <User size={20} />, label: "Teachers", path: "/admin-dashboard/teachers" },
    { icon: <UserPlus size={20} />, label: "Students", path: "/admin-dashboard/students" },

    // Parent & Reports
    { icon: <User size={20} />, label: "Parents", path: "/admin-dashboard/parents" },
    {
      icon: (
        <div className="relative">
          <MessageSquare size={20} />
          {newReportsCount > 0 ? (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full"
              data-testid="reports-badge"
            >
              {newReportsCount}
            </span>
          ) : null}
        </div>
      ),
      label: "Parent Reports",
      path: "/admin-dashboard/reports",
      onClick: async () => {
        await resetReportsCount();
      },
    },

    // Management
    { icon: <FileText size={20} />, label: "Fee Vouchers", path: "/admin-dashboard/vouchers" },
    { icon: <Bell size={20} />, label: "Announcements", path: "/admin-dashboard/announcement/new" },
    { icon: <Bot size={20} />, label: "AI Assistant", path: "/admin-dashboard/ai-assistant" },

    // Newly Added
    { icon: <BookOpen size={20} />, label: "Attendance", path: "/admin-dashboard/attendance" },
  ];


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-indigo-500 text-white h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"
          } shadow-xl z-10 rounded-sm`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-400">
          {isSidebarOpen ? (
            <div className="flex items-center gap-1">
              <GraduationCap className="h-10 w-10 text-amber-400 -rotate-[15deg]" />
              <span
                style={{ fontFamily: "Nunito, sans-serif" }}
                className="text-[22px] font-extrabold tracking-wide mt-1"
              >
                <span className="text-white">e</span>
                <span className="text-white">School</span>
                <span className="text-white">.</span>
              </span>
            </div>
          ) : (
            ""
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-white p-1.5 rounded-md hover:bg-indigo-400 transition-colors ml-1"
          >
            {isSidebarOpen ? <X size={23} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="px-3 pb-0 pt-2">
          <ul className="space-y-2.5">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (item.onClick) item.onClick();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${location.pathname === item.path
                  ? "bg-indigo-400 shadow-lg shadow-indigo-900/20"
                  : "text-white hover:bg-indigo-400 hover:text-white hover:translate-x-1"
                  }`}
              >
                <span
                  className={`flex-shrink-0 ${location.pathname === item.path
                    ? "text-indigo-100"
                    : "text-white hover:text-white transition-colors"
                    }`}
                >
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${location.pathname === item.path
                      ? "text-white"
                      : "text-white hover:text-white transition-colors"
                      }`}
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Landmark size={22} className="text-indigo-500 mr-2" />
              <span
                style={{ fontFamily: "Nunito, sans-serif" }}
                className="text-lg font-bold mt-1 text-gray-700 flex items-center"
              >
                Admin
                <span className="text-indigo-500 ml-1 text-sm bg-indigo-100 px-2 py-0.5 rounded-full">
                  Dashboard
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative pt-1.5">
              <button
                onClick={() => {
                  navigate('/admin-dashboard/reports');
                  if (currentUser?._id) {
                    resetNotificationCount(currentUser._id).unwrap().catch((err) => {
                      message.error(err?.data?.message || "Error resetting notifications count");
                    });
                  }
                }}
                className="text-gray-600 hover:text-indigo-600 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {newReportsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {newReportsCount}
                  </span>
                )}
              </button>
            </div>

            {isSearchVisible && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 pr-8 border border-gray-200 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 w-64 shadow-sm"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchVisible(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br border-1 border-indigo-500 from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white">
                  {currentUser?.logo ? (
                    <img
                      src={currentUser.logo}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={20} />
                  )}
                </div>
                <div className="flex items-center">
                  <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform duration-200 ${isDropdownVisible ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>

              {isDropdownVisible && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-4 border-b bg-gradient-to-r from-indigo-50 to-gray-50">
                    <p
                      className="text-sm font-semibold text-gray-900"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {capitalizeName(currentUser?.instituteName) || "School Admin"}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate mt-0.5"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {currentUser?.email || "admin@school.edu"}
                    </p>
                  </div>
                  <ul className="py-2">
                    <li
                      onClick={() => {
                        setIsDropdownVisible(false);
                        navigate("/admin-dashboard/profile");
                      }}
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-indigo-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      <Settings className="text-indigo-500" size={18} />
                      <span
                        className="text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Profile Settings
                      </span>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 cursor-pointer text-red-500 transition-colors"
                    >
                      <LogOut size={18} />
                      <span
                        className="text-sm font-medium"
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
        <main className="flex-1 overflow-y-auto bg-gray-50 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;