import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaUserGraduate, FaClipboardCheck, FaCreditCard, FaBullhorn,
  FaCalendarAlt, FaArrowRight
} from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AIAssistantButton from '../AIAssistantButton.jsx';
import { useGetParentDashboardSummaryQuery } from '../../store/slices/parentDashboardApi';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.userSlice.user);
  const children = user?.childrens || [];
  const { data, isLoading, error } = useGetParentDashboardSummaryQuery();

  // State for marks loading (if needed for future async actions)
  const [loading, setLoading] = useState({ marks: false });

  // Compute metrics from data
  const metrics = React.useMemo(() => {
    if (!data) {
      return {
        childrenCount: children.length,
        todayAttendance: 0,
        feeVouchers: { paid: 0, unpaid: 0 },
        collectedFee: 0,
        announcements: [],
        attendanceTrend: []
      };
    }

    // Calculate today's attendance
    const today = new Date().toISOString().split('T')[0];
    let presentCount = 0;
    let totalStudents = children.length;

    data.childrenDetails.forEach(child => {
      const todayRecords = child.attendance.filter(record =>
        new Date(record.date).toISOString().split('T')[0] === today
      );
      todayRecords.forEach(record => {
        if (record.status.toLowerCase() === 'present') {
          presentCount++;
        }
      });
    });

    const todayAttendance = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    // Calculate attendance trend for the last 7 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const attendanceByDate = {};
    data.childrenDetails.forEach(child => {
      child.attendance.forEach(record => {
        const date = new Date(record.date);
        const dateStr = date.toISOString().split('T')[0];
        if (date >= startDate && date <= endDate) {
          if (!attendanceByDate[dateStr]) {
            attendanceByDate[dateStr] = { present: 0, total: 0 };
          }
          attendanceByDate[dateStr].total++;
          if (record.status.toLowerCase() === 'present') {
            attendanceByDate[dateStr].present++;
          }
        }
      });
    });

    const attendanceTrend = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const trendData = attendanceByDate[dateStr] || { present: 0, total: children.length };
      const percentage = trendData.total > 0 ? (trendData.present / trendData.total) * 100 : 0;
      attendanceTrend.push({
        date: dateStr,
        percentage: Number(percentage.toFixed(1))
      });
    }

    // Process fee vouchers
    const feeVouchers = data.childrenDetails.reduce((acc, child) => {
      child.vouchers.forEach(voucher => {
        if (voucher.status === 'paid') {
          acc.paid++;
          acc.collected += voucher.amount || 0;
        } else {
          acc.unpaid++;
        }
      });
      return acc;
    }, { paid: 0, unpaid: 0, collected: 0 });

    // Format announcements
    const formattedAnnouncements = data.announcements.map(announcement => ({
      title: announcement.title,
      date: new Date(announcement.createdAt).toLocaleDateString(),
      message: announcement.message
    }));

    return {
      childrenCount: children.length,
      todayAttendance: Number(todayAttendance.toFixed(1)),
      feeVouchers: {
        paid: feeVouchers.paid,
        unpaid: feeVouchers.unpaid,
        total: feeVouchers.paid + feeVouchers.unpaid
      },
      collectedFee: feeVouchers.collected,
      announcements: formattedAnnouncements,
      attendanceTrend
    };
  }, [data, children]);

  // Metric cards
  const metricCards = [
    {
      title: "My Children",
      value: metrics.childrenCount,
      icon: <FaUserGraduate />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Today's Attendance",
      value: `${metrics.todayAttendance}%`,
      icon: <FaClipboardCheck />,
      color: metrics.todayAttendance >= 90 ? "bg-emerald-500" :
        metrics.todayAttendance >= 75 ? "bg-blue-500" :
          metrics.todayAttendance >= 60 ? "bg-amber-500" : "bg-red-500",
      textColor: metrics.todayAttendance >= 90 ? "text-emerald-500" :
        metrics.todayAttendance >= 75 ? "text-blue-500" :
          metrics.todayAttendance >= 60 ? "text-amber-500" : "text-red-500",
      bgColor: metrics.todayAttendance >= 90 ? "bg-emerald-50" :
        metrics.todayAttendance >= 75 ? "bg-blue-50" :
          metrics.todayAttendance >= 60 ? "bg-amber-50" : "bg-red-50"
    },
    {
      title: "Total Vouchers",
      value: metrics.feeVouchers.total,
      icon: <FaCreditCard />,
      color: metrics.feeVouchers.total === 0 ? "bg-emerald-500" : "bg-amber-500",
      textColor: metrics.feeVouchers.total === 0 ? "text-emerald-500" : "text-amber-500",
      bgColor: metrics.feeVouchers.total === 0 ? "bg-emerald-50" : "bg-amber-50"
    },
    {
      title: "Paid Vouchers",
      value: metrics.feeVouchers.paid,
      icon: <FaCreditCard />,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-50"
    }
  ];

  // Quick actions
  const quickActions = [
    { label: "View Attendance", path: "/parent-dashboard/attendance", icon: <FaClipboardCheck />, color: "bg-blue-600" },
    { label: "View Announcements", path: "/parent-dashboard/announcements", icon: <FaBullhorn />, color: "bg-purple-600" }
  ];

  // Date formatter
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
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FaClipboardCheck className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-medium">Loading parent dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
          <div className="flex items-center">
            <IoMdAlert className="text-red-500 text-xl mr-3" />
            <div>
              <p className="text-red-800 font-medium">Error loading dashboard data</p>
              <p className="text-red-700 text-sm">{error.data?.message || 'Failed to load dashboard data'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {capitalizeWords(user?.name || 'Parent')}</h1>
              <p className="text-gray-500 text-sm">
                Monitor your children's academic progress and school activities.
              </p>
            </div>
            <div className="mt-3 sm:mt-0 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium flex items-center">
              <FaCalendarAlt className="mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <span className={`text-xl ${card.textColor}`}>{card.icon}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trend */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Attendance Trend</h2>
                  <p className="text-sm text-gray-500">Last 7 days overview</p>
                </div>
                <button
                  onClick={() => navigate('/parent-dashboard/attendance')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-85 pt-4 pr-10">
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

            {/* Fee Submission Status */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Fee Submission Status</h2>
                  <p className="text-sm text-gray-500">Payment overview of your children</p>
                </div>
                <button
                  onClick={() => navigate('/parent-dashboard/fees')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Paid', value: metrics.feeVouchers.paid },
                        { name: 'Unpaid', value: metrics.feeVouchers.unpaid }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell key="cell-paid" fill="#10B981" stroke="none" />
                      <Cell key="cell-unpaid" fill="#F59E0B" stroke="none" />
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
              {/* Payment Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Collected</p>
                  <p className="text-lg font-bold text-gray-800">PKR {metrics.collectedFee?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg">
                  <p className="text-xs text-pink-600 font-medium">Pending Payments</p>
                  <p className="text-lg font-bold text-gray-800">{metrics.feeVouchers.unpaid || 0} vouchers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions and Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all"
                  >
                    <div className="flex items-center">
                      <span className={`p-2 bg-white rounded-lg mr-3 ${action.label.includes('Attendance') ? 'text-blue-500' : 'text-purple-500'}`}>
                        {action.icon}
                      </span>
                      <span className="font-medium text-[15px]">{action.label}</span>
                    </div>
                    <FaArrowRight className="text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="bg-white rounded-lg shadow-sm p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Latest Announcements</h2>
                  <p className="text-sm text-gray-500">School-wide communications</p>
                </div>
                <button
                  onClick={() => navigate('/parent-dashboard/announcements')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="space-y-4">
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
                            onClick={() => navigate('/parent-dashboard/announcements')}
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
                    <p className="text-gray-400 text-sm">Check back later for updates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <AIAssistantButton />
    </div>
  );
};

export default ParentDashboard; 