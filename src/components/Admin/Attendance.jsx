import { X, Calendar, BookOpen, CheckCircle2, XCircle, Clock, Loader2, Users } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../api/adminDashboardApi";
import { useState, useEffect } from "react";

export default function Attendance() {
    const {
        data,
        isLoading: loadingAttendance,
        error
    } = useGetDashboardSummaryQuery();
    console.log(data)
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    // Extract data from API responses
    const allRecords = data?.attendance || [];
    const [mergedRecords, setMergedRecords] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPresent, setTotalPresent] = useState(0);

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

    // Capitalize student names
    const capitalizeWords = (str) =>
        str
            ?.toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    // Format date for display
    const formatDisplayDate = (dateString) =>
        new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Format date for input max value and comparison
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];

    // Merge records by date and calculate totals
    useEffect(() => {
        if (!allRecords.length) {
            setMergedRecords([]);
            setTotalRecords(0);
            setTotalPresent(0);
            return;
        }

        // Create a map to merge records by date
        const mergedByDate = new Map();

        allRecords.forEach(record => {
            const dateKey = formatDate(record.date);
            const existingRecord = mergedByDate.get(dateKey);

            if (existingRecord) {
                // Merge students if date already exists
                existingRecord.students.push(...record.students.map(s => ({
                    ...s,
                    class: record.class // Add class information to each student
                })));
                existingRecord.presentCount += record.students.filter(s => s.status === 'present').length;
            } else {
                // Create new entry if date doesn't exist
                mergedByDate.set(dateKey, {
                    date: record.date,
                    class: record.class,
                    students: record.students.map(s => ({
                        ...s,
                        class: record.class // Add class information to each student
                    })),
                    presentCount: record.students.filter(s => s.status === 'present').length
                });
            }
        });

        // Convert map to array and sort by date (newest first)
        const mergedArray = Array.from(mergedByDate.values())
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        setMergedRecords(mergedArray);

        // Filter for selected date
        const filtered = mergedArray.filter(record => formatDate(record.date) === selectedDate);

        // Calculate totals
        const presentCount = filtered.reduce((count, record) => count + record.presentCount, 0);
        const totalCount = filtered.reduce((total, record) => total + record.students.length, 0);

        setTotalRecords(totalCount);
        setTotalPresent(presentCount);
    }, [selectedDate, allRecords]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const clearFilters = () => {
        setSelectedDate(today);
    };

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

    // Get records to display based on current date filter
    const displayRecords = mergedRecords.filter(record => formatDate(record.date) === selectedDate);

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-sm border border-indigo-100">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <BookOpen className="h-5 w-5 md:h-8 md:w-8 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Attendance History
                            </h2>
                            <p className="text-xs sm:text-base text-indigo-600 font-medium flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Attendance for {formatDisplayDate(selectedDate)}
                            </p>
                        </div>
                    </div>
                    {selectedDate !== today && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            <X className="w-4 h-4" />
                            Show Today
                        </button>
                    )}
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                            <p className="text-xs text-indigo-600 mb-1 uppercase tracking-wider">
                                Total Records
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                                {loadingAttendance ? (
                                    <span className="inline-block w-12 h-6 bg-indigo-100 rounded animate-pulse" />
                                ) : (
                                    totalRecords
                                )}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-green-100 shadow-xs">
                            <p className="text-xs text-green-600 mb-1 uppercase tracking-wider">
                                Total Present
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                                {loadingAttendance ? (
                                    <span className="inline-block w-12 h-6 bg-green-100 rounded animate-pulse" />
                                ) : (
                                    totalPresent
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                {loadingAttendance ? (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    </div>
                ) : displayRecords.length > 0 ? (
                    <div className="space-y-6">
                        {displayRecords.map((record) => (
                            <div key={formatDate(record.date)} className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">

                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-indigo-100">
                                        <thead className="bg-indigo-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Student
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Class
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
                                            {record.students.map((student, index) => {
                                                const statusInfo = getStatusInfo(student.status);
                                                return (
                                                    <tr
                                                        key={`${formatDate(record.date)}-${student.studentId}-${index}`}
                                                        className="hover:bg-indigo-50 transition-colors duration-200"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                            {capitalizeWords(student.name)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">
                                                            {student.class}
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
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No Attendance Records Found
                        </h3>
                        <p className="text-gray-500 text-center max-w-md">
                            No attendance records found for {formatDisplayDate(selectedDate)}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}