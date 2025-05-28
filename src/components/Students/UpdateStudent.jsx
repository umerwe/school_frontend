import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { User } from "lucide-react";
import { message } from "antd";
import {
    useGetDashboardSummaryQuery,
    useUpdateStudentMutation
} from '../../api/adminDashboardApi';

export default function UpdateStudent() {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        rollNumber: "",
        email: "",
        password: "",
        guardianName: "",
        guardianEmail: "",
        studentClass: "",
        section: "",
        admissionYear: "",
        dateOfBirth: "",
        address: "",
        emergencyContact: "",
        bloodGroup: "",
        nationality: "",
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    // RTK Query hooks
    const { data: dashboardData, isLoading, isError } = useGetDashboardSummaryQuery();
    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

    useEffect(() => {
        if (dashboardData?.students) {
            const student = dashboardData.students.find(s => s._id === studentId);
            if (student) {
                setFormData({
                    name: student.name || "",
                    rollNumber: student.rollNumber || "",
                    email: student.email || "",
                    password: "", // Password typically not fetched for security
                    guardianName: student.guardianName || "",
                    guardianEmail: student.guardianEmail || "",
                    studentClass: student.studentClass || "",
                    section: student.section || "",
                    admissionYear: student.admissionYear || "",
                    dateOfBirth: student.dateOfBirth
                        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
                        : "",
                    address: student.address || "",
                    emergencyContact: student.emergencyContact || "",
                    bloodGroup: student.bloodGroup || "",
                    nationality: student.nationality || "",
                });
                setLogoPreview(student.logo || "");
            } else {
                message.error("Student not found");
                navigate("/admin-dashboard/students");
            }
        }
    }, [dashboardData, studentId, navigate]);
    
    if (isError) {
        message.error("Error fetching student data");
        navigate("/admin-dashboard/students");
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setLogoFile(null);
            setLogoPreview("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            if (logoFile) formDataToSend.append("logo", logoFile);

            await updateStudent({
                studentId,
                formData: formDataToSend
            }).unwrap();

            message.success("Student updated successfully");
            navigate("/admin-dashboard/students");
        } catch (error) {
            message.error(error?.data?.message || "Error updating student");
        }
    };

    return (
        <div className="py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate("/admin-dashboard/students")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Students
                </button>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Student</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-gray-400" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="logo"
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full transition-opacity duration-200 cursor-pointer"
                                    >
                                        <span className="text-white text-sm font-medium">Change Photo</span>
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    name="logo"
                                    id="logo"
                                    onChange={handleLogoChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <p className="mt-2 text-sm text-gray-500">Click on the photo to change</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                    {/* Roll Number */}
                                    <div>
                                        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            id="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                            placeholder="Enter new password (optional)"
                                        />
                                    </div>
                                    {/* Guardian Name */}
                                    <div>
                                        <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                                        <input
                                            type="text"
                                            name="guardianName"
                                            id="guardianName"
                                            value={formData.guardianName}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Class & Section */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                            <input
                                                type="number"
                                                name="studentClass"
                                                id="studentClass"
                                                value={formData.studentClass}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                            <input
                                                type="text"
                                                name="section"
                                                id="section"
                                                value={formData.section}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                            />
                                        </div>
                                    </div>
                                    {/* Guardian Email */}
                                    <div>
                                        <label htmlFor="guardianEmail" className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
                                        <input
                                            type="email"
                                            name="guardianEmail"
                                            id="guardianEmail"
                                            value={formData.guardianEmail}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                    {/* Admission Year */}
                                    <div>
                                        <label htmlFor="admissionYear" className="block text-sm font-medium text-gray-700 mb-1">Admission Year</label>
                                        <input
                                            type="number"
                                            name="admissionYear"
                                            id="admissionYear"
                                            value={formData.admissionYear}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                    {/* Date of Birth */}
                                    <div>
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            id="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Fields - Full width */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    />
                                </div>
                                {/* Emergency Contact */}
                                <div>
                                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        id="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Blood Group */}
                                <div>
                                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <input
                                        type="text"
                                        name="bloodGroup"
                                        id="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    />
                                </div>
                                {/* Nationality */}
                                <div>
                                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        id="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || isUpdating}
                                    className="w-full md:w-auto md:px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        "Update Student"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}