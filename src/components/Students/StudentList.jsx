import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { message, Modal, notification } from "antd";
import { useSelector } from "react-redux";
import { store } from "../../store/store"; // Adjust path to your Redux store
import { useGetDashboardSummaryQuery, useDeleteStudentMutation, adminDashboardApi } from "../../store/slices/adminDashboardApi";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "";

export default function StudentList() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  // Fetch students from dashboard summary
  const { data: studentsData, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => ({
      data: data?.students || [],
      isLoading,
      error,
    }),
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Sync students state and extract classes/sections
  useEffect(() => {
    if (studentsData) {
      setStudents(studentsData);
      const classSet = new Set(studentsData.map(student => student.studentClass));
      const sectionSet = new Set(studentsData.map(student => student.section));
      setClasses([...classSet].sort((a, b) => a - b));
      setSections([...sectionSet].sort());
    }
  }, [studentsData]);

  // Filter students based on selected class and section
  const filteredStudents = students.filter((student) => {
    const classMatch = selectedClass ? student.studentClass.toString() === selectedClass : true;
    const sectionMatch = selectedSection ? student.section === selectedSection : true;
    return classMatch && sectionMatch;
  });

  // Undo deletion by restoring the student in the cache
  const handleUndoDelete = (studentId, studentItem) => {
    store.dispatch(
      adminDashboardApi.util.updateQueryData("getDashboardSummary", undefined, (draft) => {
        if (Array.isArray(draft.students)) {
          draft.students.push(studentItem);
        } else {
          draft.students = [studentItem];
        }
      })
    );
    message.success({ content: "Student restored successfully", key: `deleteStudent-${studentId}` });
  };

  // Delete student
  const handleDelete = (studentId, studentItem) => {
    if (!/^[0-9a-fA-F]{24}$/.test(studentId)) {
      message.error("Invalid student ID");
      return;
    }

    Modal.confirm({
      title: "Confirm Deletion",
      content: "This will permanently delete the student. Proceed?",
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const messageKey = `deleteStudent-${studentId}`;
        message.loading({ content: "Deleting student...", key: messageKey });

        try {
          await deleteStudent(studentId).unwrap();
          setStudents(students.filter((student) => student._id !== studentId));
          message.success({
            content: "Student deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (error) {
          const errMsg = error?.data?.message || "Failed to delete student";
          notification.error({
            message: "Deletion Failed",
            description: (
              <div>
                {errMsg}
                <button
                  onClick={() => handleUndoDelete(studentId, studentItem)}
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
      onCancel: () => message.info("Deletion cancelled"),
    });
  };


  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <User className="md:w-8 md:h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                Students
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-nunito">
                {filteredStudents.length} students enrolled
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            {/* Class Filter */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none block w-full md:w-40 rounded-lg border border-indigo-200 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 bg-white text-gray-900 font-nunito"
              >
                <option value="">All Classes</option>
                {classes.map((classTitle) => (
                  <option key={classTitle} value={classTitle}>
                    Class {classTitle}
                  </option>
                ))}
              </select>
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

            {/* Section Filter */}
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="appearance-none block w-full md:w-40 rounded-lg border border-indigo-200 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 bg-white text-gray-900 font-nunito"
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
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

            <button
              onClick={() => navigate("/admin-dashboard/students/new")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 justify-center transition-colors shadow-sm hover:shadow-md font-nunito"
            >
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading students...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <User className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error?.data?.message || "Failed to load students. Please try again."}
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <User className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Students Found
            </h3>
            <p className="text-gray-500 font-nunito">
              {selectedClass || selectedSection
                ? `No students found for ${selectedClass ? `Class ${selectedClass}` : ""}${selectedClass && selectedSection ? " - " : ""}${selectedSection ? `Section ${selectedSection}` : ""}`
                : "No students are currently in the system"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-indigo-100 flex flex-col relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(student._id, student)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                  aria-label="Delete student"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Card Content */}
                <div className="p-6 flex flex-col items-center text-center space-y-3 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-indigo-100 ring-4 ring-indigo-200 group-hover:ring-indigo-500 transition-all">
                    {student.logo ? (
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={student.logo}
                        alt={`${student.name}'s avatar`}
                      />
                    ) : (
                      <User className="w-10 h-10 text-indigo-500 m-auto" />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-gray-900 font-nunito">
                    {capitalizeName(student.name)}
                  </h3>

                  {/* Roll Number */}
                  <div className="text-sm text-gray-600 font-nunito">
                    Roll No: {student.rollNumber}
                  </div>

                  {/* Class */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-nunito">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Class {student.studentClass} - Section {student.section}</span>
                  </div>

                  <div className="text-sm text-gray-600 font-nunito">
                    Email: {student.email}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-200">
                  <button
                    onClick={() => {
                      navigate("/admin-dashboard/student/profile", { state: { student } });
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