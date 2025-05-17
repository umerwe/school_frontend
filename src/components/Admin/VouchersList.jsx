import React, { useState, useEffect, useRef } from "react";
import { Loader2, Filter, Ticket, Calendar, ChevronDown, FileText, BookOpen, Currency } from "lucide-react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useGetDashboardSummaryQuery } from "../../store/slices/adminDashboardApi";

const VoucherList = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((store) => store.userSlice.user);
    const { data: summary, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
        selectFromResult: ({ data, isLoading, error }) => ({
            data: data?.vouchers || [],
            isLoading,
            error
        })
    });
    const [vouchers, setVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const fetchRef = useRef(false);

    // Predefined options
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Status configuration
    const statusConfig = {
        unpaid: {
            class: "bg-red-100 text-red-800 border-red-200",
            buttonClass: "bg-indigo-600 text-white hover:bg-indigo-700",
            buttonText: "Pay Now",
            disabled: false,
        },
        paid: {
            class: "bg-green-100 text-green-800 border-green-200",
            buttonClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
            buttonText: "Paid",
            disabled: true,
        },
        default: {
            class: "bg-gray-100 text-gray-800 border-gray-200",
            buttonClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
            buttonText: "N/A",
            disabled: true,
        },
    };

    // Format date for display
    const formatDisplayDate = (dateString) =>
        new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Capitalize student name
    const capitalizeName = (name) =>
        name
            ?.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ") || "";

    // Combine class and section
    const formatClassSection = (studentClass, section) =>
        studentClass && section ? `${studentClass}-${section}` : studentClass || "N/A";

    // Process vouchers and extract classes and sections
    useEffect(() => {
        if (!currentUser || currentUser.role !== "admin" || fetchRef.current || !summary) return;

        fetchRef.current = true;
        try {
            const fetchedVouchers = Array.isArray(summary) ? summary : [];
            setVouchers(fetchedVouchers);
            setFilteredVouchers(fetchedVouchers);

            // Extract unique classes and sections
            const classSet = new Set();
            const sectionSet = new Set();
            fetchedVouchers.forEach((voucher) => {
                if (voucher.student?.studentClass) {
                    classSet.add(voucher.student.studentClass.toString());
                }
                if (voucher.student?.section) {
                    sectionSet.add(voucher.student.section);
                }
            });
            const uniqueClasses = [...classSet].sort((a, b) => a - b);
            const uniqueSections = [...sectionSet].sort();
            setClasses(uniqueClasses);
            setSections(uniqueSections);
        } catch (err) {
            message.error("Failed to process vouchers");
            setVouchers([]);
            setFilteredVouchers([]);
            setClasses([]);
            setSections([]);
        } finally {
            fetchRef.current = false;
        }
    }, [currentUser, summary]);

    // Filter vouchers by month, class, and section
    useEffect(() => {
        let filtered = [...vouchers];

        if (selectedMonth) {
            filtered = filtered.filter((voucher) => voucher.month === selectedMonth);
        }

        if (selectedClass) {
            filtered = filtered.filter((voucher) =>
                voucher.student?.studentClass &&
                voucher.student.studentClass.toString() === selectedClass
            );
        }

        if (selectedSection) {
            filtered = filtered.filter((voucher) =>
                voucher.student?.section && voucher.student.section === selectedSection
            );
        }

        setFilteredVouchers(filtered);
    }, [selectedMonth, selectedClass, selectedSection, vouchers]);

    const handleMonthChange = (e) => setSelectedMonth(e.target.value);
    const handleClassChange = (e) => setSelectedClass(e.target.value);
    const handleSectionChange = (e) => setSelectedSection(e.target.value);
    const clearFilters = () => {
        setSelectedMonth("");
        setSelectedClass("");
        setSelectedSection("");
    };

    if (!currentUser || currentUser.role !== "admin") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center">
                    <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
                        Access Denied
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto font-nunito">
                        You must be an admin to view vouchers. Please contact the administration.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Currency className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">
                                Fee Voucher Records
                            </h2>
                            <p className="text-gray-500 font-nunito">
                                View and manage fee voucher records for your institute students
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {(selectedMonth || selectedClass || selectedSection) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg font-medium font-nunito transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                        <button
                            onClick={() => navigate("/admin-dashboard/create-voucher")}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium font-nunito transition-colors shadow-sm hover:shadow-md"
                        >
                            <FileText className="w-4 h-4" />
                            Create Fee Voucher
                        </button>
                    </div>
                </div>

                {/* Filters and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                    {/* Month Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Month
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                                disabled={isLoading}
                            >
                                <option value="">All Months</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Class
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                value={selectedClass}
                                onChange={handleClassChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                                disabled={isLoading}
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>
                                        Class {cls}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Section Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Section
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <BookOpen className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                value={selectedSection}
                                onChange={handleSectionChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                                disabled={isLoading}
                            >
                                <option value="">All Sections</option>
                                {sections.map((section) => (
                                    <option key={section} value={section}>
                                        Section {section}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Total Vouchers Card */}
                    <div className="flex items-end">
                        <div className="w-full bg-white p-4 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-indigo-600 mb-1 font-nunito uppercase tracking-wider">
                                        Total Vouchers
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800 font-nunito">
                                        {isLoading ? (
                                            <span className="inline-block w-16 h-8 bg-indigo-100 rounded animate-pulse" />
                                        ) : filteredVouchers.length}
                                    </p>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <FileText className="w-6 h-6 text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-gray-500 font-nunito">
                            Loading vouchers...
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
                        <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Filter className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
                            Error
                        </h3>
                        <p className="text-gray-500 font-nunito">
                            {error.message || "Failed to load vouchers. Please try again."}
                        </p>
                    </div>
                ) : filteredVouchers.length > 0 ? (
                    <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-indigo-100">
                                <thead className="bg-indigo-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[150px]">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Ticket className="w-4 h-4" />
                                                Voucher ID
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[180px]">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <AcademicCapIcon className="w-4 h-4" />
                                                Student
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                                            Class
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[100px]">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[100px]">
                                            Month
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[80px]">
                                            Year
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Calendar className="w-4 h-4" />
                                                Due Date
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[100px]">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-indigo-100">
                                    {filteredVouchers.map((voucher, index) => {
                                        const statusKey = voucher.status?.toLowerCase() === "paid" ? "paid" :
                                            voucher.status?.toLowerCase() === "unpaid" ? "unpaid" : "default";
                                        const { class: statusClass } = statusConfig[statusKey];

                                        return (
                                            <tr
                                                key={voucher._id}
                                                className={`hover:bg-indigo-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {voucher.voucherId}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800 font-nunito">
                                                    {capitalizeName(voucher.student?.name) || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {formatClassSection(voucher.student?.studentClass, voucher.student?.section)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {voucher.amount}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {voucher.month}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {voucher.year || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                                                    {formatDisplayDate(voucher.dueDate)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium font-nunito">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}
                                                        >
                                                            {capitalizeName(voucher.status)}
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
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
                        <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Filter className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
                            No Vouchers Found
                        </h3>
                        <p className="text-gray-500 font-nunito">
                            {selectedMonth || selectedClass || selectedSection
                                ? "No vouchers match your filters. Try adjusting your selections."
                                : "No fee vouchers available. Create a new voucher to get started."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherList;