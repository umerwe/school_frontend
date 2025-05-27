import { useState } from 'react';
import { message } from 'antd';
import { BookOpen, User, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubmitMarksMutation } from '../../api/teacherDashboardApi';

export default function SubmitMarks() {
  const navigate = useNavigate();
  const [submitMarks, { isLoading: loading }] = useSubmitMarksMutation();
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    subject: '',
    totalMarksInput: '',
    obtainedMarksInput: '',
    assessmentType: ''
  });
  const [grade, setGrade] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateGrade = (obtained, total) => {
    if (!obtained || !total) return;

    const perc = (obtained / total) * 100;
    setPercentage(perc.toFixed(2));

    if (perc >= 90) return "A+";
    if (perc >= 80) return "A";
    if (perc >= 70) return "B";
    if (perc >= 60) return "C";
    if (perc >= 50) return "D";
    return "F";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitMarks(formData).unwrap();
      message.success(response.message);
      setFormData({
        name: '',
        rollNumber: '',
        subject: '',
        totalMarksInput: '',
        obtainedMarksInput: '',
        assessmentType: ''
      });
      setGrade(null);
      setPercentage(null);
      navigate('/teacher-dashboard/marks/all');
    } catch (error) {
      const errorMsg = error?.data?.message || 'Failed to submit marks';
      message.error(errorMsg);
    }
  };

  return (
    <div className="max-w-7xl mx-3 md:mx-8 p-3 py-6 sm:px-8 bg-white mt-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="md:h-7 md:w-7 text-indigo-600" />
        <div>
          <h1 className="sm:text-2xl text-xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Submit Marks
          </h1>
          <p className="text-sm text-gray-600 -mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Enter student details and assessment marks below.
          </p>
        </div>
      </div>
      <div className="rounded-xl shadow-sm border border-indigo-200 p-3 py-6 sm:px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Student Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                  placeholder="Enter student name"
                  required
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border pl-3"
                placeholder="Enter roll number"
                required
                style={{ fontFamily: 'Nunito, sans-serif' }}
              />
            </div>
            <div className="relative">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Subject Name
              </label>
              <select
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full appearance-none rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-10 border"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <option value="" disabled>Select subject</option>
                {['Maths', 'English', 'Urdu', 'Science', 'Socialstudies', 'Arts', 'Physics', 'Chemistry', 'Computer', 'Pakstudies', 'Islamiat'].map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 top-8">
                <svg className="h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Assessment Type
              </label>
              <select
                id="assessmentType"
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-10 border"
                required
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <option value="">Select Assessment Type</option>
                <option value="Class Test">Class Test</option>
                <option value="Monthly Test">Monthly Test</option>
                <option value="Assignment">Assignment</option>
                <option value="Mid Term Exam">Mid Term Exam</option>
                <option value="Pre-Board Exam">Pre-Board Exam</option>
                <option value="Final Term Exam">Final Term Exam</option>
                <option value="Annual Exam">Annual Exam</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 top-8">
                <svg className="h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <label htmlFor="totalMarksInput" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Total Marks
              </label>
              <input
                type="number"
                id="totalMarksInput"
                name="totalMarksInput"
                value={formData.totalMarksInput}
                onChange={(e) => {
                  handleChange(e);
                  const grade = calculateGrade(parseFloat(formData.obtainedMarksInput), parseFloat(e.target.value));
                  setGrade(grade);
                }}
                className="w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border pl-3"
                placeholder="Enter total marks"
                min="1"
                required
                style={{ fontFamily: 'Nunito, sans-serif' }}
              />
            </div>
            <div>
              <label htmlFor="obtainedMarksInput" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Obtained Marks
              </label>
              <input
                type="number"
                id="obtainedMarksInput"
                name="obtainedMarksInput"
                value={formData.obtainedMarksInput}
                onChange={(e) => {
                  handleChange(e);
                  const grade = calculateGrade(parseFloat(e.target.value), parseFloat(formData.totalMarksInput));
                  setGrade(grade);
                }}
                className="w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border pl-3"
                placeholder="Enter obtained marks"
                min="0"
                max={formData.totalMarksInput || ''}
                required
                style={{ fontFamily: 'Nunito, sans-serif' }}
              />
            </div>
          </div>
          {(grade || percentage) && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Grade Preview
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Nunito, sans-serif' }}>Percentage</p>
                      <p className="text-lg font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>{percentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Nunito, sans-serif' }}>Grade</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-semibold ${grade === 'A+' ? 'text-green-600' :
                            grade === 'A' ? 'text-green-500' :
                              grade === 'B' ? 'text-blue-500' :
                                grade === 'C' ? 'text-yellow-500' :
                                  grade === 'D' ? 'text-orange-500' :
                                    'text-red-500'}`}
                          style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                          {grade}
                        </span>
                        {grade !== 'F' ? (
                          <CheckCircle className="h-5 w-5 text-indigo-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium ${loading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-600'} transition-colors`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loading ? 'Submitting...' : 'Submit Marks'}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h3 className="text-sm font-medium text-indigo-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Note to Teachers
        </h3>
        <p className="text-xs text-indigo-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Please ensure all information is accurate before submission. Only the class teacher can submit marks for their assigned class.
        </p>
      </div>
    </div>
  );
}