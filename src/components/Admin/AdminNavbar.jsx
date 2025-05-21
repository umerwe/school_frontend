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
  const sidebarRef = useRef();

  const { data: dashboardData, error: dashboardError } = useGetDashboardSummaryQuery();
  const [resetAdminNumber] = useResetAdminNumberMutation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [newReportsCount, setNewReportsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Changed to 768px
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dashboardData?.adminNumber !== undefined) {
      setNewReportsCount(dashboardData.adminNumber.number);
    } else if (dashboardError) {
      message.error(dashboardError?.data?.message || "Error fetching reports count");
      setNewReportsCount(0);
    }
  }, [dashboardData, dashboardError]);

  useEffect(() => {
    if (!currentUser?._id) {
      message.error("User ID not found. Please log in again.");
    }
  }, [currentUser?._id]);

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
      await axios(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(adminDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:adminDashboardApi');
      dispatch(logout());
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(adminDashboardApi.util.resetApiState());
      localStorage.removeItem('persist:adminDashboardApi');
      dispatch(logout());
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  const capitalizeName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "";

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin-dashboard" },
    { icon: <Users size={20} />, label: "Classes", path: "/admin-dashboard/classes" },
    { icon: <BookOpen size={20} />, label: "Subjects", path: "/admin-dashboard/subjects" },
    { icon: <User size={20} />, label: "Teachers", path: "/admin-dashboard/teachers" },
    { icon: <UserPlus size={20} />, label: "Students", path: "/admin-dashboard/students" },
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
      onClick: resetReportsCount,
    },
    { icon: <FileText size={20} />, label: "Fee Vouchers", path: "/admin-dashboard/vouchers" },
    { icon: <Bell size={20} />, label: "Announcements", path: "/admin-dashboard/announcement/new" },
    { icon: <Bot size={20} />, label: "AI Assistant", path: "/admin-dashboard/ai-assistant" },
    { icon: <BookOpen size={20} />, label: "Attendance", path: "/admin-dashboard/attendance" },
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

        <div className="px-2 sm:px-3 pb-0 pt-3 md:pt-1.5">
          <ul className="space-y-1.5">
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
              <Landmark size={20} className="text-indigo-500 mr-1 sm:mr-2" />
              <span
                style={{ fontFamily: "Nunito, sans-serif" }}
                className="text-md md:text-lg font-bold mt-1 text-gray-700 flex items-center"
              >
                {isMobile ? "Admin" : "Admin"}
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
                  navigate('/admin-dashboard/reports');
                  if (currentUser?._id) {
                    resetAdminNumber().unwrap().catch((err) => {
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
                <div className="w-9 h-9 md:w-9 md:h-9 rounded-full bg-gradient-to-br border-2 border-indigo-400 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white">
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
                      {capitalizeName(currentUser?.instituteName) || "School Admin"}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate mt-0.5"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {currentUser?.email || "admin@school.edu"}
                    </p>
                  </div>
                  <ul className="py-1 sm:py-2">
                    <li
                      onClick={() => {
                        setIsDropdownVisible(false);
                        navigate("/admin-dashboard/profile");
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
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;