import React from 'react';
import { Loader2, BookOpen, X, Calendar, User, Bookmark, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useGetDashboardSummaryQuery } from '../../api/studentDashboardApi';

export default function StudentAttendance() {
  const currentUser = useSelector((store) => store.userSlice.user);
  const studentId = currentUser?._id;
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const records = data?.attendance || [];

  // Format date for display
  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Status configuration with colors and icons
  const statusConfig = {
    present: {
      class: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    absent: {
      class: 'bg-red-100 text-red-800 border-red-200',
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    },
    late: {
      class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    },
    halfday: {
      class: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <ClockIcon className="w-4 h-4 text-blue-500" />,
    },
    default: {
      class: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <ArrowPathIcon className="w-4 h-4 text-gray-500" />,
    },
  };

  const getStatusInfo = (status) => {
    const statusLower = (status || '').toLowerCase();
    return statusConfig[statusLower] || statusConfig.default;
  };

  const totalDays = records.length;
  const presentDays = records.filter((r) => (r.status || '').toLowerCase() === 'present').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  if (!studentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
            Student Not Found
          </h3>
          <p className="text-gray-500 font-nunito">Please contact administration for assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="md:w-7 md:h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                My Attendance
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-nunito">
                View your attendance records and statistics
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center mt-0.5">
              <X className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium font-nunito">
                {error.data?.message || 'Failed to fetch attendance records'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 font-nunito"
              >
                <RotateCw className="w-3 h-3" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: 'Total Days',
              value: totalDays,
              icon: <CalendarIcon className="w-6 h-6 text-indigo-500" />,
            },
            {
              label: 'Present Days',
              value: presentDays,
              icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
            },
            {
              label: 'Attendance %',
              value: `${attendancePercentage}%`,
              icon: <ChartBarIcon className="w-6 h-6 text-blue-500" />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-xl border border-indigo-100 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 mb-1 font-nunito uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 font-nunito">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-indigo-100 rounded animate-pulse" />
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading attendance records...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        Class
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {records.map((record) => {
                    const statusInfo = getStatusInfo(record.status);
                    return (
                      <tr
                        key={record._id}
                        className="hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                          {formatDisplayDate(record.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {statusInfo.icon}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusInfo.class}`}
                            >
                              {record.status || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                          {currentUser.studentClass || 'N/A'} - {currentUser.section || 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Records Found
            </h3>
            <p className="text-gray-500 font-nunito">No attendance records available for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}