import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  School,
  Plus,
  Trash2,
  Search,
  Users,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { message, Modal, notification } from "antd";
import { useSelector } from "react-redux";
import { store } from "../../store/store"; // Adjust path to your Redux store
import { useGetDashboardSummaryQuery, useDeleteTeacherMutation, adminDashboardApi } from "../../api/adminDashboardApi";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "";

export default function TeacherList() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation(); // Updated to useDeleteTeacherMutation

  // Fetch teachers from dashboard summary
  const { data: teachersData, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => ({
      data: data?.teachers || [],
      isLoading,
      error,
    }),
  });
  

  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync teachers state
  useEffect(() => {
    if (teachersData) {
      setTeachers(teachersData);
    }
  }, [teachersData]);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Undo deletion by restoring the teacher in the cache
  const handleUndoDelete = (teacherId, teacherItem) => {
    store.dispatch(
      adminDashboardApi.util.updateQueryData("getDashboardSummary", undefined, (draft) => {
        if (Array.isArray(draft.teachers)) {
          draft.teachers.push(teacherItem);
        } else {
          draft.teachers = [teacherItem];
        }
      })
    );
    message.success({ content: "Teacher restored successfully", key: `deleteTeacher-${teacherId}` });
  };

  // Delete teacher
  const handleDelete = (teacherId, teacherItem) => {
    if (!/^[0-9a-fA-F]{24}$/.test(teacherId)) {
      message.error("Invalid teacher ID");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the teacher.",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const messageKey = `deleteTeacher-${teacherId}`;
        message.loading({ content: "Deleting teacher...", key: `deleteTeacher-${teacherId}` });

        try {
          await deleteTeacher(teacherId).unwrap(); // Trigger the mutation
          setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
          message.success({
            content: "Teacher deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (error) {
          const errMsg = error?.data?.message || "Failed to delete teacher";
          notification.error({
            message: "Deletion Failed",
            description: (
              <div>
                {errMsg}
                <button
                  onClick={() => handleUndoDelete(teacherId, teacherItem)}
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
        message.info("Teacher deletion cancelled");
      },
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="md:h-8 md:w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                    Teachers
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 font-nunito">
                    {filteredTeachers.length} {filteredTeachers.length === 1 ? "teacher" : "teachers"} in total
                    {searchTerm && ` (filtered from ${teachers.length})`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="pl-10 w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-nunito"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => navigate("/admin-dashboard/teachers/new")}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto font-nunito shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading teachers...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error?.data?.message || "Failed to load teachers. Please try again."}
            </p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              {searchTerm ? "No Teachers Match Your Search" : "No Teachers Found"}
            </h3>
            <p className="text-gray-500 font-nunito">
              {searchTerm ? "Try a different search term" : "No teachers are currently in the system."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-indigo-500 hover:text-indigo-700 transition-colors font-nunito"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4auso gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-indigo-100 flex flex-col relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(teacher._id, teacher)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                  aria-label="Delete teacher"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Card Content */}
                <div className="p-6 flex flex-col items-center text-center space-y-3 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-indigo-100 ring-4 ring-indigo-200 group-hover:ring-indigo-500 transition-all">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={teacher.logo}
                      alt={`${teacher.name}'s avatar`}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-gray-900 font-nunito">
                    {capitalizeName(teacher.name)}
                  </h3>

                  {/* Department (if available) */}
                  {teacher.department && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-nunito">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>{teacher.department}</span>
                    </div>
                  )}

                  {/* Class Teacher */}
                  <div className="mt-2 text-sm text-indigo-500 font-nunito">
                    {teacher.classTeacherOf && teacher.classTeacherOf.classTitle ? (
                      <>
                        <div className="flex items-center justify-center gap-2">
                          <School className="w-4 h-4" />
                          <span>Class Teacher</span>
                        </div>
                        <div className="text-gray-600 mt-1 font-nunito">
                          {teacher.classTeacherOf.classTitle} - Section {teacher.classTeacherOf.section}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-2">
                          <School className="w-4 h-4" />
                          <span>Class Teacher</span>
                        </div>
                        <div className="text-gray-600 mt-1 font-nunito">
                          Not Assigned
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-200">
                  <button
                    onClick={() => {
                      navigate(`/admin-dashboard/teacher/profile`, {
                        state: { teacher },
                      });
                      window.scrollTo(0, 0);
                    }}
                    className="w-full text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors font-nunito"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}