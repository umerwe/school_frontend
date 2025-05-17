import React, { useState, useEffect } from "react";
import {
  BookOpen,
  User,
  Loader2,
  Trash2,
  Pencil,
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

        console.log("Deleting subject, subjectId:", id); // Debug

        try {
          const response = await deleteSubject(id).unwrap();
          console.log("Delete subject response:", response); // Debug
          message.success({
            content: "Subject deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (error) {
          console.error("Delete subject error:", error); // Debug
          const backendError = error?.data?.message || "Failed to delete subject";
          message.error({ content: backendError, key: messageKey, duration: 3 });
        }
      },
      onCancel: () => {
        message.info("Subject deletion cancelled");
      },
    });
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
            Access Denied
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-nunito">
            You must be an admin to view subjects. Please contact the administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:pl-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Subject Management
              </h1>
              <p className="text-sm text-gray-500 font-nunito">
                View and manage all subjects
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full md:w-36 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none pr-8 font-nunito text-sm"
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
            <div className="relative">
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full md:w-36 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none pr-8 font-nunito text-sm"
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
            <button
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium font-nunito text-sm transition-colors shadow-sm hover:shadow-md"
              onClick={() => navigate("/admin-dashboard/subjects/new")}
            >
              + Create Subject
            </button>
          </div>
        </div>

        {/* Subjects Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading subjects...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error?.data?.message || "Failed to load subjects. Please try again."}
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Subjects Found
            </h3>
            <p className="text-gray-500 font-nunito">
              There are currently no subjects matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-6 border-b border-indigo-200">
              <h2 className="text-lg font-semibold text-gray-900 font-nunito">
                Subjects List
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-nunito">
                All subjects with their respective classes and teachers
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-200">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-indigo-500" />
                          <span className="ml-2 font-medium text-gray-900 font-nunito">
                            {capitalizeWords(subject.subjectName)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 font-nunito">
                          Class {subject.classTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-nunito">
                        Section {subject.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subject.subjectTeacher?.name ? (
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="ml-2 text-gray-900 font-nunito">
                              {capitalizeWords(subject.subjectTeacher.name)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic font-nunito">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin-dashboard/subjects/${subject._id}/edit`)}
                          className="text-indigo-500 hover:text-indigo-600 p-1 mr-2"
                          disabled={isDeleting}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
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