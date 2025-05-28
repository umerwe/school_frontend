import React, { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import { useChangePasswordMutation } from "../../api/adminDashboardApi";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "";

export default function ChangeParentPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parent = state?.parent;

  // Redirect if no parent data
  if (!parent) {
    message.error("No parent data provided");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        <div
          className="text-red-600 mb-6 text-lg text-center font-nunito"
        >
          No parent data found.
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/parents")}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-nunito text-sm"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Parents
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassword, { isLoading: isSubmitting }] = useChangePasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.oldPassword || !formData.newPassword) {
      message.error("Both old and new password are required");
      return false;
    }
    if (
      formData.newPassword.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(
        formData.newPassword
      )
    ) {
      message.error(
        "New password must be at least 8 characters long and contain a mix of letters, numbers, and special characters"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const messageKey = "changeParentPassword";

    try {
      const response = await changePassword({
        id: parent._id,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        role: parent.role || "parent",
      }).unwrap();
      message.success({
        content: response.message || "Password changed successfully",
        key: messageKey,
        duration: 2,
      });
      setFormData({ oldPassword: "", newPassword: "" });
      navigate(`/admin-dashboard/parents`);
    } catch (error) {
      const errorMessage = error.data?.message || "Failed to change password";
      message.error({ content: errorMessage, key: messageKey, duration: 3 });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 mt-2">
      <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 mb-1 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Lock className="md:h-8 md:w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Change Parent Password
              </h2>
              <p className="text-sm md:text-base text-gray-500 font-nunito">
                Update password for {capitalizeName(parent.name)}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 font-nunito mb-2"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-nunito text-sm"
                  placeholder="Enter old password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {!showOldPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 font-nunito mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-nunito text-sm"
                  placeholder="Enter new password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium font-nunito text-[14px] sm:text-sm shadow-sm hover:shadow-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}