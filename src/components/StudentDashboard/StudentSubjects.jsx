import React from 'react';
import { useSelector } from 'react-redux';
import { BookOpen } from 'lucide-react';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';

export default function StudentSubjects() {
  const user = useSelector((store) => store.userSlice.user);
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const subjects = data?.subjects || [];

  const capitalizeName = (name) => {
    return (
      name
        ?.split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') || ''
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Your Subjects
              </h2>
              <p className="text-gray-600 max-w-3xl text-xs sm:text-sm">
                Subjects assigned to your class
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-8 animate-pulse h-80 border border-indigo-200"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full"></div>
                </div>
                <div className="h-7 bg-indigo-100 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-5 bg-indigo-100 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-indigo-100 rounded w-full mx-auto mb-2"></div>
                <div className="h-4 bg-indigo-100 rounded w-5/6 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-indigo-200">
            <div className="mx-auto w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-14 w-14 text-indigo-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">
              Error Loading Subjects
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">
              {error.data?.message || 'Failed to fetch subjects. Please try again later.'}
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-indigo-200">
            <div className="mx-auto w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-14 w-14 text-indigo-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">
              No Subjects Assigned
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">
              Please contact your teacher or admin for more information.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-indigo-200 flex flex-col h-full"
              >
                <div className="p-8 flex flex-col items-center text-center space-y-4 flex-1">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-100 ring-4 ring-indigo-100 mb-4">
                    <BookOpen className="h-9 w-9 text-indigo-500" />
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-800 capitalize"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    {capitalizeName(subject.subjectName)}
                  </h3>
                  <div
                    className="flex items-center justify-center px-4 py-2 bg-indigo-100 rounded-full text-sm sm:text-base text-indigo-800 font-medium mb-4"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    Teacher: {capitalizeName(subject.subjectTeacher?.name) || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}