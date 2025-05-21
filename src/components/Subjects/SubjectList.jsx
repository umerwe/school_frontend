import React, { useState, useEffect } from "react";
import {
  BookOpen,
  User,
  Loader2,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery, useDeleteSubjectMutation } from "../../store/slices/adminDashboardApi";

const capitalizeWords = (str) =>
  str
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function SubjectList() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);

  const { data: subjectsData, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => ({
      data: data?.subjects || [],
      isLoading,
      error,
    }),
  });

  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const [subjects, setSubjects] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);

  useEffect(() => {
    if (subjectsData) {
      setSubjects(subjectsData);
      const classes = [...new Set(subjectsData.map(subject => subject.classTitle))].sort((a, b) => a - b);
      const sections = [...new Set(subjectsData.map(subject => subject.section))].sort();
      setAvailableClasses(classes);
      setAvailableSections(sections);
    }
  }, [subjectsData]);

  const filteredSubjects = subjects.filter(subject =>
    (filterClass === "" || subject.classTitle === Number(filterClass)) &&
    (filterSection === "" || subject.section === filterSection)
  );

  const handleDelete = (id) => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      message.error("Invalid subject ID");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the subject.",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const messageKey = `deleteSubject-${id}`;
        message.loading({ content: "Deleting subject...", key: messageKey });

        try {
          const response = await deleteSubject(id).unwrap();
          message.success({
            content: "Subject deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (error) {
          const backendError = error?.data?.message || "Failed to delete subject";
          message.error({ content: backendError, key: messageKey, duration: 3 });
        }
      },
      onCancel: () => {
        message.info("Subject deletion cancelled");
      },
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
          <div className="flex gap-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Subjects
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-nunito">
                View and manage all subjects
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
           <div className="flex gap-3">
             <div className="relative w-full sm:w-36">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none pr-8 font-nunito text-xs sm:text-sm"
              >
                <option value="">All Classes</option>
                {availableClasses.map((classTitle) => (
                  <option key={classTitle} value={classTitle}>
                    Class {classTitle}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-3 w-3 text-indigo-500"
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
            <div className="relative w-full sm:w-36">
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none pr-8 font-nunito text-xs sm:text-sm"
              >
                <option value="">All Sections</option>
                {availableSections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-3 w-3 text-indigo-500"
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
            <button
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto font-medium text-xs sm:text-sm font-nunito shadow-sm hover:shadow-md"
              onClick={() => navigate("/admin-dashboard/subjects/new")}
            >
              <Plus className="w-4 h-4" />
              Create Subject
            </button>
          </div>
        </div>

        {/* Subjects Display */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito text-sm sm:text-base">Loading subjects...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 text-center">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito text-sm sm:text-base">
              {error?.data?.message || "Failed to load subjects. Please try again."}
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 sm:p-8 text-center">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Subjects Found
            </h3>
            <p className="text-gray-500 font-nunito text-sm sm:text-base">
              There are currently no subjects matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-indigo-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 font-nunito">
                Subjects List
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-nunito">
                All subjects with their respective classes and teachers
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full divide-y divide-indigo-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Subject
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Class
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Section
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Teacher
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-200">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="hover:bg-indigo-50">
                      <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BookOpen className="h-3 sm:h-4 w-3 sm:w-4 text-indigo-500" />
                          <span className="ml-2 font-medium text-gray-900 font-nunito text-xs sm:text-sm">
                            {capitalizeWords(subject.subjectName)}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 font-nunito">
                          Class {subject.classTitle}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 font-nunito text-xs sm:text-sm">
                        Section {subject.section}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {subject.subjectTeacher?.name ? (
                          <div className="flex items-center">
                            <User className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                            <span className="ml-2 text-gray-900 font-nunito text-xs sm:text-sm">
                              {capitalizeWords(subject.subjectTeacher.name)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic font-nunito text-xs sm:text-sm">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin-dashboard/subjects/${subject._id}/edit`)}
                          className="text-indigo-500 hover:text-indigo-600 p-1 mr-1 sm:mr-2"
                          disabled={isDeleting}
                        >
                          <Pencil className="h-3 sm:h-4 w-3 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}