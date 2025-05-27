import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateSubjectMutation } from "../../api/adminDashboardApi";
import { Loader2 } from "lucide-react";

export default function SubjectForm() {
  const navigate = useNavigate();

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();

  const [formData, setFormData] = useState({
    classTitle: "",
    section: "",
    subjectName: "",
    teacherName: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateFormData = () => {
    const { classTitle, section, subjectName, teacherName } = formData;
    if (!classTitle) return "Please select a class";
    if (!section.trim()) return "Please enter a section";
    if (!subjectName) return "Please select a subject";
    if (!teacherName.trim()) return "Please enter a teacher name";
    if (!/^[A-Za-z\s]+$/.test(teacherName.trim())) return "Teacher name must contain only letters and spaces";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFormData();
    if (validationError) {
      message.error(validationError);
      return;
    }

    const messageKey = "createSubject";
    message.loading({ content: "Creating subject...", key: messageKey });

    console.log("Submitting create with formData:", formData); // Debug

    try {
      const response = await createSubject(formData).unwrap();
      console.log("Create subject response:", response); // Debug
      message.success({
        content: "Subject created successfully!",
        key: messageKey,
        duration: 2,
      });
      setFormData({ classTitle: "", section: "", subjectName: "", teacherName: "" });
      navigate("/admin-dashboard/subjects");
    } catch (error) {
      console.error("Create subject error:", error); // Debug
      const errMsg = error?.data?.message || "Error creating subject";
      message.error({ content: errMsg, key: messageKey, duration: 3 });
    }
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white shadow-sm rounded-lg p-8 mt-10 border border-indigo-200">
      <h2
        className="text-2xl font-semibold mb-6 text-gray-900"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        Create New Subject
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Title */}
        <div className="relative z-10">
          <label htmlFor="classTitle" className="block text-sm font-medium text-gray-700">
            Class <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="classTitle"
              id="classTitle"
              value={formData.classTitle}
              onChange={handleChange}
              required
              className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <option value="" disabled>
                Select class
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
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
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">
            Section <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="section"
            id="section"
            value={formData.section}
            onChange={handleChange}
            required
            placeholder="e.g. A"
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>

        {/* Subject Name */}
        <div className="relative z-10">
          <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="subjectName"
              id="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              required
              className="appearance-none mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <option value="" disabled>
                Select subject
              </option>
              {[
                "Maths",
                "English",
                "Urdu",
                "Science",
                "Socialstudies",
                "Arts",
                "Physics",
                "Chemistry",
                "Computer",
                "Pakstudies",
                "Islamiat",
              ].map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
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
        </div>

        {/* Teacher Name */}
        <div>
          <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">
            Teacher Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="teacherName"
            id="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            required
            placeholder="e.g. Ayesha Khan"
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isCreating}
            className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${
              isCreating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {isCreating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Subject"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}