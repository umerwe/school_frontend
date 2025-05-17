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
import { useGetDashboardSummaryQuery, useDeleteClassMutation } from "../../store/slices/adminDashboardApi";
import { store } from "../../store/store"; // Adjust path to your Redux store

// Helper function to capitalize names
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

  // Toggle expand for class details
  const toggleExpand = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  // Handle deletion with Modal confirmation
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

        console.log("Deleting class, classId:", classId); // Debug

        try {
          await deleteClass(classId).unwrap();
          message.success({
            content: "Class deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (err) {
          console.error("Delete class error:", err); // Debug
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

  // Undo deletion by restoring the class in the cache
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

  // Check if user is admin
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
            You must be an admin to view classes. Please contact the administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">
                Class Management
              </h2>
              <p className="text-gray-500 font-nunito">
                View and manage all classes in the system
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/classes/new")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium font-nunito transition-colors shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            Add New Class
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
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-indigo-50 p-4 border-b border-indigo-200">
              <div className="col-span-4 md:col-span-3 font-medium text-gray-700 font-nunito">
                Class Details
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center font-nunito">
                Teacher
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center font-nunito">
                Students
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center font-nunito">
                Subjects
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-right font-nunito">
                Actions
              </div>
            </div>

            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="border-b border-indigo-200 last:border-b-0"
              >
                <div className="grid grid-cols-12 p-4 items-center hover:bg-indigo-50 transition-colors">
                  <div className="col-span-4 md:col-span-3">
                    <div className="flex items-center gap-3">
                      <Bookmark className="h-5 w-5 text-indigo-500" />
                      <div>
                        <h3 className="font-medium text-gray-900 font-nunito">
                          Class {classItem.classTitle} - {classItem.section}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    {classItem.classTeacher?.name ? (
                      <div className="flex items-center justify-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 font-nunito">
                          {capitalizeName(classItem.classTeacher.name)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic font-nunito">
                        Not assigned
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 font-nunito">
                        {classItem.totalStudents || 0}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-gray-700 font-nunito">
                      {classItem.totalSubjects || 0}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => toggleExpand(classItem._id)}
                      className="p-1 text-gray-600 hover:text-indigo-600"
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
                      className="p-1 text-indigo-500 hover:text-indigo-700"
                      disabled={isDeleting}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem._id, classItem)}
                      className="p-1 text-red-500 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {expandedClass === classItem._id && (
                  <div className="bg-indigo-50 p-4 border-t border-indigo-200">
                    {/* Subjects Section */}
                    <h4 className="font-medium text-gray-700 mb-3 font-nunito">
                      Subjects in this class:
                    </h4>
                    {classItem.subjects &&
                    classItem.subjects.length > 0 &&
                    classItem.subjects.some((s) => s.subjectName) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                    {/* Students Section */}
                    <h4 className="font-medium text-gray-700 mt-6 mb-3 font-nunito">
                      Students in this class:
                    </h4>
                    {classItem.students && classItem.students.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}