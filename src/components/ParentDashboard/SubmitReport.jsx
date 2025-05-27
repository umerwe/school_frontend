import { useState } from 'react';
import { message } from 'antd';
import { FileText, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useSubmitParentReportMutation } from '../../api/parentDashboardApi';

const SubmitReport = () => {
  const user = useSelector((store) => store.userSlice.user);
  const children = user?.childrens || [];

  const [formData, setFormData] = useState({
    studentId: '',
    reportType: 'academic',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitParentReport, { isLoading: submitting }] = useSubmitParentReportMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.studentId) errors.studentId = 'Please select a student';
    if (!formData.description.trim()) errors.description = 'Please enter a description';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submitParentReport(formData).unwrap();
      setFormData({ studentId: '', reportType: 'academic', description: '' });
      message.success({
        content: 'Report submitted successfully!',
        duration: 2,
        className: 'mt-4'
      });
    } catch (err) {
      const errorMessage = err.data?.message || 'Failed to submit report.';
      message.error({
        content: errorMessage,
        duration: 3,
        className: 'mt-4'
      });
    }
  };

  const capitalizeName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "";

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-md sm:rounded-lg backdrop-blur-sm">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Submit Parent Report</h1>
                <p className="text-indigo-100 text-xs sm:text-sm">
                  Submit concerns or feedback about your child's school experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Student Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Select Child <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className={`w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 pr-8 rounded-md sm:rounded-lg border ${
                    formErrors.studentId ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white`}
                >
                  <option value="">Select your child</option>
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {capitalizeName(child.name)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                  <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
              {formErrors.studentId && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.studentId}</p>
              )}
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Report Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, reportType: 'academic' })}
                  className={`text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border ${
                    formData.reportType === 'academic'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300'
                  } transition-colors`}
                >
                  Academic
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, reportType: 'behavioral' })}
                  className={`text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border ${
                    formData.reportType === 'behavioral'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300'
                  } transition-colors`}
                >
                  Behavioral
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, reportType: 'other' })}
                  className={`text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border ${
                    formData.reportType === 'other'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300'
                  } transition-colors`}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border ${
                  formErrors.description ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Please describe your concern in detail..."
              />
              {formErrors.description && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.description}</p>
              )}
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Be as specific as possible to help us address your concern effectively.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md sm:rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitReport;