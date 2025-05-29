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
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { Lock, Pencil } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-red-500 mb-6 text-lg font-medium text-center">
          No student data found.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Go Back
        </button>
      </div>
    );
  }

  const capitalizeName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "";

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span>Back to Students</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700"></div>
            
            <div className="relative px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {capitalizeName(student.name)}
                    </h1>
                    <div className="space-y-1">
                      <p className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                        <AcademicCapIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        Class {student.studentClass} - Section {student.section}
                      </p>
                      <p className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                        <IdentificationIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        Roll No: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Stacked vertically */}
                  {user?.role !== 'teacher' && (
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/admin-dashboard/students/${student._id}/update`)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-sm sm:text-base"
                        title="Edit Profile"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        onClick={() => navigate(`/admin-dashboard/students/${student._id}/change-password`, { state: { student } })}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-sm sm:text-base"
                        title="Change Password"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Change Password</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Personal Information */}
                <Section
                  title="Personal Information"
                  icon={<UserCircleIcon className="h-6 w-6 text-indigo-600" />}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<IdentificationIcon className="h-5 w-5 text-indigo-500" />}
                      label="Roll Number"
                      value={student.rollNumber || "Not provided"}
                    />
                    <InfoItem
                      icon={<CalendarDaysIcon className="h-5 w-5 text-indigo-500" />}
                      label="Date of Birth"
                      value={formatDate(student.dateOfBirth)}
                    />
                    <InfoItem
                      icon={<LifebuoyIcon className="h-5 w-5 text-indigo-500" />}
                      label="Blood Group"
                      value={student.bloodGroup || "Not provided"}
                    />
                    <InfoItem
                      icon={<UserCircleIcon className="h-5 w-5 text-indigo-500" />}
                      label="Nationality"
                      value={student.nationality || "Not provided"}
                    />
                    <InfoItem
                      icon={<CalendarDaysIcon className="h-5 w-5 text-indigo-500" />}
                      label="Admission Year"
                      value={student.admissionYear || "Not provided"}
                    />
                  </div>
                </Section>

                {/* Contact Information */}
                <Section
                  title="Contact Information"
                  icon={<PhoneIcon className="h-6 w-6 text-indigo-600" />}
                >
                  <div className="space-y-6">
                    <InfoItem
                      icon={<EnvelopeIcon className="h-5 w-5 text-indigo-500" />}
                      label="Email Address"
                      value={
                        student.email ? (
                          <a
                            href={`mailto:${student.email}`}
                            className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
                          >
                            {student.email}
                          </a>
                        ) : (
                          "Not provided"
                        )
                      }
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                      label="Phone Number"
                      value={student.phoneNumber || "Not provided"}
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                      label="Emergency Contact"
                      value={student.emergencyContact || "Not provided"}
                    />
                    <InfoItem
                      icon={<MapPinIcon className="h-5 w-5 text-indigo-500" />}
                      label="Address"
                      value={student.address || "Not provided"}
                    />
                  </div>
                </Section>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Guardian Information */}
                <Section
                  title="Guardian Information"
                  icon={<ShieldCheckIcon className="h-6 w-6 text-indigo-600" />}
                >
                  {student.guardian ? (
                    <div className="space-y-6">
                      <InfoItem
                        icon={<UserCircleIcon className="h-5 w-5 text-indigo-500" />}
                        label="Name"
                        value={capitalizeName(student.guardian.name) || "Not provided"}
                      />
                      <InfoItem
                        icon={<EnvelopeIcon className="h-5 w-5 text-indigo-500" />}
                        label="Email"
                        value={
                          student.guardian.email ? (
                            <a
                              href={`mailto:${student.guardian.email}`}
                              className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
                            >
                              {student.guardian.email}
                            </a>
                          ) : (
                            "Not provided"
                          )
                        }
                      />
                      <InfoItem
                        icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                        label="Phone"
                        value={
                          student.guardian.phoneNumber ? (
                            <a
                              href={`tel:${student.guardian.phoneNumber}`}
                              className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
                            >
                              {student.guardian.phoneNumber}
                            </a>
                          ) : (
                            "Not provided"
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="bg-indigo-50 rounded-lg p-4 text-center text-gray-500">
                      No guardian information available
                    </div>
                  )}
                </Section>

                {/* Academic Information */}
                <Section
                  title="Academic Information"
                  icon={<BookOpenIcon className="h-6 w-6 text-indigo-600" />}
                >
                  <div className="space-y-6">
                    <InfoItem
                      icon={<AcademicCapIcon className="h-5 w-5 text-indigo-500" />}
                      label="Class"
                      value={`Class ${student.studentClass} - Section ${student.section}` || "Not provided"}
                    />
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

// Reusable Section Component
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Reusable Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-base text-gray-800 font-medium pl-7">
      {value || "Not provided"}
    </div>
  </div>
);