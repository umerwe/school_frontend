import React, { useState } from "react";
import {
  BookOpen,
  User,
  Users,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { message, notification, Modal } from "antd";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery, useDeleteClassMutation } from "../../api/adminDashboardApi";
import { store } from "../../store/store";
import { adminDashboardApi } from "../../api/adminDashboardApi";

const capitalizeName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function ClassList() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);
  const { data: summary, isLoading, error } = useGetDashboardSummaryQuery();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();
  const [expandedClass, setExpandedClass] = useState(null);

  const classes = Array.isArray(summary?.classes) ? summary.classes : [];

  const toggleExpand = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleDelete = (classId, classItem) => {
    if (!/^[0-9a-fA-F]{24}$/.test(classId)) {
      message.error("Invalid class ID");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the class.",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const messageKey = `deleteClass-${classId}`;
        message.loading({ content: "Deleting class...", key: messageKey });

        try {
          await deleteClass(classId).unwrap();
          message.success({
            content: "Class deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (err) {
          const errMsg = err?.data?.message || "Failed to delete class";
          notification.error({
            message: "Deletion Failed",
            description: (
              <div>
                {errMsg}
                <button
                  onClick={() => handleUndoDelete(classId, classItem)}
                  className="ml-4 text-indigo-600 hover:text-indigo-800 font-nunito"
                >
                  Undo
                </button>
              </div>
            ),
            duration: 5,
            key: messageKey,
          });
        }
      },
      onCancel: () => {
        message.info("Class deletion cancelled");
      },
    });
  };

  const handleUndoDelete = (classId, classItem) => {
    store.dispatch(
      adminDashboardApi.util.updateQueryData("getDashboardSummary", undefined, (draft) => {
        if (Array.isArray(draft.classes)) {
          draft.classes.push(classItem);
        } else {
          draft.classes = [classItem];
        }
      })
    );
    message.success({ content: "Class restored successfully", key: `deleteClass-${classId}` });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 mt-2">
      <div className="max-w-6xl mx-auto bg-white p-3 py-6 sm:px-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 mb-1 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="md:h-8 md:w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Classes
              </h2>
              <p className="text-sm md:text-base text-gray-500 font-nunito">
                View and manage all classes
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/classes/new")}
            className="flex text-[14px] sm:text-sm items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium font-nunito transition-colors shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            Add Class
          </button>
        </div>

        {/* Classes Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading classes...</p>
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
              {error?.data?.message || "Failed to load classes. Please try again."}
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Classes Found
            </h3>
            <p className="text-gray-500 font-nunito">
              There are currently no classes in the system.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-6 border-b border-indigo-200">
              <h2 className="text-lg font-semibold text-gray-900 font-nunito">
                Classes List
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-nunito">
                All classes with their respective teachers and students
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Class Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-200">
                  {classes.map((classItem) => (
                    <React.Fragment key={classItem._id}>
                      <tr className="hover:bg-indigo-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Bookmark className="h-5 w-5 text-indigo-500" />
                            <span className="ml-2 font-medium text-gray-900 font-nunito">
                              Class {classItem.classTitle} - {classItem.section}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {classItem.classTeacher?.name ? (
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="ml-2 text-gray-700 font-nunito">
                                {capitalizeName(classItem.classTeacher.name)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic font-nunito">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="ml-2 text-gray-700 font-nunito">
                              {classItem.totalStudents || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700 font-nunito">
                            {classItem.totalSubjects || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExpand(classItem._id)}
                            className="text-gray-600 hover:text-indigo-600 p-1 mr-2"
                            disabled={isDeleting}
                          >
                            {expandedClass === classItem._id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin-dashboard/classes/${classItem._id}/edit`)
                            }
                            className="text-indigo-500 hover:text-indigo-700 p-1 mr-2"
                            disabled={isDeleting}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(classItem._id, classItem)}
                            className="text-red-500 hover:text-red-700 p-1"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      {expandedClass === classItem._id && (
                        <tr>
                          <td colSpan="5" className="bg-indigo-50 p-4 border-t border-indigo-200">
                            {/* Subjects Section */}
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-700 mb-3 font-nunito">
                                Subjects in this class:
                              </h4>
                              {classItem.subjects &&
                              classItem.subjects.length > 0 &&
                              classItem.subjects.some((s) => s.subjectName) ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {classItem.subjects.map(
                                    (subject, index) =>
                                      subject.subjectName && (
                                        <div
                                          key={index}
                                          className="bg-white p-3 rounded-md shadow-sm border border-indigo-200"
                                        >
                                          <div className="flex items-start gap-2">
                                            <BookOpen className="h-5 w-5 text-indigo-500 mt-1" />
                                            <div className="flex-1">
                                              <div className="flex justify-between items-start">
                                                <h5 className="font-medium text-gray-900 font-nunito">
                                                  {capitalizeName(subject.subjectName)}
                                                </h5>
                                                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-nunito">
                                                  {subject.subjectCode || "N/A"}
                                                </span>
                                              </div>
                                              {subject.subjectTeacher?.name && (
                                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1 font-nunito">
                                                  <User className="h-3 w-3" />
                                                  {capitalizeName(subject.subjectTeacher.name)}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic font-nunito">
                                  No subjects assigned to this class
                                </p>
                              )}
                            </div>

                            {/* Students Section */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3 font-nunito">
                                Students in this class:
                              </h4>
                              {classItem.students && classItem.students.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {classItem.students.map((student, index) => (
                                    <div
                                      key={index}
                                      className="bg-white p-3 rounded-md shadow-sm border border-indigo-200"
                                    >
                                      <div className="flex items-start gap-2">
                                        <User className="h-5 w-5 text-green-500 mt-1" />
                                        <div>
                                          <h5 className="font-medium text-gray-900 font-nunito">
                                            {capitalizeName(student.name)}
                                          </h5>
                                          <p className="text-sm text-gray-600 font-nunito">
                                            Roll No: {student.rollNumber}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic font-nunito">
                                  No students assigned to this class
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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