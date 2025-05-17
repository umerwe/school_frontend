import { useState } from 'react';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateSubjectMutation } from '../../store/slices/adminDashboardApi';
import { Loader2 } from 'lucide-react';

export default function EditSubject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

  const [formData, setFormData] = useState({
    subjectName: '',
    teacherName: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate subject ID (MongoDB ObjectId: 24-character hexadecimal)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      message.error('Invalid subject ID');
      return;
    }

    const messageKey = `updateSubject-${id}`;
    message.loading({ content: 'Updating subject...', key: messageKey });

    console.log('Submitting update with subjectId:', id, 'formData:', formData); // Debug

    try {
      const response = await updateSubject({ subjectId: id, formData }).unwrap();
      console.log('Update subject response:', response); // Debug
      message.success({
        content: 'Subject updated successfully!',
        key: messageKey,
      });
      setFormData({ subjectName: '', teacherName: '' });
      navigate('/admin-dashboard/subjects');
    } catch (error) {
      console.error('Update subject error:', error); // Debug
      const errMsg = error?.data?.message || 'Error updating subject';
      message.error({ content: errMsg, key: messageKey });
    }
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white shadow-sm rounded-lg p-8 mt-10 border border-indigo-200">
      <h2
        className="text-2xl font-semibold mb-6 text-gray-900"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        Update Subject
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Name */}
        <div className="relative">
          <select
            name="subjectName"
            id="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <option value="" disabled>
              Select subject
            </option>
            {[
              'Maths',
              'English',
              'Urdu',
              'Science',
              'Socialstudies',
              'Arts',
              'Physics',
              'Chemistry',
              'Computer',
              'Pakstudies',
              'Islamiat',
            ].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {/* Down arrow icon */}
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

        {/* Teacher Name */}
        <div>
          <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">
            Teacher Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="teacherName"
            id="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            placeholder="e.g. Ayesha Khan"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </span>
            ) : (
              'Update Subject'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}