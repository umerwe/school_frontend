import { ChevronDownIcon, X, Calendar, User, BookOpen, CheckCircle2, XCircle, Clock, Loader2, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery } from "../../api/teacherDashboardApi";
import { useState, useEffect } from "react";

export default function TeacherAttendanceHistory() {
  const currentUser = useSelector((store) => store.userSlice.user);
  const classInfo = currentUser?.classTeacherOf;

  const {
    data,
    isLoading: loadingAttendance,
    error
  } = useGetDashboardSummaryQuery();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // Extract data from API responses
  const students = data?.students || [];
  const allRecords = data?.attendance || [];
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Status configuration with colors and icons
  const statusConfig = {
    present: {
      class: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    },
    absent: {
      class: "bg-red-100 text-red-800 border-red-200",
      icon: <XCircle className="w-4 h-4 text-red-500" />
    },
    late: {
      class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock className="w-4 h-4 text-yellow-500" />
    },
    default: {
      class: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <Loader2 className="w-4 h-4 text-gray-500" />
    }
  };

  const getStatusInfo = (status) => {
    const statusLower = (status || "").toLowerCase();
    return statusConfig[statusLower] || statusConfig.default;
  };

  // Calculate total records from filtered records
  const calculateTotalRecords = (records) => {
    return records.reduce((total, record) => total + record.students.length, 0);
  };

  // Capitalize student name
  const capitalizeName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "";

  // Format date for display
  const formatDisplayDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Format date for input max value and comparison
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  // Filter records locally when date or student changes
  useEffect(() => {
    if (!allRecords.length) {
      setFilteredRecords([]);
      setTotalRecords(0);
      return;
    }

    let filtered = [...allRecords];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((record) => {
        const recordDate = formatDate(record.date);
        return recordDate === selectedDate;
      });
    }

    // Filter by student
    if (selectedStudent) {
      filtered = filtered.map((record) => ({
        ...record,
        students: record.students.filter(
          (student) => student.studentId === selectedStudent
        ),
      })).filter((record) => record.students.length > 0);
    }

    setFilteredRecords(filtered);
    setTotalRecords(calculateTotalRecords(filtered));
  }, [selectedDate, selectedStudent, allRecords]);

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleStudentChange = (e) => setSelectedStudent(e.target.value);
  const clearFilters = () => {
    setSelectedDate("");
    setSelectedStudent("");
  };

  if (!classInfo?._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Class Assigned
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't been assigned to any class. Please contact the administration for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {error?.data?.message || 'Failed to load attendance data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-sm border border-indigo-100">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="md:w-7 md:h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Attendance History
              </h2>
              <p className="text-indigo-600 text-xs md:text-sm font-medium flex items-center gap-1">
                {classInfo.classTitle}-{classInfo.section}
              </p>
            </div>
          </div>
          {(selectedDate || selectedStudent) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={formatDate(new Date())}
                className="w-full pl-10 pr-3 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                disabled={loadingAttendance}
              />
            </div>
          </div>

          {/* Student Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <select
                value={selectedStudent}
                onChange={handleStudentChange}
                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                disabled={loadingAttendance}
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {capitalizeName(student.name)} ({student.rollNumber})
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Total Records Card */}
          <div className="flex items-end">
            <div className="w-full bg-white p-4 rounded-xl border border-indigo-100 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 mb-1 uppercase tracking-wider">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {loadingAttendance ? (
                      <span className="inline-block w-16 h-8 bg-indigo-100 rounded animate-pulse" />
                    ) : (
                      totalRecords
                    )}
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loadingAttendance ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500">
              Loading attendance records...
            </p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {filteredRecords.map((record) =>
                    record.students.map((student) => {
                      const statusInfo = getStatusInfo(student.status);
                      return (
                        <tr
                          key={`${record._id}-${student.studentId}`}
                          className="hover:bg-indigo-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDisplayDate(record.date)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            {capitalizeName(student.name)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {statusInfo.icon}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusInfo.class}`}
                              >
                                {student.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Records Found
            </h3>
            <p className="text-gray-500">
              {selectedDate || selectedStudent
                ? "No attendance records match your filters"
                : "No attendance records available for this class"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}