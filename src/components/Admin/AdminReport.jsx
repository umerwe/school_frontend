import React,{ useState, useEffect, useMemo } from 'react';
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
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${style} font-nunito`}>
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

  // Fetch reports from dashboard summary
  const { data, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => ({
      data,
      isLoading,
      error,
    }),
  });

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

  // Sync reports state
  useEffect(() => {
    setReports(reportsData);
  }, [reportsData]);

  // Calculate report statistics
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

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
            Access Denied
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-nunito">
            You must be an admin to view reports. Please contact the administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-xl shadow-md">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">
                  Parent Reports Dashboard
                </h1>
                <p className="text-gray-500 font-nunito">
                  Manage and respond to reports submitted by parents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-nunito">Total Reports</p>
                <h3 className="text-2xl font-bold text-gray-800 font-nunito">{reports.length}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-nunito">Resolved</p>
                <h3 className="text-2xl font-bold text-emerald-600 font-nunito">{resolvedCount}</h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-nunito">Pending</p>
                <h3 className="text-2xl font-bold text-amber-600 font-nunito">{pendingCount}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
          <div className="p-6 border-b border-indigo-100 bg-white flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 font-nunito">All Reports</h2>
              <p className="text-sm text-gray-500 mt-1 font-nunito">
                Showing {reports.length} {reports.length === 1 ? 'report' : 'reports'}
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-0">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-nunito">Loading reports...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <FileText className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
                  Error
                </h3>
                <p className="text-gray-500 font-nunito">
                  {error?.data?.message || 'Failed to load reports. Please try again.'}
                </p>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <FileText className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
                  No Reports Found
                </h3>
                <p className="text-gray-500 font-nunito">
                  There are no parent reports submitted yet. Reports will appear here when parents submit them.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-indigo-200 bg-indigo-50">
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Student
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Parent
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Type
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Date
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider font-nunito">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {reports.map((report) => (
                      <React.Fragment key={report._id}>
                        <tr className="hover:bg-indigo-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-700 font-nunito">
                                {capitalizeName(report.studentName)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 font-nunito">
                                {capitalizeName(report.parentName)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 capitalize font-nunito">
                                {report.reportType}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 font-nunito">
                                {formatDate(report.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleDropdown(report._id)}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  toggleDropdown(report._id);
                                  setTimeout(() => {
                                    const commentInput = document.getElementById(`comment-input-${report._id}`);
                                    if (commentInput) commentInput.focus();
                                  }, 100);
                                }}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                title="Add Comment"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </button>
                              <span className="text-xs text-gray-400 flex items-center ml-1 font-nunito">
                                {report.comments.length}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {activeReport === report._id && (
                          <tr>
                            <td colSpan="6" className="bg-indigo-50 p-0">
                              <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center font-nunito">
                                      <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                                      Report Description
                                    </h3>
                                    <div className="max-h-48 overflow-y-auto pr-2">
                                      <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap bg-indigo-50 p-4 rounded-md border border-indigo-100 font-nunito">
                                        {report.description}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
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

                                  <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center font-nunito">
                                      <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
                                      Comments ({report.comments.length})
                                    </h3>

                                    <div className="mb-6">
                                      <div className="flex mb-3">
                                        <input
                                          id={`comment-input-${report._id}`}
                                          type="text"
                                          value={comment}
                                          onChange={(e) => setComment(e.target.value)}
                                          placeholder="Add your comment here..."
                                          className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-nunito"
                                        />
                                        <button
                                          onClick={() => handleAddComment(report._id)}
                                          disabled={commentLoading}
                                          className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors font-nunito"
                                        >
                                          {commentLoading ? (
                                            <Loader2 className="animate-spin h-4 w-4" />
                                          ) : (
                                            <Send className="h-4 w-4" />
                                          )}
                                          Send
                                        </button>
                                      </div>
                                    </div>

                                    {report.comments.length > 0 ? (
                                      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                        {report.comments.map((comment, index) => (
                                          <div
                                            key={index}
                                            className={`p-3 rounded-lg ${
                                              comment.author === 'admin'
                                                ? 'bg-indigo-50 border border-indigo-100'
                                                : 'bg-gray-50 border border-gray-100'
                                            }`}
                                          >
                                            <div className="flex justify-between items-start mb-2">
                                              <span
                                                className={`text-xs font-medium px-2 py-1 rounded-full ${
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
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap font-nunito">
                                              {comment.message}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-8 text-gray-500">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                        <p className="font-nunito">No comments yet</p>
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