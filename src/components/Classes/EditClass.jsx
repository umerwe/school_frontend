import { useState } from 'react';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateClassMutation } from '../../store/slices/adminDashboardApi';
import { Loader2 } from 'lucide-react';

export default function EditClass() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();

  const [formData, setFormData] = useState({
    classTeacherIdOrName: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate class ID (MongoDB ObjectId format: 24-character hexadecimal)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      message.error('Invalid class ID');
      return;
    }

    const messageKey = `updateClass-${id}`;
    message.loading({ content: 'Updating class teacher...', key: messageKey });

    console.log('Submitting update with classId:', id, 'formData:', formData); // Debug log

    try {
      const response = await updateClass({ classId: id, formData }).unwrap();
      console.log('Update class response:', response); // Debug log
      message.success({
        content: 'Class teacher updated successfully!',
        key: messageKey,
      });
      setFormData({ classTeacherIdOrName: '' });
      navigate('/admin-dashboard/classes');
    } catch (error) {
      console.error('Update class error:', error); // Debug log
      const errMsg = error?.data?.message || 'Error updating class teacher';
      message.error({ content: errMsg, key: messageKey });
    }
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white shadow-sm rounded-lg p-8 mt-10 border border-indigo-200">
      <h2
        className="text-[22px] font-semibold mb-6 text-gray-900"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        Update Class Teacher
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="classTeacherIdOrName" className="block text-sm font-medium text-gray-700">
            Teacher ID / Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="classTeacherIdOrName"
            id="classTeacherIdOrName"
            value={formData.classTeacherIdOrName}
            onChange={handleChange}
            placeholder="e.g. 102ayt or Ahsan"
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
              'Update'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}