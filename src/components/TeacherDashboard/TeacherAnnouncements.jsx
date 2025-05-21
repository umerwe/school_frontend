import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { ClipboardList, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../store/slices/teacherDashboardApi";

export default function TeacherAnnouncements() {
  const { data: dashboardData, isLoading: loading, error } = useGetDashboardSummaryQuery();
  const [expandedId, setExpandedId] = useState(null);
  const didFetchRef = useRef(false);

  // Extract announcements from dashboard data or default to empty array
  const announcements = dashboardData?.announcements || [];

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    if (error && !loading) {
      const backendError = error?.data?.message || "Failed to load announcements. Please try again later.";
      message.error(backendError);
    }
  }, [error, loading]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const capitalizeWords = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") || ""
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4 border-gray-200">
          Announcements
        </h2>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-5 animate-pulse h-20 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 border-b pb-4 border-indigo-200 font-nunito">
          Announcements
        </h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <p className="text-gray-800 text-lg">
            {error?.data?.message || "Failed to load announcements. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 border-b pb-4 border-indigo-200 font-nunito">
          Announcements
        </h2>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <AlertCircle className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error?.data?.message || 'Failed to load announcements. Please try again.'}
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <ClipboardList className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Announcements Found
            </h3>
            <p className="text-gray-500 font-nunito">
              No announcements are available at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-5 hover:bg-indigo-50 cursor-pointer transition duration-150"
                  onClick={() => toggleExpand(a._id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <ClipboardList className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg font-nunito">
                        {capitalizeWords(a.title)}
                      </h3>
                      <span className="text-xs text-gray-500 font-nunito">
                        {new Date(a.createdAt).toLocaleDateString()} at{' '}
                        {new Date(a.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    {expandedId === a._id ? (
                      <ChevronUp className="h-6 w-6 text-indigo-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-indigo-500" />
                    )}
                  </div>
                </div>

                {expandedId === a._id && (
                  <div className="px-6 pb-6 pt-2 bg-indigo-50 border-t border-indigo-200">
                    <div className="flex flex-col">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words max-w-full font-nunito">
                        {a.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}