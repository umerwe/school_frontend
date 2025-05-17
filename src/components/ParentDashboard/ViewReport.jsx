import React, { useState } from 'react';
import { FileText, Loader2, AlertCircle, ChevronDown, ChevronUp, MessageSquare, User, Tag, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useGetParentDashboardSummaryQuery } from "../../store/slices/parentDashboardApi";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-4 h-4" />
    },
    resolved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle className="w-4 h-4" />
    }
  };

  const config = statusConfig[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: null
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      {config.icon && <span className="mr-1.5">{config.icon}</span>}
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Report History</h1>
                <p className="text-indigo-100">View all your submitted reports and responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reports</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
              </div>
              <div className="bg-indigo-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <h3 className="text-2xl font-bold text-emerald-600">{stats.resolved}</h3>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Report Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Responses</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="bg-red-50 rounded-lg p-4 mx-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Error Loading Reports</h3>
                          <p className="text-sm text-red-700 mt-1">Failed to fetch reports.</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No Reports Found</h3>
                    <p className="text-gray-500 mt-2">You haven't submitted any reports yet.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <React.Fragment key={report._id}>
                    <tr
                      className={`border-b border-gray-200 ${activeReport === report._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} cursor-pointer`}
                      onClick={() => toggleDropdown(report._id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">{capitalize(report.studentName)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="capitalize">{report.reportType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                            <span>{report.comments?.filter(c => c.author === 'admin').length || 0}</span>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-800">
                            {activeReport === report._id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {activeReport === report._id && (
                      <tr>
                        <td colSpan="5" className="bg-white border-t border-gray-200">
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Report Details */}
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Report Details</h3>
                                <p className="text-gray-700 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                                  {report.description}
                                </p>
                              </div>

                              {/* Admin Responses */}
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                  Admin Responses ({report.comments?.filter(c => c.author === 'admin').length || 0})
                                </h3>
                                {report.comments?.filter(c => c.author === 'admin').length > 0 ? (
                                  <div className="space-y-3">
                                    {report.comments
                                      .filter(c => c.author === 'admin')
                                      .map((comment, index) => (
                                        <div key={index} className="bg-indigo-50 rounded-lg p-4 border border-attr-indigo-100">
                                          <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-medium text-indigo-800 bg-indigo-100 px-2 py-1 rounded-full">
                                              School Admin
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                                    <p>No responses yet</p>
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
  );
};

export default ViewReports;