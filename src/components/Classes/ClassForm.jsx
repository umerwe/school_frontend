import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateClassMutation } from '../../store/slices/adminDashboardApi';

export default function ClassForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    classTitle: '',
    section: '',
    classTeacherIdOrName: '',
  });
  const [createClass, { isLoading }] = useCreateClassMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClass(formData).unwrap();
      message.success('Class created successfully!');
      setFormData({
        classTitle: '',
        section: '',
        classTeacherIdOrName: '',
      });
      navigate('/admin-dashboard/classes');
    } catch (error) {
      console.log(error)
      const backendError = error?.message || 'Error creating class';
      message.error(backendError);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 mt-10 border border-indigo-200">
        <h2
          className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900 font-nunito"
        >
          Create New Class
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Title Select Dropdown */}
          <div className="relative z-10">
            <label htmlFor="classTitle" className="block text-sm font-medium text-gray-700 font-nunito">
              Class <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="classTitle"
                id="classTitle"
                value={formData.classTitle}
                onChange={handleChange}
                required
                className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 font-nunito"
              >
                <option value="" disabled>Select class</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {/* Down arrow icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-indigo-500"
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
          <InputField
            label="Section"
            name="section"
            type="text"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. A"
            required
          />

          {/* Class Teacher */}
          <InputField
            label="Class Teacher (ID or Name)"
            name="classTeacherIdOrName"
            type="text"
            value={formData.classTeacherIdOrName}
            onChange={handleChange}
            placeholder="e.g. pkt10011 or Ayesha Khan"
            required
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 font-nunito ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Input Field component
function InputField({ label, name, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 font-nunito">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 font-nunito"
      />
    </div>
  );
}