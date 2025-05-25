import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Loader2,
  MessageSquare,
  Send,
  Calendar,
  User,
  Tag,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useGetDashboardSummaryQuery, useAddReportCommentMutation } from '../../store/slices/adminDashboardApi';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-amber-100 text-amber-800 border border-amber-200',
    resolved: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    processing: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  };

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';

  return (
    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${style} font-nunito`}>
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'resolved' && <CheckCircle className="w-3 h-3" />}
      {status === 'processing' && <Loader2 className="w-3 h-3" />}
      <span className="capitalize">{status}</span>
    </span>
  );
};

const capitalizeName = (name) =>
  name
    ?.split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || '';

const AdminReports = () => {
  const currentUser = useSelector((store) => store.userSlice.user);
  const { data, isLoading, error } = useGetDashboardSummaryQuery();
  const [addReportComment, { isLoading: commentLoading }] = useAddReportCommentMutation();

  const reportsData = useMemo(() => {
    return Array.isArray(data?.reports)
      ? data.reports.map((report) => ({
          ...report,
          comments: Array.isArray(report.comments) ? report.comments : [],
        }))
      : [];
  }, [data?.reports]);

  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setReports(reportsData);
  }, [reportsData]);

  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const processingCount = reports.filter((r) => r.status === 'processing').length;

  const handleAddComment = async (reportId) => {
    if (!comment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    try {
      const response = await addReportComment({ reportId, message: comment }).unwrap();
      setReports((prev) =>
        prev.map((report) => {
          if (report._id === reportId) {
            return {
              ...report,
              comments: Array.isArray(response.data)
                ? response.data
                : [
                    ...(report.comments || []),
                    { message: comment, author: 'admin', createdAt: new Date() },
                  ],
            };
          }
          return report;
        })
      );
      setComment('');
      message.success('Comment added successfully');
    } catch (err) {
      const errorMessage = err.data?.message || 'Failed to add comment.';
      message.error(errorMessage);
    }
  };

  const toggleDropdown = (reportId) => {
    setActiveReport(activeReport === reportId ? null : reportId);
    setComment('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                  Parent Reports
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">
                  Manage and respond to reports submitted by parents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">Total Reports</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-nunito">{reports.length}</h3>
              </div>
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">Resolved</p>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 font-nunito">{resolvedCount}</h3>
              </div>
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-full">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">Pending</p>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-600 font-nunito">{pendingCount}</h3>
              </div>
              <div className="bg-amber-100 p-2 sm:p-3 rounded-full">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Panel */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg border border-indigo-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-indigo-100 bg-white flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 font-nunito">All Reports</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-nunito">
                Showing {reports.length} {reports.length === 1 ? 'report' : 'reports'}
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-0">
            {isLoading ? (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 h-48 sm:h-64 flex flex-col items-center justify-center gap-3 sm:gap-4">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-spin" />
                <p className="text-sm text-gray-500 font-nunito">Loading reports...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 text-center">
                <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-pulse">
                  <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 font-nunito">
                  Error
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">
                  {error?.data?.message || 'Failed to load reports. Please try again.'}
                </p>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 text-center">
                <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-pulse">
                  <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 font-nunito">
                  No Reports Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-nunito">
                  There are no parent reports submitted yet. Reports will appear here when parents submit them.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-indigo-200 bg-indigo-50">
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Student
                      </th>
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito hidden sm:table-cell">
                        Parent
                      </th>
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Type
                      </th>
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Status
                      </th>
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito hidden xs:table-cell">
                        Date
                      </th>
                      <th className="py-3 px-4 sm:py-4 sm:px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {reports.map((report) => (
                      <React.Fragment key={report._id}>
                        <tr className="hover:bg-indigo-50 transition-colors">
                          <td className="py-3 px-4 sm:py-4 sm:px-6">
                            <div className="flex items-center">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700 font-nunito">
                                {capitalizeName(report.studentName)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell">
                            <div className="flex items-center">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm text-gray-700 font-nunito">
                                {capitalizeName(report.parentName)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6">
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm text-gray-700 capitalize font-nunito">
                                {report.reportType}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 hidden xs:table-cell">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm text-gray-700 font-nunito">
                                {formatDate(report.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6">
                            <div className="flex space-x-1 sm:space-x-2">
                              <button
                                onClick={() => toggleDropdown(report._id)}
                                className="p-1 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                title="View Details"
                              >
                                {activeReport === report._id ? (
                                  <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                ) : (
                                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  toggleDropdown(report._id);
                                  setTimeout(() => {
                                    const commentInput = document.getElementById(`comment-input-${report._id}`);
                                    if (commentInput) commentInput.focus();
                                  }, 100);
                                }}
                                className="p-1 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                title="Add Comment"
                              >
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <span className="text-xs text-gray-400 flex items-center ml-0.5 sm:ml-1 font-nunito">
                                {report.comments.length}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {activeReport === report._id && (
                          <tr>
                            <td colSpan="6" className="bg-indigo-50 p-0">
                              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-indigo-100">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center font-nunito">
                                      <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                                      Report Description
                                    </h3>
                                    <div className="max-h-48 overflow-y-auto pr-2">
                                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap bg-indigo-50 p-3 sm:p-4 rounded-md border border-indigo-100 font-nunito">
                                        {report.description}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm">
                                      <div>
                                        <div className="text-gray-500 mb-1 font-nunito">Student Name</div>
                                        <div className="font-medium font-nunito">{capitalizeName(report.studentName)}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-500 mb-1 font-nunito">Parent Name</div>
                                        <div className="font-medium font-nunito">{capitalizeName(report.parentName)}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-500 mb-1 font-nunito">Report Type</div>
                                        <div className="font-medium capitalize font-nunito">{report.reportType}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-500 mb-1 font-nunito">Status</div>
                                        <StatusBadge status={report.status} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-indigo-100">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center font-nunito">
                                      <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                                      Comments ({report.comments.length})
                                    </h3>

                                    <div className="mb-4 sm:mb-6">
                                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2">
                                        <input
                                          id={`comment-input-${report._id}`}
                                          type="text"
                                          value={comment}
                                          onChange={(e) => setComment(e.target.value)}
                                          placeholder="Add your comment here..."
                                          className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-nunito"
                                        />
                                        <div>
                                        <button
                                          onClick={() => handleAddComment(report._id)}
                                          disabled={commentLoading}
                                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 transition-colors font-nunito"
                                        >
                                          {commentLoading ? (
                                            <Loader2 className="animate-spin h-3 w-3 sm:h-4 sm:w-4" />
                                          ) : (
                                            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                                          )}
                                          Send
                                        </button>
                                        </div>
                                      </div>
                                    </div>

                                    {report.comments.length > 0 ? (
                                      <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-72 overflow-y-auto pr-2">
                                        {report.comments.map((comment, index) => (
                                          <div
                                            key={index}
                                            className={`p-2 sm:p-3 rounded-lg ${
                                              comment.author === 'admin'
                                                ? 'bg-indigo-50 border border-indigo-100'
                                                : 'bg-gray-50 border border-gray-100'
                                            }`}
                                          >
                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                              <span
                                                className={`text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full ${
                                                  comment.author === 'admin'
                                                    ? 'bg-indigo-100 text-indigo-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                } font-nunito`}
                                              >
                                                {comment.author === 'admin' ? 'Admin' : 'Parent'}
                                              </span>
                                              <span className="text-xs text-gray-500 font-nunito">
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-nunito">
                                              {comment.message}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 sm:py-8 text-gray-500">
                                        <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-gray-300" />
                                        <p className="text-xs sm:text-sm font-nunito">No comments yet</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;