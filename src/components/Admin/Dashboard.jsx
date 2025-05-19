import { useState, useEffect } from "react";
import AIAssistantButton from '../AIAssistantButton.jsx';
import {
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaBullhorn,
  FaSpinner,
  FaTicketAlt,
  FaHistory,
  FaPlus,
  FaMoneyBillWave,
  FaUserGraduate,
  FaUsersCog,
  FaChalkboard,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import { IoMdAlert, IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useGetDashboardSummaryQuery } from "../../store/slices/adminDashboardApi";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    data: summary,
    error,
    isLoading,
  } = useGetDashboardSummaryQuery();
  
  const cachedSummary = useSelector(
    (state) => state.adminDashboardApi.queries["getDashboardSummary(undefined)"]?.data
  );

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
    attendancePercentage: 0,
    averageMarks: null,
    announcements: [],
    totalVouchers: 0,
    recentVouchers: [],
    recentActivities: [],
    attendanceTrend: [],
    voucherStatus: [],
    collectedFee: 0,
  });

  useEffect(() => {
    const data = summary || cachedSummary;
    if (data) {
      const {
        students,
        teachers,
        classes,
        attendance,
        parents,
        vouchers,
        activityLog,
        announcements,
        averageMarks,
      } = data;

      // Calculate today's attendance
      const today = new Date().toISOString().split("T")[0];
      const todayRecords = attendance.filter(
        (record) => new Date(record.date).toISOString().split("T")[0] === today
      );

      let presentCount = 0;
      const totalStudents = students.length;

      todayRecords.forEach(record => {
        record.students.forEach(student => {
          if (student.status === 'present') presentCount++;
        });
      });

      const attendancePercentage = totalStudents > 0
        ? (presentCount / totalStudents) * 100
        : 0;

      // Calculate attendance trend for last 7 days
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);

      const attendanceByDate = {};
      attendance.forEach(record => {
        const date = new Date(record.date);
        const dateStr = date.toISOString().split('T')[0];
        if (date >= startDate && date <= endDate) {
          if (!attendanceByDate[dateStr]) {
            attendanceByDate[dateStr] = { present: 0, total: 0 };
          }
          record.students.forEach(student => {
            attendanceByDate[dateStr].total++;
            if (student.status === 'present') {
              attendanceByDate[dateStr].present++;
            }
          });
        }
      });

      const attendanceTrend = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const data = attendanceByDate[dateStr] || { present: 0, total: totalStudents };
        const percentage = data.total > 0 ? (data.present / data.total) * 100 : 0;
        attendanceTrend.push({
          date: dateStr,
          percentage: Number(percentage.toFixed(1))
        });
      }

      // Calculate voucher status and collected fee
      const voucherData = vouchers || [];
      const voucherStatus = [
        { name: 'Unpaid', value: voucherData.filter(v => v.status === 'unpaid').length },
        { name: 'Paid', value: voucherData.filter(v => v.status === 'paid').length },
      ];
      const collectedFee = voucherData
        .filter(v => v.status === 'paid')
        .reduce((sum, v) => sum + v.amount, 0);

      // Format announcements
      const formattedAnnouncements = announcements.map(announcement => ({
        title: announcement.title,
        date: new Date(announcement.createdAt).toLocaleDateString(),
        message: announcement.message
      }));

      setMetrics({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalParents: parents.length,
        attendancePercentage: Number(attendancePercentage.toFixed(1)),
        averageMarks: averageMarks?.average || null,
        announcements: formattedAnnouncements,
        totalVouchers: voucherData.length,
        recentVouchers: voucherData.slice(0, 5),
        recentActivities: activityLog.slice(0, 5) || [],
        attendanceTrend,
        voucherStatus,
        collectedFee
      });
    }
  }, [summary, cachedSummary]);

  const metricCards = [
    {
      title: "Collected Fee",
      value: `PKR ${metrics.collectedFee.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Total Students",
      value: metrics.totalStudents,
      icon: <FaUserGraduate />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Teachers",
      value: metrics.totalTeachers,
      icon: <FaChalkboardTeacher />,
      color: "bg-purple-500",
      textColor: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Parents",
      value: metrics.totalParents,
      icon: <FaUsersCog />,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      title: "Total Classes",
      value: metrics.totalClasses,
      icon: <FaChalkboard />,
      color: "bg-indigo-500",
      textColor: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Today's Attendance",
      value: `${metrics.attendancePercentage}%`,
      icon: <FaClipboardCheck />,
      color: metrics.attendancePercentage >= 90 ? "bg-emerald-500" :
        metrics.attendancePercentage >= 75 ? "bg-blue-500" :
          metrics.attendancePercentage >= 60 ? "bg-amber-500" : "bg-red-500",
      textColor: metrics.attendancePercentage >= 90 ? "text-emerald-500" :
        metrics.attendancePercentage >= 75 ? "text-blue-500" :
          metrics.attendancePercentage >= 60 ? "text-amber-500" : "text-red-500",
      bgColor: metrics.attendancePercentage >= 90 ? "bg-emerald-50" :
        metrics.attendancePercentage >= 75 ? "bg-blue-50" :
          metrics.attendancePercentage >= 60 ? "bg-amber-50" : "bg-red-50",
      trend: metrics.attendancePercentage > 75 ? "up" : metrics.attendancePercentage > 60 ? "stable" : "down"
    },
    {
      title: "Total Vouchers",
      value: metrics.totalVouchers,
      icon: <FaTicketAlt />,
      color: "bg-pink-500",
      textColor: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      title: "Unpaid Vouchers",
      value: metrics.voucherStatus.find(s => s.name === 'Unpaid')?.value || 0,
      icon: <FaTicketAlt />,
      color: metrics.voucherStatus.find(s => s.name === 'Unpaid')?.value === 0 ? "bg-emerald-500" : "bg-amber-500",
      textColor: metrics.voucherStatus.find(s => s.name === 'Unpaid')?.value === 0 ? "text-emerald-500" : "text-amber-500",
      bgColor: metrics.voucherStatus.find(s => s.name === 'Unpaid')?.value === 0 ? "bg-emerald-50" : "bg-amber-50"
    }
  ];

  const quickActions = [
    { label: "Add Student", path: "/admin-dashboard/students", icon: <FaUserGraduate />, color: "bg-blue-600" },
    { label: "Create Voucher", path: "/admin-dashboard/create-voucher", icon: <FaTicketAlt />, color: "bg-pink-600" },
    { label: "Post Announcement", path: "/admin-dashboard/announcements", icon: <FaBullhorn />, color: "bg-amber-600" }
  ];

  const PIE_COLORS = ['#F59E0B', '#10B981'];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {isLoading && (
        <div className="flex justify-center items-center min-h-[80vh] h-64">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
          <div className="flex items-center">
            <IoMdAlert className="text-red-500 text-xl mr-3" />
            <div>
              <p className="text-red-800 font-medium">Error loading dashboard data</p>
              <p className="text-red-700 text-sm">{error.message || 'An unexpected error occurred'}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm">
                Welcome back!
              </p>
            </div>
            <div className="mt-3 text-sm sm:mt-0 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium flex items-center">
              <FaCalendarAlt className="mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {metricCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <span className={`text-xl ${card.textColor}`}>{card.icon}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    {card.trend === "up" && <IoMdTrendingUp className="text-emerald-500 mb-1" />}
                    {card.trend === "down" && <IoMdTrendingDown className="text-red-500 mb-1" />}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Attendance Trend</h2>
                  <p className="text-sm text-gray-500">Last 7 days performance</p>
                </div>
                <button
                  onClick={() => navigate('/admin-dashboard/attendance')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-[250px] sm:h-[350px] mr-10 pt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.attendanceTrend}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatDate(value)}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Attendance"]}
                      labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Fee Submission Status</h2>
                  <p className="text-sm text-gray-500">Payment overview of all students</p>
                </div>
                <button
                  onClick={() => navigate('/admin-dashboard/vouchers')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.voucherStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {metrics.voucherStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} vouchers`, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Collected</p>
                  <p className="text-lg font-bold text-gray-800">PKR {metrics.collectedFee.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium">Pending Payments</p>
                  <p className="text-lg font-bold text-gray-800">{metrics.voucherStatus.find(s => s.name === 'Unpaid')?.value || 0} vouchers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all"
                  >
                    <div className="flex items-center">
                      <span className={`p-2 bg-white rounded-lg mr-3 ${action.label.includes('Student') ? 'text-blue-500' : action.label.includes('Voucher') ? 'text-pink-500' : 'text-amber-500'}`}>
                        {action.icon}
                      </span>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <FaArrowRight className="text-indigo-400" />
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Performance</h2>
                {metrics.averageMarks ? (
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={
                            metrics.averageMarks >= 80 ? "#10B981" :
                              metrics.averageMarks >= 60 ? "#4F46E5" : "#F43F5E"
                          }
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${metrics.averageMarks * 2.83} 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{metrics.averageMarks}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Average marks across all classes</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {metrics.totalStudents} students in {metrics.totalClasses} classes
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No academic data available
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Latest Announcements</h2>
                  <p className="text-sm text-gray-500">School-wide communications</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/admin-dashboard/announcement/new')}
                    className="flex items-center mr-3 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaPlus className="mr-1" /> New
                  </button>
                  <button
                    onClick={() => navigate('/admin-dashboard/announcements')}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View All
                    <FaArrowRight className="ml-1 text-xs" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {metrics.announcements.length > 0 ? (
                  metrics.announcements.slice(0, 3).map((announcement, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors shadow-sm"
                    >
                      <div className="flex items-start">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mr-3 mt-0.5">
                          <FaBullhorn className="text-sm" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800">{capitalizeWords(announcement.title)}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{announcement.date}</p>
                          <button
                            onClick={() => navigate('/admin-dashboard/announcements')}
                            className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            Read more
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                    <FaBullhorn className="text-gray-300 text-3xl mb-3" />
                    <p className="text-gray-500 font-medium">No announcements found</p>
                    <p className="text-gray-400 text-sm">Create your first announcement to get started</p>
                    <button
                      onClick={() => navigate('/admin-dashboard/announcements/new')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create Announcement
                    </button>
                  </div>
                )}
              </div>
              {metrics.announcements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {metrics.recentActivities.length > 0 ? (
                      metrics.recentActivities.slice(0, 3).map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start py-2"
                        >
                          <div className="p-1.5 bg-gray-100 text-gray-600 rounded-full mr-3">
                            <FaHistory className="text-xs" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{capitalizeWords(activity.action)}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-gray-400 text-sm">
                        No recent activities
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <AIAssistantButton />
    </div>
  );
};

export default Dashboard;