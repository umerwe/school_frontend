import React, { useState } from 'react';
import { ClipboardList, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';

export default function StudentAnnouncements() {
  const [expandedId, setExpandedId] = useState(null);
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const announcements = data?.announcements || [];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (isLoading) {
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
        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4 border-gray-200">
          Announcements
        </h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <p className="text-gray-800 text-lg">
            {error.data?.message || 'Failed to load announcements. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4 border-gray-200">
        Announcements
      </h2>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardList className="h-12 w-12 text-indigo-500" />
          </div>
          <p className="text-gray-800 text-lg">No announcements available at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition duration-150"
                onClick={() => toggleExpand(a._id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {capitalizeWords(a.title)}
                    </h3>
                    <span className="text-xs text-gray-500">
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
                <div className="px-6 pb-6 pt-2 bg-gray-100 border-t border-indigo-100">
                  <div className="flex flex-col">
                    <div className="inline-block px-3 py-1 text-xs rounded-full mb-3 self-start font-medium capitalize tracking-wide whitespace-nowrap items-center"></div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words max-w-full">
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
  );
}