import { message, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { BookOpen, User, Trash2, Filter, ChevronDown, FileText, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery, useDeleteMarksMutation } from "../../api/teacherDashboardApi";
import { useNavigate } from "react-router-dom";

export default function AllMarks() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useGetDashboardSummaryQuery();
  const [deleteMarks] = useDeleteMarksMutation();
  const [filterType, setFilterType] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const didFetchRef = useRef(false);

  // Extract marks from dashboard data or default to empty array
  const marks = dashboardData?.classMarks || [];

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    if (error && !isLoading) {
      const backendError = error?.data?.message || 'Error Fetching Marks';
      message.error(backendError);
    }

    // Extract unique classes and sections
    const classSet = new Set();
    const sectionSet = new Set();
    marks.forEach((mark) => {
      if (mark.classTitle) {
        classSet.add(mark.classTitle.toString());
      }
      if (mark.section) {
        sectionSet.add(mark.section);
      }
    });
    setClasses([...classSet].sort());
    setSections([...sectionSet].sort());
  }, [error, isLoading, marks]);

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
      case 'A+': return 'bg-green-100 text-green-800 border-green-200';
      case 'A': return 'bg-green-50 text-green-700 border-green-100';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'C': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'F': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const capitalizeName = (name) => {
    return name?.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') || '';
  };

  const clearFilters = () => {
    setFilterType('');
    setSelectedClass('');
    setSelectedSection('');
  };

  const filteredMarks = marks.filter((mark) => {
    return (
      (!filterType || mark.assessmentType === filterType) &&
      (!selectedClass || mark.classTitle === selectedClass) &&
      (!selectedSection || mark.section === selectedSection)
    );
  });

  const assessmentTypes = [
    "Class Test",
    "Monthly Test",
    "Assignment",
    "Mid Term Exam",
    "Pre-Board Exam",
    "Final Term Exam",
    "Annual Exam"
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 mb-1 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="md:w-7 md:h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Students Marks Records
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-nunito">
                All submitted marks with student details and grades
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {(filterType || selectedClass || selectedSection) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg font-medium font-nunito transition-colors"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </button>
            )}
            <button
              onClick={() => navigate("/teacher-dashboard/add-marks")}
              className="flex text-sm md:text-md items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium font-nunito transition-colors shadow-sm hover:shadow-md"
            >
              <FileText className="w-4 h-4" />
              Submit Marks
            </button>
          </div>
        </div>

        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Assessment Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
              Assessment Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full text-sm md:text-md pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                disabled={isLoading}
              >
                <option value="">All Types</option>
                {assessmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
              Class
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-sm md:text-md pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                disabled={isLoading}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
              Section
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full text-sm md:text-md pl-10 pr-10 py-2.5 border border-indigo-200 rounded-lg bg-white text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-nunito hover:bg-indigo-50 transition-colors"
                disabled={isLoading}
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Total Records Card */}
          <div className="flex items-end">
            <div className="w-full bg-white p-4 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 mb-1 font-nunito uppercase tracking-wider">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-gray-800 font-nunito">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-indigo-100 rounded animate-pulse" />
                    ) : filteredMarks.length}
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">
              Loading marks records...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Filter className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error.message || "Failed to load marks records. Please try again."}
            </p>
          </div>
        ) : filteredMarks.length > 0 ? (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[180px]">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[100px]">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <BookOpen className="w-4 h-4" />
                        Subject
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[140px]">
                      Assessment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      Marks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[120px]">
                      Teacher
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito min-w-[80px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {filteredMarks.map((record, index) => (
                    <tr
                      key={record._id}
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {capitalizeName(record.student?.name)}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Roll: {record.student?.rollNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {record.classTitle ? `Grade ${record.classTitle}` : 'N/A'}
                        {record.section && (
                          <span className="text-gray-400 ml-1">• Sec {record.section}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(record.subject) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(record.assessmentType) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm font-nunito">
                        <div className="flex items-baseline gap-1">
                          <span className="font-medium text-gray-800">{record.obtainedMarks}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-500">{record.totalMarks}</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getGradeColor(record.grade)}`}>
                            {record.grade || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-nunito">
                        {capitalizeName(record.subjectTeacher?.name) || (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-center font-nunito">
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Filter className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Marks Found
            </h3>
            <p className="text-gray-500 font-nunito">
              {filterType || selectedClass || selectedSection
                ? "No marks match your filters. Try adjusting your selections."
                : "No marks records available. Add new marks to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}