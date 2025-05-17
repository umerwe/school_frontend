import { useSelector } from "react-redux";
import { Mail, Phone, User, UserCog, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ParentProfile() {
  const user = useSelector((store) => store.userSlice.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 mb-4 text-lg">
          No parent data found.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const capitalizeName = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Parents
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center">
              <User className="h-8  w-8 text-blue-600" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">
                {capitalizeName(user.name)}
              </h1>
              <p className="text-blue-600 font-medium mt-1">
                Parent
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <InfoBlock
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={user.email}
              bg="bg-blue-100"
              color="text-blue-600"
            />
            <InfoBlock
              icon={<Phone className="h-5 w-5" />}
              label="Phone Number"
              value={user.phoneNumber || "Not provided"}
              bg="bg-green-100"
              color="text-green-600"
            />
          </div>

          <div className="space-y-4">
          <InfoBlock
              icon={<UserCog className="h-5 w-5" />}
              label="Parent ID"
              value={user._id}
              bg="bg-purple-100"
              color="text-purple-600"
            />
            <InfoBlock
              icon={<Users className="h-5 w-5" />}
              label="Number of Children"
              value={user.childrens?.length || 0}
              bg="bg-cyan-100"
              color="text-cyan-600"
            />
          </div>
        </div>

        {/* Children Section */}
        {user.childrens?.length > 0 && (
          <div className="px-6 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Children Information</h2>
            <div className="space-y-3">
              {user.childrens.map((child, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{capitalizeName(child.name)}</h3>
                      <p className="text-sm text-gray-600">
                        Class {child.studentClass} - Section {child.section} (Roll No: {child.rollNumber})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable InfoBlock Component
function InfoBlock({ icon, label, value, bg, color }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-2 rounded-lg ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-800 break-words">{value || "Not provided"}</p>
      </div>
    </div>
  );
}