import { useState } from "react";
import { ClipboardList, ChevronDown, ChevronUp, AlertCircle, Loader2 } from "lucide-react";
import { useGetParentDashboardSummaryQuery } from "../../store/slices/parentDashboardApi";

export default function Announcements() {
  const [expandedId, setExpandedId] = useState(null);
  const { data, error, isLoading } = useGetParentDashboardSummaryQuery();
  const announcements = data?.announcements || [];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white px-4 py-6 md:px-8 md:py-8 rounded-2xl shadow-sm border border-indigo-100">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 ml-3 sm:ml-0 text-gray-800 border-b pb-4 border-indigo-200 font-nunito">
          Announcements
        </h2>

        {isLoading ? (
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