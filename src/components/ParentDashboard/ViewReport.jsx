import React, { useState } from 'react';
import { FileText, Loader2, AlertCircle, ChevronDown, ChevronUp, MessageSquare, User, Tag, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useGetParentDashboardSummaryQuery } from "../../store/slices/parentDashboardApi";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
    },
    resolved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  };

  const config = statusConfig[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: null
  };

  return (
    <div className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      <span className="capitalize">{status}</span>
    </div>
  );
};

const ViewReports = () => {
  const [activeReport, setActiveReport] = useState(null);
  const { data, error, isLoading } = useGetParentDashboardSummaryQuery();
  const reports = data?.reports || [];

  // Calculate statistics
  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    pending: reports.filter(r => r.status === 'pending').length
  };

  const toggleDropdown = (reportId) => {
    setActiveReport(activeReport === reportId ? null : reportId);
  };

  const capitalize = (str) => {
    return str?.replace(/\b\w/g, char => char.toUpperCase()) || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-md sm:rounded-lg backdrop-blur-sm">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Report History</h1>
                <p className="text-indigo-100 text-xs sm:text-sm">View all your submitted reports and responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Reports</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</h3>
              </div>
              <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Resolved</p>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.resolved}</h3>
              </div>
              <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-full">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Pending</p>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-600">{stats.pending}</h3>
              </div>
              <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">Student</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">Type</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">Date</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">Responses</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-8 sm:py-12 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="py-8 sm:py-12 text-center">
                      <div className="bg-red-50 rounded-lg p-3 sm:p-4 mx-3 sm:mx-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5" />
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-red-800">Error Loading Reports</h3>
                            <p className="text-xs sm:text-sm text-red-700 mt-1">Failed to fetch reports.</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 sm:py-12 text-center">
                      <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <FileText className="h-5 w-5 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-700">No Reports Found</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">You haven't submitted any reports yet.</p>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <React.Fragment key={report._id}>
                      <tr
                        className={`border-b border-gray-200 ${activeReport === report._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} cursor-pointer`}
                        onClick={() => toggleDropdown(report._id)}
                      >
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-1.5 sm:mr-2" />
                            <span className="text-xs sm:text-sm font-medium">{capitalize(report.studentName)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-1.5 sm:mr-2" />
                            <span className="text-xs sm:text-sm capitalize">{report.reportType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-1.5 sm:mr-2" />
                            <span className="text-xs sm:text-sm">{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-1.5 sm:mr-2" />
                              <span className="text-xs sm:text-sm">{report.comments?.filter(c => c.author === 'admin').length || 0}</span>
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800">
                              {activeReport === report._id ? (
                                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {activeReport === report._id && (
                        <tr>
                          <td colSpan="5" className="bg-white border-t border-gray-200">
                            <div className="p-3 sm:p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Report Details */}
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                                    Report Details
                                  </h3>
                                  <div className="max-h-40 overflow-y-auto">
                                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                                      {report.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Admin Responses */}
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                                    Admin Responses ({report.comments?.filter(c => c.author === 'admin').length || 0})
                                  </h3>
                                  {report.comments?.filter(c => c.author === 'admin').length > 0 ? (
                                    <div className="space-y-2 sm:space-y-3 max-h-40 overflow-y-auto">
                                      {report.comments
                                        .filter(c => c.author === 'admin')
                                        .map((comment, index) => (
                                          <div key={index} className="bg-indigo-50 rounded-lg p-3 sm:p-4 border border-indigo-100">
                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                              <span className="text-xs font-medium text-indigo-800 bg-indigo-100 px-2 py-0.5 sm:py-1 rounded-full">
                                                School Admin
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                                              {comment.message}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  ) : (
                                    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 text-center text-gray-500">
                                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-gray-300" />
                                      <p className="text-xs sm:text-sm">No responses yet</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;