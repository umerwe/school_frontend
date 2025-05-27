import React, { useState, useEffect } from "react";
import { Loader2, BookOpen, X, User, ChevronDown, CheckCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import {
  AcademicCapIcon,
  UserCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useGetParentDashboardSummaryQuery } from "../../api/parentDashboardApi";

export default function ChildMarks() {
  const currentUser = useSelector((store) => store.userSlice.user);
  const children = currentUser?.childrens || [];
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const { data, error, isLoading } = useGetParentDashboardSummaryQuery();
  const childrenDetails = data?.childrenDetails || [];
  console.log(childrenDetails)
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

  // Set the first child as the default selected student
  useEffect(() => {
    if (children.length > 0 && !selectedStudentId) {
      setSelectedStudentId(children[0]._id);
    }
  }, [children, selectedStudentId]);

  // Filter marks for the selected student
  const selectedStudentDetails = childrenDetails.find(
    (child) => child.studentId === selectedStudentId
  );

  const marks = selectedStudentDetails?.marks || [];

  // Calculate marks metrics
  const totalMarks = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
  const obtainedMarks = marks.reduce((sum, mark) => sum + mark.obtainedMarks, 0);
  const marksPercentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

  // Find the selected student's details
  const selectedStudent = children.find((child) => child._id === selectedStudentId);

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
            No Students Found
          </h3>
          <p className="text-gray-500 font-nunito">
            Please contact administration for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Marks Records
              </h2>
              <p className="text-gray-500 font-nunito text-xs sm:text-sm">
                View and track marks records for your children
              </p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div className="mb-8">
          <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
            Select Student
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserCircleIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <select
              id="studentSelect"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {capitalizeWords(child.name) || `Student ${child._id}`} (Class {child.studentClass || "N/A"} - {child.section || "N/A"})
                </option>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
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
              label: "Percentage",
              value: `${marksPercentage}%`,
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
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin -spin" />
            <p className="text-gray-500 font-nunito">
              Loading marks records...
            </p>
          </div>
        ) : marks.length > 0 ? (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        Subject
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <DocumentTextIcon className="w-4 h-4" />
                        Assessment Type
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <ChartBarIcon className="w-4 h-4" />
                        Marks
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        Grade
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Class
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {marks.map((mark) => (
                    <tr
                      key={mark._id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeWords(mark.subject)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeWords(mark.assessmentType)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium">{mark.obtainedMarks}</span>
                          <span className="text-gray-400">/</span>
                          <span>{mark.totalMarks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getGradeColor(mark.grade)}`}
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {mark.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                        {selectedStudent?.studentClass || "N/A"} -{" "}
                        {selectedStudent?.section || "N/A"}
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
              No marks records available for this student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}