import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BookOpen, User, Loader2, Filter, FileText, ChevronDown } from 'lucide-react';
import { Select } from 'antd';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';

const StudentMarks = () => {
  const user = useSelector((state) => state.userSlice.user);
  const [filterType, setFilterType] = useState('');
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const marks = Array.isArray(data?.marks) ? data.marks : [];

  const capitalizeName = (name) => {
    return name
      ?.split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || '';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-200';
      case 'A': return 'bg-green-50 text-green-700 border-green-100';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'C': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'F': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  // Ensure filteredMarks is always an array
  const filteredMarks = Array.isArray(marks)
    ? filterType
      ? marks.filter((mark) => mark.assessmentType === filterType)
      : marks
    : [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header and Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 mb-1 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="md:w-7 md:h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Student Marks Records
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-nunito">
                All submitted marks with student details and grades
              </p>
            </div>
          </div>
          {/* Custom Select Dropdown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FileText className="w-4 h-4 text-indigo-500" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-48 pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
              disabled={isLoading}
            >
              <option value="">All Types</option>
              <option value="Class Test">Class Test</option>
              <option value="Monthly Test">Monthly Test</option>
              <option value="Assignment">Assignment</option>
              <option value="Mid Term Exam">Mid Term Exam</option>
              <option value="Pre-Board Exam">Pre-Board Exam</option>
              <option value="Final Term Exam">Final Term Exam</option>
              <option value="Annual Exam">Annual Exam</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading, Error, Empty State, or Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">
              Loading marks records...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Filter className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error Loading Marks
            </h3>
            <p className="text-gray-500 font-nunito">
              {error.data?.message || 'Failed to fetch marks records.'}
            </p>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Filter className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Marks Records Found
            </h3>
            <p className="text-gray-500 font-nunito">
              No marks have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[140px]">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[100px]">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <BookOpen className="w-4 h-4" />
                        Subject
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[140px]">
                      Assessment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      Marks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      Subject Teacher
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      Class Teacher
                    </th> 
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {filteredMarks.map((mark, index) => (
                    <tr
                      key={mark._id}
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {capitalizeName(mark.student?.name)}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Roll: {mark.student?.rollNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {mark.classTitle ? `Grade ${mark.classTitle}` : 'N/A'}
                        {mark.section && (
                          <span className="text-gray-400 ml-1">• Sec {mark.section}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(mark.subject) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(mark.assessmentType) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm font-nunito">
                        <div className="flex items-baseline gap-1">
                          <span className="font-medium text-gray-800">{mark.obtainedMarks}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-500">{mark.totalMarks}</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getGradeColor(mark.grade)}`}>
                            {mark.grade || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(mark.subjectTeacher?.name) || (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(mark.classTeacher?.name) || (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarks;