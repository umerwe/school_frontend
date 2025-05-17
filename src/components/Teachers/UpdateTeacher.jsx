import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { User } from "lucide-react";
import { message } from "antd";
import { useUpdateTeacherMutation } from "../../store/slices/adminDashboardApi";

export default function UpdateTeacher() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const teacher = state?.teacher;

  const [updateTeacher, { isLoading: submitting }] = useUpdateTeacherMutation();

  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    teacherId: teacher?.teacherId || "",
    phoneNumber: teacher?.phoneNumber || "",
    address: teacher?.address || "",
    department: teacher?.department || "",
    role: teacher?.role || "",
    nationality: teacher?.nationality || "",
    bloodGroup: teacher?.bloodGroup || "",
    dateOfBirth: teacher?.dateOfBirth
      ? new Date(teacher.dateOfBirth).toISOString().split("T")[0]
      : "",
    emergencyContact: teacher?.emergencyContact || "",
    qualifications: teacher?.qualifications?.join(", ") || "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(teacher?.logo || "");
  const [errors, setErrors] = useState({});

  // Redirect if no teacher data
  if (!teacher) {
    message.error("No teacher data provided");
    navigate("/admin-dashboard/teachers");
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.teacherId) newErrors.teacherId = "Teacher ID is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    } else {
      setLogoFile(null);
      setLogoPreview(teacher.logo || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      message.error("Please fill all required fields correctly");
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("teacherId", formData.teacherId);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("role", formData.role);
      if (formData.address) formDataToSend.append("address", formData.address);
      if (formData.nationality) formDataToSend.append("nationality", formData.nationality);
      if (formData.bloodGroup) formDataToSend.append("bloodGroup", formData.bloodGroup);
      if (formData.dateOfBirth) formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      if (formData.emergencyContact) formDataToSend.append("emergencyContact", formData.emergencyContact);
      if (formData.qualifications) formDataToSend.append("qualifications", formData.qualifications);
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      await updateTeacher({ teacherId: teacher._id, formData: formDataToSend }).unwrap();
      message.success("Teacher updated successfully");
      navigate("/admin-dashboard/teachers");
    } catch (error) {
      message.error(error?.data?.message || "Error updating teacher");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin-dashboard/teachers")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Back to Teachers</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Update Teacher Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
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

            {/* Main Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ayesha Khan"
                    required
                    className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Teacher ID */}
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="teacherId"
                    id="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    placeholder="e.g. TEA-2023-001"
                    required
                    className={`w-full rounded-lg border ${errors.teacherId ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.teacherId && (
                    <p className="mt-1 text-sm text-red-600">{errors.teacherId}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                    className={`w-full rounded-lg border ${errors.department ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. teacher@school.edu"
                    required
                    className={`w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 03001234567"
                    required
                    className={`w-full rounded-lg border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Senior Lecturer"
                    required
                    className={`w-full rounded-lg border ${errors.role ? "border-red-500" : "border-gray-300"} px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200`}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="e.g. Pakistani"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full residential address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 appearance-none bg-white"
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Qualifications */}
              <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <input
                  type="text"
                  name="qualifications"
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  placeholder="e.g. M.Sc Computer Science, B.Ed"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="e.g. 03009876543"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Teacher Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}