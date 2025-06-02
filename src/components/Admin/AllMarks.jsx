import React, { useState } from "react";
import { 
  Loader2, 
  BookOpen, 
  X, 
  ChevronDown, 
  CheckCircleIcon,
  Search,
  Filter,
  Download,
  User
} from "lucide-react";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UsersIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import { useGetDashboardSummaryQuery } from "../../api/adminDashboardApi";

export default function AllMarks() {
  const { data, error, isLoading } = useGetDashboardSummaryQuery();
  const marksData = data?.marks || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedAssessment, setSelectedAssessment] = useState("All");

  // Get unique values for filters
  const classes = [...new Set(marksData.map(mark => mark.classTitle))].sort();
  const subjects = [...new Set(marksData.map(mark => mark.subject))].sort();
  const assessments = [...new Set(marksData.map(mark => mark.assessmentType))].sort();

  // Capitalize words for display
  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Get grade color for styling
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-200';
      case 'A': return 'bg-green-50 text-green-700 border-green-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'F': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter marks data based on search and filters
  const filteredMarks = marksData.filter(mark => {
    const matchesSearch = 
      mark.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === "All" || mark.classTitle == selectedClass;
    const matchesSubject = selectedSubject === "All" || mark.subject === selectedSubject;
    const matchesAssessment = selectedAssessment === "All" || mark.assessmentType === selectedAssessment;

    return matchesSearch && matchesClass && matchesSubject && matchesAssessment;
  });

  // Calculate overall statistics
  const totalStudents = [...new Set(filteredMarks.map(mark => mark.student?._id))].length;
  const totalMarks = filteredMarks.reduce((sum, mark) => sum + mark.totalMarks, 0);
  const obtainedMarks = filteredMarks.reduce((sum, mark) => sum + mark.obtainedMarks, 0);
  const averagePercentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                All Students Marks
              </h2>
              <p className="text-gray-500 font-nunito text-xs sm:text-sm">
                View and manage all students' marks records
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              className="block w-full pl-10 pr-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UsersIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
            >
              <option value="All">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-indigo-500" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
            >
              <option value="All">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{capitalizeWords(subject)}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-indigo-500" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FunnelIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
            >
              <option value="All">All Assessments</option>
              {assessments.map(assessment => (
                <option key={assessment} value={assessment}>{capitalizeWords(assessment)}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center mt-0.5">
              <X className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium font-nunito">
                Failed to fetch marks records
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 font-nunito"
              >
                <ArrowPathIcon className="w-3 h-3" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Total Students",
              value: totalStudents,
              icon: <UsersIcon className="w-6 h-6 text-indigo-500" />
            },
            {
              label: "Total Marks",
              value: totalMarks,
              icon: <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
            },
            {
              label: "Obtained Marks",
              value: obtainedMarks,
              icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />
            },
            {
              label: "Average Percentage",
              value: `${averagePercentage}%`,
              icon: <ChartBarIcon className="w-6 h-6 text-blue-500" />
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-xl border border-indigo-100 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 mb-1 font-nunito uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 font-nunito">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-indigo-100 rounded animate-pulse" />
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">
              Loading marks records...
            </p>
          </div>
        ) : filteredMarks.length > 0 ? (
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
                              {capitalizeWords(mark.student?.name)}
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
                        {capitalizeWords(mark.subject) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeWords(mark.assessmentType) || 'N/A'}
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
                        {capitalizeWords(mark.subjectTeacher?.name) || (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeWords(mark.classTeacher?.name) || (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Marks Records Found
            </h3>
            <p className="text-gray-500 font-nunito">
              No marks records match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}