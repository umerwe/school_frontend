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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        <div
          className="text-red-600 mb-6 text-lg text-center"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          No teacher data found.
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/teachers")}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ChevronLeftIcon className="h-5 w-5" />
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
      className="flex items-center gap-2 text-slate-600 text-sm font-medium"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {icon}
      {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/admin-dashboard/teachers")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Teachers</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Profile Header */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700"></div>
            
            <div className="relative px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                    {teacher.logo ? (
                      <img
                        src={teacher.logo}
                        alt={`${teacher.name}'s profile`}
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
                    <h1
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {capitalizeName(teacher.name)}
                    </h1>
                    <div className="space-y-1">
                      <p
                        className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        {teacher.email}
                      </p>
                      <p
                        className="text-indigo-100 flex items-center justify-center sm:justify-start gap-2 text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <IdentificationIcon className="h-4 w-4" />
                        ID: {teacher.teacherId}
                      </p>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  <button
                    onClick={() =>
                      navigate(`/admin-dashboard/teachers/${teacher._id}/update`, {
                        state: { teacher },
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium text-sm"
                    title="Edit Profile"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
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
                      label="Teacher ID"
                      value={teacher.teacherId}
                    />
                    <InfoItem
                      icon={<CalendarDaysIcon className="h-5 w-5 text-indigo-500" />}
                      label="Date of Birth"
                      value={
                        teacher.dateOfBirth
                          ? new Date(teacher.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not provided"
                      }
                    />
                    <InfoItem
                      icon={<LifebuoyIcon className="h-5 w-5 text-indigo-500" />}
                      label="Blood Group"
                      value={teacher.bloodGroup || "Not provided"}
                    />
                    <InfoItem
                      icon={<UserCircleIcon className="h-5 w-5 text-indigo-500" />}
                      label="Nationality"
                      value={teacher.nationality || "Not provided"}
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
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {teacher.email}
                        </a>
                      }
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                      label="Phone Number"
                      value={teacher.phoneNumber || "Not provided"}
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5 text-indigo-500" />}
                      label="Emergency Contact"
                      value={teacher.emergencyContact || "Not provided"}
                    />
                    <InfoItem
                      icon={<MapPinIcon className="h-5 w-5 text-indigo-500" />}
                      label="Address"
                      value={teacher.address || "Not provided"}
                    />
                  </div>
                </Section>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Professional Information */}
                <Section
                  title="Professional Information"
                  icon={<AcademicCapIcon className="h-6 w-6 text-indigo-600" />}
                >
                  <div className="space-y-6">
                    {/* Class Teacher Info */}
                    {teacher.classTeacherOf && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                        <h4
                          className="font-semibold text-indigo-700 mb-3 flex items-center gap-2 text-lg"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <BuildingLibraryIcon className="h-6 w-6" />
                          Class Teacher
                        </h4>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span
                              className="text-slate-700 font-medium text-lg"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              Class {teacher.classTeacherOf?.classTitle} - Section{" "}
                              {teacher.classTeacherOf?.section}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Qualifications */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                      <h4
                        className="font-semibold text-emerald-700 mb-4 flex items-center gap-2 text-lg"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        <AcademicCapIcon className="h-6 w-6" />
                        Educational Qualifications
                      </h4>
                      {teacher.qualifications && teacher.qualifications.length > 0 ? (
                        <div className="space-y-3">
                          {teacher.qualifications.map((qualification, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm border border-emerald-100"
                            >
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                              <span
                                className="text-slate-700 font-medium"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                {qualification}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                          <p
                            className="text-slate-500 italic"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            No qualifications provided
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Teaching Subjects */}
                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                        <h4
                          className="font-semibold text-amber-700 mb-4 flex items-center gap-2 text-lg"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <AcademicCapIcon className="h-6 w-6" />
                          Teaching Subjects
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {teacher.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-white text-amber-700 rounded-lg text-sm font-semibold shadow-sm border border-amber-200 hover:shadow-md transition-shadow"
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
  <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div
      className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center gap-3"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {icon}
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span
        className="text-sm font-semibold text-slate-600 uppercase tracking-wide"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        {label}
      </span>
    </div>
    <div
      className="text-base text-slate-800 font-medium pl-7"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {value || "Not provided"}
    </div>
  </div>
);