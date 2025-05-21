
import { useSelector } from "react-redux";
import { BookOpen, Users, User, ChevronDown, ChevronUp } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../store/slices/teacherDashboardApi";
import { useState } from "react";

export default function ClassDetailView() {
  const user = useSelector((store) => store.userSlice.user);
  const { data: dashboardData, isLoading: loading, error } = useGetDashboardSummaryQuery();
  const classData = dashboardData.classDetails;
  const [expandedSection, setExpandedSection] = useState({
    subjects: true,
    students: true,
  });

  const toggleSection = (section) => {
    setExpandedSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-2xl mx-auto mt-16 border border-gray-100">
        <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-12 w-12 text-indigo-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          No Class Data Found
        </h3>
        <p className="text-gray-500 text-lg mb-6">
          You are not currently assigned to any class.
        </p>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Refresh Page
        </button>
      </div>
    );
  }

  const capitalizeName = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") || ""
    );
  };

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-4 md:mx-8 bg-gray-50 min-h-screen mt-8 rounded-2xl shadow-lg border border-indigo-100">
      {/* Header Section */}
      <div className="flex p-4 flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex gap-4">
          <div>
            <Users className="md:w-7 md:h-7 text-indigo-600" />
          </div>
          <div className="-mt-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Class Dashboard</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Manage and track your assigned class</p>
          </div>
        </div>
        <span className="text-sm hidden md:block px-4 py-2 rounded-full -mt-2 font-medium text-indigo-700 bg-indigo-50 border border-indigo-100">
          Class Teacher
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Class Section</p>
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                Grade {classData.classTitle} - {classData.section}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <User className="h-6 w-6 text-indigo-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Class Teacher</p>
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                {capitalizeName(classData.classTeacher.name)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Students</p>
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                {classData.students.length} Students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Subjects Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="flex items-center justify-between cursor-pointer px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("subjects")}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <BookOpen className="h-4 w-4 sm:h-5 md:w-5 text-indigo-600" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-md sm:text-lg text-gray-800">Subject List</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700">
                {classData.subjects.length}
              </span>
            </div>
            {expandedSection.subjects ? (
              <ChevronUp className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors" />
            )}
          </div>

          {expandedSection.subjects && (
            <div className="border-t border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.subjects.map((subj, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-medium text-gray-900">
                                {capitalizeName(subj.subjectName)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-900">
                            {capitalizeName(subj.subjectTeacher?.name) || "Not Assigned"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="flex items-center justify-between cursor-pointer px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("students")}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-md sm:text-lg text-gray-800">Student List</span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                {classData.students.length}
              </span>
            </div>
            {expandedSection.students ? (
              <ChevronUp className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors" />
            )}
          </div>

          {expandedSection.students && (
            <div className="border-t border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.students.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-medium text-gray-900">
                                {capitalizeName(student.name)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700">
                            {student.rollNumber}
                          </span>
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
    </div>
  );
}