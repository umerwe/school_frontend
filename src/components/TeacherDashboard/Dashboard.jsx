import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaBook,
  FaCalendarAlt,
  FaArrowRight,
  FaBullhorn,
} from 'react-icons/fa';
import { IoMdAlert, IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AIAssistantButton from '../AIAssistantButton.jsx';
import { useGetDashboardSummaryQuery } from '../../store/slices/teacherDashboardApi';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.userSlice.user);
  const classInfo = user?.classTeacherOf;

  // Fetch dashboard summary using RTK Query
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  // Process metrics from the summary data
  const metrics = data
    ? {
      studentStrength: data.students?.length || 0,
      subjectsTaught: data.subjects || [],
      classDetails: data.classDetails || classInfo || null,
      classSubjects: data.classDetails?.subjects || [],
      attendancePercentage: (() => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = data.attendance?.filter(
          (record) => new Date(record.date).toISOString().split('T')[0] === today
        ) || [];
        let presentCount = 0;
        let totalStudents = data.students?.length || 0;
        todayRecords.forEach((record) => {
          record.students.forEach((student) => {
            if (student.status === 'present') presentCount++;
          });
        });
        return totalStudents > 0 ? Number(((presentCount / totalStudents) * 100).toFixed(1)) : 0;
      })(),
      attendanceTrend: (() => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        const attendanceByDate = {};
        data.attendance?.forEach((record) => {
          const date = new Date(record.date);
          const dateStr = date.toISOString().split('T')[0];
          if (date >= startDate && date <= endDate) {
            if (!attendanceByDate[dateStr]) {
              attendanceByDate[dateStr] = { present: 0, total: 0 };
            }
            record.students.forEach((student) => {
              attendanceByDate[dateStr].total++;
              if (student.status === 'present') {
                attendanceByDate[dateStr].present++;
              }
            });
          }
        });
        const trend = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const record = attendanceByDate[dateStr] || { present: 0, total: data.students?.length || 0 };
          const percentage = record.total > 0 ? (record.present / record.total) * 100 : 0;
          trend.push({
            date: dateStr,
            percentage: Number(percentage.toFixed(1)),
          });
        }
        return trend;
      })(),
      averageMarksPerSubject: (() => {
        const marksBySubject = {};
        data.classMarks?.forEach((mark) => {
          const subject = mark.subject;
          if (!marksBySubject[subject]) {
            marksBySubject[subject] = { total: 0, count: 0 };
          }
          marksBySubject[subject].total += (mark.obtainedMarks / mark.totalMarks) * 100;
          marksBySubject[subject].count += 1;
        });
        return Object.keys(marksBySubject).map((subject) => ({
          subject,
          average: Number((marksBySubject[subject].total / marksBySubject[subject].count).toFixed(1)),
        }));
      })(),
      announcements: data.announcements?.map((announcement) => ({
        title: announcement.title,
        date: new Date(announcement.createdAt).toLocaleDateString(),
        message: announcement.message,
      })) || [],
    }
    : {
      studentStrength: 0,
      subjectsTaught: [],
      classDetails: classInfo || null,
      classSubjects: [],
      attendancePercentage: 0,
      attendanceTrend: [],
      averageMarksPerSubject: [],
      announcements: [],
    };

  // Metric cards
  const metricCards = [
    {
      title: 'Student Strength',
      value: metrics.studentStrength,
      icon: <FaUserGraduate />,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Subjects Taught',
      value: metrics.subjectsTaught.length,
      icon: <FaBook />,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: "Today's Attendance",
      value: `${metrics.attendancePercentage}%`,
      icon: <FaClipboardCheck />,
      color:
        metrics.attendancePercentage >= 90
          ? 'bg-emerald-500'
          : metrics.attendancePercentage >= 75
            ? 'bg-blue-500'
            : metrics.attendancePercentage >= 60
              ? 'bg-amber-500'
              : 'bg-red-500',
      textColor:
        metrics.attendancePercentage >= 90
          ? 'text-emerald-500'
          : metrics.attendancePercentage >= 75
            ? 'text-blue-500'
            : metrics.attendancePercentage >= 60
              ? 'text-amber-500'
              : 'text-red-500',
      bgColor:
        metrics.attendancePercentage >= 90
          ? 'bg-emerald-50'
          : metrics.attendancePercentage >= 75
            ? 'bg-blue-50'
            : metrics.attendancePercentage >= 60
              ? 'bg-amber-50'
              : 'bg-red-50',
      trend: metrics.attendancePercentage > 75 ? 'up' : metrics.attendancePercentage > 60 ? 'stable' : 'down',
    },
    {
      title: 'Class Assigned',
      value: metrics.classDetails
        ? `${metrics.classDetails.classTitle}-${metrics.classDetails.section}`
        : 'None',
      icon: <FaChalkboardTeacher />,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Mark Attendance', path: '/teacher-dashboard/attendance', icon: <FaClipboardCheck />, color: 'bg-blue-600' },
    { label: 'Enter Marks', path: '/teacher-dashboard/marks/submit', icon: <FaBook />, color: 'bg-indigo-600' },
    {
      label: 'View Class Details',
      path: '/teacher-dashboard/classes',
      icon: <FaChalkboardTeacher />,
      color: 'bg-purple-600',
    },
  ];

  // Date formatter
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FaClipboardCheck className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-medium">Loading teacher dashboard...</p>
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
              <p className="text-red-700 text-sm">{error.message || 'An error occurred'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {capitalizeWords(user.name)}</h1>
              <p className="text-gray-500 text-sm">Here's an overview of your class and teaching activities.</p>
            </div>
            <div className="mt-3 sm:mt-0 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium flex items-center">
              <FaCalendarAlt className="mr-2" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
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
                  <div className="flex flex-col items-end">
                    {card.trend === 'up' && <IoMdTrendingUp className="text-emerald-500 mb-1" />}
                    {card.trend === 'down' && <IoMdTrendingDown className="text-red-500 mb-1" />}
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
                  <p className="text-sm text-gray-500">Last 7 days performance</p>
                </div>
                <button
                  onClick={() => navigate('/teacher-dashboard/attendance/history')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-64">
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
                      formatter={(value) => [`${value}%`, 'Attendance']}
                      labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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

            {/* Average Marks per Subject */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Average Marks per Subject</h2>
                  <p className="text-sm text-gray-500">Performance overview</p>
                </div>
                <button
                  onClick={() => navigate('/teacher-dashboard/marks')}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All
                  <FaArrowRight className="ml-1 text-xs" />
                </button>
              </div>
              <div className="h-64">
                {metrics.averageMarksPerSubject.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.averageMarksPerSubject}>
                      <XAxis dataKey="subject" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Average Marks']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                      />
                      <Bar dataKey="average" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 font-medium">No marks data available</p>
                    <button
                      onClick={() => navigate('/teacher-dashboard/marks')}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                    >
                      Enter Marks
                    </button>
                  </div>
                )}
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
                      <span
                        className={`p-2 bg-white rounded-lg mr-3 ${action.label.includes('Attendance')
                            ? 'text-blue-500'
                            : action.label.includes('Marks')
                              ? 'text-indigo-500'
                              : 'text-purple-500'
                          }`}
                      >
                        {action.icon}
                      </span>
                      <span className="font-medium">{action.label}</span>
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
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/teacher-dashboard/announcements')}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View All
                    <FaArrowRight className="ml-1 text-xs" />
                  </button>
                </div>
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
                            onClick={() => navigate('/teacher-dashboard/announcements')}
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
                      onClick={() => navigate('/teacher-dashboard/announcements/new')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create Announcement
                    </button>
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

export default TeacherDashboard;