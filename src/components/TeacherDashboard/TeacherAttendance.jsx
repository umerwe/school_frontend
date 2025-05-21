import React, { useState, useEffect } from "react";
import { message } from "antd";
import { Loader2, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetDashboardSummaryQuery,
  useSubmitAttendanceMutation
} from "../../store/slices/teacherDashboardApi";

export default function TeacherAttendance() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);
  const classInfo = currentUser?.classTeacherOf;

  // RTK Query hooks
  const { data: dashboardData, isFetching: isFetchingDashboard } = useGetDashboardSummaryQuery();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});

  // Submit attendance mutation
  const [submitAttendance, { isLoading: isSubmitting }] = useSubmitAttendanceMutation();

  // Extract students from dashboard data
  const students = dashboardData?.students || [];

  // Initialize attendance state when students or date changes
  useEffect(() => {
    if (students.length > 0) {
      setAttendance(students.reduce((acc, student) => ({
        ...acc,
        [student._id]: "present" // Default to present
      }), {}));
    }
  }, [students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    try {
      if (!classInfo?._id || !date || !Object.keys(attendance).length) {
        throw new Error("Class, date, and attendance are required");
      }

      const payload = {
        classId: classInfo._id,
        date,
        students: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status
        }))
      };

      const response = await submitAttendance(payload).unwrap();

      message.success(response.message || "Attendance saved successfully!");
      navigate('/teacher-dashboard/attendance/history');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to save attendance");
    }
  };

  const capitalizeName = (name) => {
    return name?.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') || '';
  };

  // Layout components
  const NoClassAssigned = (
    <div className="text-center py-4 bg-white border border-indigo-200 shadow-sm rounded-lg">
      <p className="text-gray-800 font-nunito">
        No class assigned to you. Please contact the admin.
      </p>
    </div>
  );

  const NoStudents = (
    <div className="text-center py-4 bg-yellow-100 border border-yellow-300 shadow-sm rounded-lg">
      <p className="text-yellow-800 font-nunito">
        No students found for this class.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
            <BookOpen className="md:w-7 md:h-7 text-indigo-600" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Mark Attendance
              </h2>
              <p className="text-indigo-600 text-xs md:text-sm font-medium flex items-center gap-1">
                {classInfo.classTitle}-{classInfo.section}
              </p>
            </div>
          </div>

        {!classInfo?._id ? (
          NoClassAssigned
        ) : (
          <div className="space-y-6">
            {/* Class Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                Class
              </label>
              <p className="w-full p-3 border border-indigo-200 rounded-md bg-white text-gray-800 font-nunito">
                {classInfo.classTitle}-{classInfo.section}
              </p>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 font-nunito"
              />
            </div>

            {/* Content States */}
            {isFetchingDashboard ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : students.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 font-nunito">
                  Students
                </h3>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-gray-200 ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 font-nunito">
                              Roll Number
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-nunito">
                              Student Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 font-nunito">
                              Present
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 font-nunito">
                              Absent
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {students.map(student => (
                            <tr key={student._id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-800 sm:pl-6 font-nunito">
                                {student.rollNumber}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 font-nunito">
                                {capitalizeName(student.name)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                <input
                                  type="radio"
                                  name={`attendance-${student._id}`}
                                  checked={attendance[student._id] === "present"}
                                  onChange={() => handleAttendanceChange(student._id, "present")}
                                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                <input
                                  type="radio"
                                  name={`attendance-${student._id}`}
                                  checked={attendance[student._id] === "absent"}
                                  onChange={() => handleAttendanceChange(student._id, "absent")}
                                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              NoStudents
            )}

            {/* Submit Button */}
            {students.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`mt-8 w-full bg-indigo-500 text-white py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'hover:bg-indigo-600'} font-nunito`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    Saving...
                  </>
                ) : (
                  'Save Attendance'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}