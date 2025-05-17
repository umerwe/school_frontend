import React from 'react';
import { useSelector } from 'react-redux';
import { BookOpen } from 'lucide-react';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';

export default function StudentSubjects() {
  const user = useSelector((store) => store.userSlice.user);
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const subjects = data.subjects || [];

  const capitalizeName = (name) => {
    return (
      name
        ?.split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') || ''
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-indigo-50 min-h-screen">
      <div className="mb-8">
        <h2
          className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Your Subjects
        </h2>
        <p
          className="text-gray-500 mt-1"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Subjects assigned to your class
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 animate-pulse h-64 border border-indigo-200"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full"></div>
              </div>
              <div className="h-6 bg-indigo-100 rounded w-3/4 mx-auto mb-3"></div>
              <div className="h-4 bg-indigo-100 rounded w-1/2 mx-auto mb-3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-indigo-200">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-500" />
          </div>
          <h3
            className="text-lg font-medium text-gray-800 mb-1"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Error Loading Subjects
          </h3>
          <p
            className="text-gray-500"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {error.data?.message || 'Failed to fetch subjects. Please try again later.'}
          </p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-indigo-200">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-500" />
          </div>
          <h3
            className="text-lg font-medium text-gray-800 mb-1"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            No Subjects Assigned
          </h3>
          <p
            className="text-gray-500"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Please contact your teacher or admin for more information.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject,i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-indigo-200 flex flex-col"
            >
              <div className="p-6 flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-15 h-15 flex items-center justify-center rounded-full bg-indigo-100 ring-4 ring-indigo-100">
                  <BookOpen className="h-7 w-7 text-indigo-500" />
                </div>
                <h3
                  className="text-lg font-semibold text-gray-800 capitalize"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {capitalizeName(subject.subjectName)}
                </h3>
                <div
                  className="flex items-center justify-center px-3 py-1 bg-indigo-100 rounded-full text-sm text-indigo-800 font-medium"
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
  );
}