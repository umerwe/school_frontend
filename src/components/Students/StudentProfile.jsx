import {
  AcademicCapIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  IdentificationIcon,
  LifebuoyIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ShieldCheckIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";
import { PencilIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function StudentProfile() {
  const user = useSelector((store) => store.userSlice.user);
  const navigate = useNavigate();
  const { state } = useLocation();
  const student = state?.student || user;

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 mb-4 text-lg">
          No student data found.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const capitalizeName = (name) =>
    name?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-700 transition-colors"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back to Students
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700"></div>
            
            <div className="relative px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                    {student.logo ? (
                      <img
                        src={student.logo}
                        alt={`${student.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/10 text-white">
                        <UserCircleIcon className="w-12 h-12 sm:w-14 sm:h-14" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-center sm:justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {capitalizeName(student.name)}
                    </h2>
                    <div className="space-y-1">
                      <p
                        className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <AcademicCapIcon className="h-4 w-4" />
                        Class {student.studentClass} - {student.section}
                      </p>
                      <p
                        className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <IdentificationIcon className="h-4 w-4" />
                        Roll No: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  {user?.role !== 'teacher' && (
                    <button
                      onClick={() => navigate(`/admin-dashboard/students/${student._id}/update`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium text-sm"
                      title="Edit Profile"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <Section title="Personal Information" icon={<UserCircleIcon className="h-5 w-5" />}>
                  <InfoGrid
                    data={[
                      {
                        icon: <IdentificationIcon className="h-5 w-5" />,
                        label: "Roll Number",
                        value: student.rollNumber
                      },
                      {
                        icon: <CalendarDaysIcon className="h-5 w-5" />,
                        label: "Date of Birth",
                        value: student.dateOfBirth
                          ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not provided"
                      },
                      {
                        icon: <LifebuoyIcon className="h-5 w-5" />,
                        label: "Blood Group",
                        value: student.bloodGroup || "Not provided"
                      },
                      {
                        icon: <UserCircleIcon className="h-5 w-5" />,
                        label: "Nationality",
                        value: student.nationality || "Not provided"
                      },
                      {
                        icon: <CalendarDaysIcon className="h-5 w-5" />,
                        label: "Admission Year",
                        value: student.admissionYear || "Not provided"
                      }
                    ]}
                  />
                </Section>

                <Section title="Contact Information" icon={<PhoneIcon className="h-5 w-5" />}>
                  <InfoGrid
                    data={[
                      {
                        icon: <EnvelopeIcon className="h-5 w-5" />,
                        label: "Email",
                        value: (
                          <a
                            href={`mailto:${student.email}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {student.email}
                          </a>
                        )
                      },
                      {
                        icon: <PhoneIcon className="h-5 w-5" />,
                        label: "Phone Number",
                        value: student.phoneNumber || "Not provided"
                      },
                      {
                        icon: <PhoneIcon className="h-5 w-5" />,
                        label: "Emergency Contact",
                        value: student.emergencyContact || "Not provided"
                      },
                      {
                        icon: <MapPinIcon className="h-5 w-5" />,
                        label: "Address",
                        value: student.address || "Not provided"
                      }
                    ]}
                  />
                </Section>
              </div>

              <div className="space-y-5">
                <Section title="Guardian Information" icon={<ShieldCheckIcon className="h-5 w-5" />}>
                  {student.guardian ? (
                    <InfoGrid
                      data={[
                        {
                          icon: <UserCircleIcon className="h-5 w-5" />,
                          label: "Name",
                          value: capitalizeName(student.guardian.name) || "Not provided"
                        },
                        {
                          icon: <EnvelopeIcon className="h-5 w-5" />,
                          label: "Email",
                          value: student.guardian.email ? (
                            <a
                              href={`mailto:${student.guardian.email}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {student.guardian.email}
                            </a>
                          ) : (
                            "Not provided"
                          )
                        },
                        {
                          icon: <PhoneIcon className="h-5 w-5" />,
                          label: "Phone",
                          value: student.guardian.phoneNumber ? (
                            <a
                              href={`tel:${student.guardian.phoneNumber}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {student.guardian.phoneNumber}
                            </a>
                          ) : (
                            "Not provided"
                          )
                        }
                      ]}
                    />
                  ) : (
                    <div className="text-gray-500 py-4 text-center">
                      No guardian information available
                    </div>
                  )}
                </Section>

                <Section title="Academic Information" icon={<BookOpenIcon className="h-5 w-5" />}>
                  <InfoGrid
                    data={[
                      {
                        icon: <AcademicCapIcon className="h-5 w-5" />,
                        label: "Class",
                        value: `Class ${student.studentClass} - Section ${student.section}`
                      },
                      {
                        icon: <CalendarDaysIcon className="h-5 w-5" />,
                        label: "Academic Year",
                        value: student.academicYear || "Not provided"
                      },
                      {
                        icon: <IdentificationIcon className="h-5 w-5" />,
                        label: "Attendance",
                        value: student.attendance ? `${student.attendance}%` : "Not provided"
                      }
                    ]}
                  />
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
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
      <span className="text-indigo-600">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const InfoGrid = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {data.map((item, index) => (
      <div key={index} className="flex items-start gap-3">
        <div className="text-indigo-600 mt-0.5">{item.icon}</div>
        <div>
          <div className="text-sm text-gray-500">{item.label}</div>
          <div className="text-gray-800 mt-1">
            {item.value}
          </div>
        </div>
      </div>
    ))}
  </div>
);