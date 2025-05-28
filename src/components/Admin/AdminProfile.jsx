import { useSelector } from "react-redux";
import {
  CalendarDays,
  Mail,
  ShieldCheck,
  Building2,
  Users,
  User,
  UserPlus,
  Lock,
  FileText,
  Bot,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDashboardSummaryQuery } from "../../api/adminDashboardApi";
import { message } from "antd";

export default function AdminProfile() {
  const user = useSelector((store) => store.userSlice.user);
  const navigate = useNavigate();
  const { data: dashboardData, error: dashboardError } = useGetDashboardSummaryQuery();

  // Handle dashboard error
  if (dashboardError) {
    message.error(dashboardError?.data?.message || "Error fetching dashboard data");
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="mt-2 text-gray-600">Manage your profile and view system overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-lg flex items-center justify-center mx-auto mb-4">
                    {user?.logo ? (
                      <img
                        src={user.logo}
                        alt="Institute Logo"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white capitalize mb-1">
                  {user?.instituteName}
                </h2>
                <p className="text-indigo-100 font-medium capitalize">
                  {user?.role || "System Administrator"}
                </p>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <ProfileDetail
                  icon={<Mail className="h-4 w-4" />}
                  label="Email Address"
                  value={user?.email}
                />
                <ProfileDetail
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Member Since"
                  value={user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                />
                <ProfileDetail
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Access Level"
                  value="Full Administrative Access"
                />
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate("/admin-dashboard/change-password")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md group"
                >
                  <Lock className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Total Classes"
                value={dashboardData?.classes?.length || 0}
                icon={<Users className="h-6 w-6" />}
                bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                iconColor="text-blue-600"
                changePositive={true}
              />
              
              <StatCard
                title="Total Teachers"
                value={dashboardData?.teachers?.length || 0}
                icon={<User className="h-6 w-6" />}
                bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                iconColor="text-emerald-600"
                changePositive={true}
              />
              
              <StatCard
                title="Total Students"
                value={dashboardData?.students?.length || 0}
                icon={<UserPlus className="h-6 w-6" />}
                bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
                iconColor="text-purple-600"
                changePositive={true}
              />
              
              <StatCard
                title="Total Parents"
                value={dashboardData?.parents?.length || 0}
                icon={<Users className="h-6 w-6" />}
                bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
                iconColor="text-orange-600"
                changePositive={true}
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <QuickActionButton
                    icon={<FileText className="h-5 w-5" />}
                    title="Check Reports"
                    description="View system reports"
                    onClick={() => navigate("/admin-dashboard/reports")}
                  />
                  <QuickActionButton
                    icon={<Bot className="h-5 w-5" />}
                    title="AI Assistant"
                    description="Get AI help"
                    onClick={() => navigate("/admin-dashboard/ai-assistant")}
                  />
                  <QuickActionButton
                    icon={<Megaphone className="h-5 w-5" />}
                    title="Announcements"
                    description="Manage announcements"
                    onClick={() => navigate("/admin-dashboard/announcements")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Detail Component
const ProfileDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 p-2 bg-gray-50 rounded-lg text-gray-600">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-medium truncate">
        {value || "Not specified"}
      </p>
    </div>
  </div>
);

// Statistics Card Component
const StatCard = ({ title, value, icon, bgColor, iconColor, change, changePositive }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 text-left group"
  >
    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-200">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </button>
);