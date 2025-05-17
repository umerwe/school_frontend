import { message, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { BookOpen, User, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery, useDeleteMarksMutation } from "../../store/slices/teacherDashboardApi";

export default function AllMarks() {
  const user = useSelector(store => store.userSlice.user);
  const { data: dashboardData, isLoading: loading, error } = useGetDashboardSummaryQuery();
  const [deleteMarks] = useDeleteMarksMutation();
  const [filterType, setFilterType] = useState('');
  const didFetchRef = useRef(false);

  // Extract marks from dashboard data or default to empty array
  const marks = dashboardData?.classMarks || [];

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    if (error && !loading) {
      const backendError = error?.data?.message || 'Error Fetching Marks';
      message.error(backendError);
    }
  }, [error, loading]);

  const handleDelete = async (recordId) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will permanently delete the marks record.',
      okText: 'Yes',
      cancelText: 'No',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          await deleteMarks(recordId).unwrap();
          message.success('Marks record deleted successfully');
        } catch (error) {
          const backendError = error?.data?.message || 'Error deleting marks';
          message.error(backendError);
        }
      },
      onCancel: () => {
        message.info("Marks deletion cancelled");
      },
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-50 text-green-700';
      case 'B': return 'bg-blue-50 text-blue-700';
      case 'C': return 'bg-yellow-50 text-yellow-700';
      case 'D': return 'bg-orange-50 text-orange-700';
      case 'F': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const capitalizeName = (name) => {
    return name?.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') || '';
  };

  const filteredMarks = filterType
    ? marks.filter((mark) => mark.assessmentType === filterType)
    : marks;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Students Marks Records</h1>
          <p className="mt-2 text-sm text-gray-600">All submitted marks with student details and grades</p>
        </div>
        <div>
          <Select
            value={filterType}
            onChange={setFilterType}
            className="w-48"
            placeholder="Select Assessment Type"
          >
            <option value="">All</option>
            <option value="Class Test">Class Test</option>
            <option value="Monthly Test">Monthly Test</option>
            <option value="Assignment">Assignment</option>
            <option value="Mid Term Exam">Mid Term Exam</option>
            <option value="Pre-Board Exam">Pre-Board Exam</option>
            <option value="Final Term Exam">Final Term Exam</option>
            <option value="Annual Exam">Annual Exam</option>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredMarks.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center mt-6">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Marks Records Found</h3>
          <p className="text-gray-500">No marks have been submitted yet.</p>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-gray-200 ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          Student
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                          Subject
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assessment Type</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Marks</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teacher</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredMarks.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{capitalizeName(record.student?.name)}</div>
                              <div className="text-gray-500">Roll: {record.student?.rollNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>Grade {record.classTitle}</span>
                            <span className="text-gray-300">•</span>
                            <span>Sec {record.section}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                            {capitalizeName(record.subject)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{capitalizeName(record.assessmentType)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium">{record.obtainedMarks}</span>
                            <span className="text-gray-400">/</span>
                            <span>{record.totalMarks}</span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(record.grade)}`}>
                              {record.grade}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {capitalizeName(record.subjectTeacher?.name) || (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button onClick={() => handleDelete(record._id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}