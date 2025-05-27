import { useSelector } from "react-redux";
import {
  CalendarDays,
  Mail,
  ShieldCheck,
  Building2,
  Users,
  User,
  UserPlus,
} from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../api/adminDashboardApi";
import { message } from "antd";

export default function AdminProfile() {
  const user = useSelector((store) => store.userSlice.user);
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center">
              {user?.logo ? (
                <img
                  src={user.logo}
                  alt="Institute Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {user.instituteName}
              </h1>
              <p className="text-blue-600 font-medium mt-1 capitalize">
                {user.role || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <DetailItem
              icon={<Mail className="h-5 w-5" />}
              bg="bg-blue-100"
              text="text-blue-600"
              label="Email"
              value={user.email}
            />
            
            <DetailItem
              icon={<Users className="h-5 w-5" />}
              bg="bg-indigo-100"
              text="text-indigo-600"
              label="Total Classes"
              value={dashboardData?.classes?.length || 0}
            />
            <DetailItem
              icon={<User className="h-5 w-5" />}
              bg="bg-teal-100"
              text="text-teal-600"
              label="Total Teachers"
              value={dashboardData?.teachers?.length || 0}
            />
          </div>
          <div className="space-y-4">
            <DetailItem
              icon={<UserPlus className="h-5 w-5" />}
              bg="bg-red-100"
              text="text-red-600"
              label="Total Students"
              value={dashboardData?.students?.length || 0}
            />
            <DetailItem
              icon={<User className="h-5 w-5" />}
              bg="bg-pink-100"
              text="text-pink-600"
              label="Total Parents"
              value={dashboardData?.parents?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable detail row
const DetailItem = ({ icon, bg, text, label, value }) => (
  <div className="flex items-start gap-4">
    <div className={`p-2 rounded-lg ${bg} ${text}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800 text-sm">{value}</p>
    </div>
  </div>
);