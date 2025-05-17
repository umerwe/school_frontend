import { message } from "antd";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, BookOpen } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../store/slices/teacherDashboardApi";

export default function TeacherStudentList() {
  const user = useSelector((store) => store.userSlice.user);
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: loading, error } = useGetDashboardSummaryQuery();
  const hasFetchedData = useRef(false);

  // Extract students from dashboard data or default to empty array
  const students = dashboardData?.students || [];

  if (error && !hasFetchedData.current) {
    message.error(error?.data?.message || "Failed to fetch Students");
    hasFetchedData.current = true;
  }

  const capitalizeName = (name) =>
    name?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "";

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">{students.length} students enrolled</p>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse h-48 border border-indigo-200">
              <div className="h-6 bg-indigo-100 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-indigo-100 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-indigo-100 rounded w-full"></div>
                <div className="h-3 bg-indigo-100 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-indigo-200">
          <User className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Students Found</h3>
          <p className="text-gray-500 mt-2">There are currently no students in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-indigo-200 flex flex-col relative group"
            >
              <div className="p-6 flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-16 h-16 rounded-full bg-indigo-100 ring-4 ring-indigo-200 group-hover:ring-indigo-500 transition-all">
                  {student.logo ? (
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={student.logo}
                      alt={`${student.name}'s avatar`}
                    />
                  ) : (
                    <User className="w-10 h-10 text-indigo-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{capitalizeName(student.name)}</h3>
                <div className="text-sm text-gray-600">Roll No: {student.rollNumber}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Class {student.studentClass} - Section {student.section}</span>
                </div>
                <div className="text-sm text-gray-600">Email: {student.email}</div>
              </div>
              <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-200">
                <button
                  onClick={() => navigate('/teacher-dashboard/student/profile', { state: { student } })}
                  className="w-full text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}