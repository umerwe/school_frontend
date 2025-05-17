import React, { useState } from "react";
import { Loader2, Ticket, Calendar, DollarSign, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useGenerateVoucherMutation } from '../../store/slices/adminDashboardApi';

const CreateVoucher = () => {
    const currentUser = useSelector((store) => store.userSlice.user);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentClass: "",
        section: "",
        amount: "",
        month: "",
        year: new Date().getFullYear().toString(),
        dueDate: "",
    });
    const [errors, setErrors] = useState({});
    const [generateVoucher, { isLoading }] = useGenerateVoucherMutation();

    // Predefined options
    const classes = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const sections = ["A", "B", "C"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString());

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.studentClass) newErrors.studentClass = "Class is required";
        if (!formData.section) newErrors.section = "Section is required";
        if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required";
        if (!formData.month) newErrors.month = "Month is required";
        if (!formData.year) newErrors.year = "Year is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await generateVoucher(formData).unwrap();
            message.success("Vouchers generated successfully!");
            setFormData({
                studentClass: "",
                section: "",
                amount: "",
                month: "",
                year: new Date().getFullYear().toString(),
                dueDate: "",
            });
            navigate('/admin-dashboard/vouchers');
        } catch (error) {
            const errorMessage = error?.data?.message || "Failed to generate vouchers";
            message.error(errorMessage);
        }
    };

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];

    if (!currentUser || currentUser.role !== "admin") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
                    <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
                        Access Denied
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto font-nunito">
                        You must be an admin to generate vouchers. Please contact the administration.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">
                            Create Vouchers
                        </h2>
                        <p className="text-indigo-600 font-medium flex items-center gap-1 font-nunito">
                            <Ticket className="w-4 h-4" />
                            Generate vouchers for students
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Class */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Class
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                name="studentClass"
                                value={formData.studentClass}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                disabled={isLoading}
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>
                                        Class {cls}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                            {errors.studentClass && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.studentClass}</p>
                            )}
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Section
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                disabled={isLoading}
                            >
                                <option value="">Select Section</option>
                                {sections.map((sec) => (
                                    <option key={sec} value={sec}>
                                        Section {sec}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                            {errors.section && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.section}</p>
                            )}
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <DollarSign className="w-5 h-5 text-indigo-500" />
                            </div>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="1"
                                className="w-full pl-10 pr-3 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                placeholder="Enter amount"
                                disabled={isLoading}
                            />
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.amount}</p>
                            )}
                        </div>
                    </div>

                    {/* Month */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Month
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                disabled={isLoading}
                            >
                                <option value="">Select Month</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                            {errors.month && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.month}</p>
                            )}
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Year
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                            </div>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                disabled={isLoading}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.year}</p>
                            )}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                            Due Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                            </div>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                min={formatDate(new Date())}
                                className="w-full pl-10 pr-3 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito"
                                disabled={isLoading}
                            />
                            {errors.dueDate && (
                                <p className="mt-1 text-sm text-red-600 font-nunito">{errors.dueDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 font-nunito font-medium flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Ticket className="w-5 h-5" />
                                    Generate Vouchers
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVoucher;