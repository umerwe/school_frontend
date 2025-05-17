import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  IdentificationIcon,
  LifebuoyIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function TeacherProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const teacher = state?.teacher;

  // Redirect if no teacher data
  if (!teacher) {
    message.error("No teacher data provided");
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div
          className="text-red-500 mb-4 text-lg"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          No teacher data found.
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/teachers")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Teachers
        </button>
      </div>
    );
  }

  const capitalizeName = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") || ""
    );
  };

  const label = (icon, text) => (
    <span
      className="flex items-center gap-2 text-gray-600"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {icon}
      {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/admin-dashboard/teachers")}
          className="flex items-center gap-2 mb-6 text-indigo-500 hover:text-indigo-600 transition-colors"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back to Teachers
        </button>

        {/* Main profile card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-indigo-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-indigo-200 shadow-xl">
                {teacher.logo ? (
                  <img
                    src={teacher.logo}
                    alt={`${teacher.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <UserCircleIcon className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-0"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {capitalizeName(teacher.name)}
                  </h2>
                  <div>
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/teachers/${teacher._id}/update`, {
                          state: { teacher },
                        })
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-500 rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                      title="Edit Profile"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <p
                    className="text-indigo-100 flex items-center gap-2"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    <BuildingLibraryIcon className="h-5 w-5" />
                    {teacher.department || "General"} Department
                  </p>
                  <p
                    className="text-indigo-100 flex items-center gap-2"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    <IdentificationIcon className="h-5 w-5" />
                    ID: {teacher.teacherId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information sections */}
          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <Section
                  title="Personal Information"
                  icon={<UserCircleIcon className="h-5 w-5 text-indigo-500" />}
                >
                  <InfoGrid
                    data={[
                      [
                        label(
                          <IdentificationIcon className="h-5 w-5 text-indigo-500" />,
                          "Teacher ID"
                        ),
                        <span
                          style={{ fontFamily: "Nunito, sans-serif" }}
                          className="font-medium"
                        >
                          {teacher.teacherId}
                        </span>,
                      ],
                      [
                        label(
                          <CalendarDaysIcon className="h-5 w-5 text-indigo-500" />,
                          "Date of Birth"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.dateOfBirth
                            ? new Date(teacher.dateOfBirth).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Not provided"}
                        </span>,
                      ],
                      [
                        label(
                          <LifebuoyIcon className="h-5 w-5 text-indigo-500" />,
                          "Blood Group"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.bloodGroup || "Not provided"}
                        </span>,
                      ],
                      [
                        label(
                          <UserCircleIcon className="h-5 w-5 text-indigo-500" />,
                          "Nationality"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.nationality || "Not provided"}
                        </span>,
                      ],
                    ]}
                  />
                </Section>

                <Section
                  title="Contact Information"
                  icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                >
                  <InfoGrid
                    data={[
                      [
                        label(
                          <EnvelopeIcon className="h-5 w-5 text-indigo-500" />,
                          "Email"
                        ),
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-indigo-500 hover:text-indigo-600 hover:underline"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {teacher.email}
                        </a>,
                      ],
                      [
                        label(
                          <PhoneIcon className="h-5 w-5 text-indigo-500" />,
                          "Phone Number"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.phoneNumber || "Not provided"}
                        </span>,
                      ],
                      [
                        label(
                          <PhoneIcon className="h-5 w-5 text-indigo-500" />,
                          "Emergency Contact"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.emergencyContact || "Not provided"}
                        </span>,
                      ],
                      [
                        label(
                          <MapPinIcon className="h-5 w-5 text-indigo-500" />,
                          "Address"
                        ),
                        <span style={{ fontFamily: "Nunito, sans-serif" }}>
                          {teacher.address || "Not provided"}
                        </span>,
                      ],
                    ]}
                  />
                </Section>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <Section
                  title="Professional Information"
                  icon={<AcademicCapIcon className="h-5 w-5 text-indigo-500" />}
                >
                  <div className="space-y-6">
                    {/* Class Teacher Info */}
                    {teacher.classTeacherOf && (
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4
                          className="font-medium text-indigo-500 mb-3 flex items-center gap-2"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <BuildingLibraryIcon className="h-5 w-5" />
                          Class Teacher Information
                        </h4>
                        <div
                          className="text-gray-700"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <div className="flex items-center gap-2 text-base">
                            <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
                            <span>
                              Class {teacher.classTeacherOf?.classTitle} - Section{" "}
                              {teacher.classTeacherOf?.section}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Qualifications */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4
                        className="font-medium text-indigo-500 mb-3 flex items-center gap-2"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <AcademicCapIcon className="h-5 w-5" />
                        Educational Qualifications
                      </h4>
                      {teacher.qualifications && teacher.qualifications.length > 0 ? (
                        <ul className="space-y-2">
                          {teacher.qualifications.map((qualification, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-1.5"></div>
                              <span className="text-gray-700">{qualification}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className="text-gray-500"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          No qualifications provided
                        </p>
                      )}
                    </div>

                    {/* Teaching Subjects */}
                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4
                          className="font-medium text-indigo-500 mb-3 flex items-center gap-2"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <AcademicCapIcon className="h-5 w-5" />
                          Teaching Subjects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
    <div
      className="px-5 py-4 border-b border-indigo-200 flex items-center gap-2"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InfoGrid = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
    {data.map(([label, value], index) => (
      <div key={index} className="flex flex-col">
        <p
          className="text-sm font-medium text-gray-600"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {label}
        </p>
        <div
          className="text-base text-gray-900 mt-1"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {value || "Not provided"}
        </div>
      </div>
    ))}
  </div>
);