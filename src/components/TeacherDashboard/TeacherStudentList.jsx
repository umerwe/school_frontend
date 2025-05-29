import { message } from "antd";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Search } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../api/teacherDashboardApi";

export default function TeacherStudentList() {
  const user = useSelector((store) => store.userSlice.user);
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: loading, error } = useGetDashboardSummaryQuery();
  const hasFetchedData = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract students from dashboard data or default to empty array
  const students = dashboardData?.students || [];

  if (error && !hasFetchedData.current) {
    message.error(error?.data?.message || "Failed to fetch Students");
    hasFetchedData.current = true;
  }

  const capitalizeName = (name) =>
    name?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "";

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row rounded-xl shadow-sm border-1 border-indigo-100 justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 overflow-visible">
          {/* Header Section */}
          <div className="bg-white p-4 sm:p-6 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">Students</h1>
                <p className="text-sm sm:text-base text-gray-500 font-nunito -mt-1">{filteredStudents.length} students enrolled</p>
              </div>
            </div>
          </div>
          {/* Search Section */}
          <div className="bg-white p-4 sm:p-6 w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="block w-full pl-10 pr-3 py-2 border border-indigo-100 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-nunito text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 animate-pulse h-64 border border-indigo-100">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full"></div>
                </div>
                <div className="h-6 bg-indigo-100 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-indigo-100 rounded w-1/2 mx-auto mb-6"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-indigo-100 rounded w-full"></div>
                  <div className="h-3 bg-indigo-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-indigo-100">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <User className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 font-nunito">
              {searchTerm ? "No matching students found" : "No Students Found"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-nunito mt-2">
              {searchTerm ? "Try a different search term" : "There are currently no students in the system."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStudents.map((student, index) => (
              <div
                key={student._id}
                className={`bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition-colors duration-200 border border-indigo-100 flex flex-col relative ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
              >
                <div className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 flex-1">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 ring-4 ring-indigo-100 hover:ring-indigo-500 transition-all">
                    {student.logo ? (
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={student.logo}
                        alt={`${student.name}'s avatar`}
                      />
                    ) : (
                      <User className="w-10 h-10 text-indigo-500 mx-auto mt-3" />
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 font-nunito">{capitalizeName(student.name)}</h3>
                  <div className="text-sm sm:text-base text-gray-700 font-nunito">Roll No: {student.rollNumber}</div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700 font-nunito">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Class {student.studentClass} - Section {student.section}</span>
                  </div>
                  <div className="text-sm sm:text-base text-gray-700 font-nunito">Email: {student.email}</div>
                </div>
                <div className="px-4 sm:px-6 py-4 bg-indigo-50 border-t border-indigo-100">
                  <button
                    onClick={() => navigate('/teacher-dashboard/student/profile', { state: { student } })}
                    className="w-full text-sm sm:text-base font-medium text-indigo-500 hover:text-indigo-600 transition-colors font-nunito"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}