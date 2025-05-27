import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeIcon, User } from "lucide-react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import {useCreateStudentMutation} from '../../api/adminDashboardApi'

export default function StudentForm() {
    const navigate = useNavigate();
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        nationality: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

const [createStudent] = useCreateStudentMutation();

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);
        const formDataToSend = new FormData();

        // Append all form data
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append logo file
        if (logoFile) {
            formDataToSend.append("logo", logoFile);
        }

        await createStudent(formDataToSend).unwrap();

        message.success("Student created successfully!");
        resetForm();
        navigate('/admin-dashboard/students');
    } catch (error) {
        const backendError = error?.data?.message || error.message || 'Error creating student';
        message.error(backendError);
    } finally {
        setLoading(false);
    }
};

    const resetForm = () => {
        setFormData({
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
            nationality: ""
        });
        setLogoFile(null);
        setLogoPreview("");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8 mt-10 border border-indigo-200">
            <h2
                className="text-2xl font-semibold mb-6 text-gray-900"
                style={{ fontFamily: 'Nunito, sans-serif' }}
            >
                Create New Student
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Student Info */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Ali Ahmed"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Roll Number */}
                        <div>
                            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                                Roll Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="rollNumber"
                                id="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 2023-001"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity- Functionality unchanged50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="e.g. student@school.edu"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-8.5 right-0 flex items-center px-3 text-gray-600"
                                tabIndex={-1}
                            >
                                {!showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                                Profile Picture <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex items-center">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        id="logo"
                                        name="logo"
                                        onChange={handleLogoChange}
                                        accept="image/*"
                                        className="sr-only"
                                        required
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-gray-600">
                                                    <User className="w-8 h-8" />
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className="px-3 py-1.5 border border-indigo-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-50"
                                            style={{ fontFamily: 'Nunito, sans-serif' }}
                                        >
                                            Choose File
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Academic Info */}
                    <div className="space-y-4">
                        {/* Class */}
                        <div className="relative z-10">
                            <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">
                                Class <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="studentClass"
                                    id="studentClass"
                                    value={formData.studentClass}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                    style={{ fontFamily: 'Nunito, sans-serif' }}
                                >
                                    <option value="" disabled>Select class</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg
                                        className="h-4 w-4 text-gray-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Section */}
                        <div>
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                                Section <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="section"
                                id="section"
                                value={formData.section}
                                onChange={handleChange}
                                required
                                placeholder="e.g. A"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Admission Year */}
                        <div>
                            <label htmlFor="admissionYear" className="block text-sm font-medium text-gray-700">
                                Admission Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="admissionYear"
                                id="admissionYear"
                                value={formData.admissionYear}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 2023"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>

                        {/* Nationality */}
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                                Nationality <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                id="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Pakistani"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Middle Row - Guardian Info */}
                <div className="grid grid-cols-1 pt-2 w-full">
                    {/* Guardian's Information */}
                    <div className="space-y-4 border p-4 rounded-lg bg-indigo-50 border-indigo-200">
                        <h3
                            className="font-medium text-gray-900"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                            Guardian's Information
                        </h3>
                        <div className="flex gap-10">
                            <div className="w-[48%]">
                                <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">
                                    Guardian's Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="guardianName"
                                    id="guardianName"
                                    value={formData.guardianName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Guardian's full name"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                    style={{ fontFamily: 'Nunito, sans-serif' }}
                                />
                            </div>
                            <div className="w-[48%]">
                                <label htmlFor="guardianEmail" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="guardianEmail"
                                    id="guardianEmail"
                                    value={formData.guardianEmail}
                                    onChange={handleChange}
                                    placeholder="Guardian's email"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                    style={{ fontFamily: 'Nunito, sans-serif' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Full residential address"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                            Emergency Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="emergencyContact"
                            id="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 03001234567"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        />
                    </div>

                    {/* Blood Group */}
                    <div className="relative z-10">
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                            Blood Group
                        </label>
                        <div className="relative">
                            <select
                                name="bloodGroup"
                                id="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg
                                    className="h-4 w-4 text-gray-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""} flex justify-center`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Create Student'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}