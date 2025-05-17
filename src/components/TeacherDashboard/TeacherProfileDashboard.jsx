import { useSelector } from "react-redux";
import { CalendarDays, Mail, ShieldCheck, Building2, Phone, User, BookOpenText } from "lucide-react";

export default function TeacherProfileDashboard() {
    const user = useSelector((store) => store.userSlice.user);
    
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {/* Profile Header */}
                <div className="bg-blue-50 p-6 border-b border-blue-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center">
                            {user?.logo ? (
                                <img src={user.logo} alt="Teacher Logo" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="h-8 w-8 text-blue-600" />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800 capitalize">
                                {user.name}
                            </h1>
                            <p className="text-blue-600 font-medium mt-1">
                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Teacher"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                        <InfoBlock icon={<Mail className="h-5 w-5" />} label="Email" value={user.email} bg="bg-blue-100" color="text-blue-600" />
                        <InfoBlock icon={<ShieldCheck className="h-5 w-5" />} label="Teacher ID" value={user.teacherId} bg="bg-purple-100" color="text-purple-600" />
                        <InfoBlock icon={<BookOpenText className="h-5 w-5" />} label="Department" value={user.department} bg="bg-yellow-100" color="text-yellow-600" />
                        <InfoBlock icon={<Phone className="h-5 w-5" />} label="Phone Number" value={user.phoneNumber} bg="bg-green-100" color="text-green-600" />
                        <InfoBlock icon={<User className="h-5 w-5" />} label="Emergency Contact" value={user.emergencyContact} bg="bg-red-100" color="text-red-600" />
                    </div>

                    <div className="space-y-4">
                        
                    <InfoBlock icon={<BookOpenText className="h-5 w-5" />} label="Class Teacher Of" value={`${user.classTeacherOf?.classTitle || 'N/A'} - ${user.classTeacherOf?.section || 'N/A'}`} bg="bg-cyan-100" color="text-cyan-600" />
                        <InfoBlock icon={<CalendarDays className="h-5 w-5" />} label="Date of Birth" value={formatDate(user.dateOfBirth)} bg="bg-pink-100" color="text-pink-600" />
                        <InfoBlock icon={<Building2 className="h-5 w-5" />} label="Address" value={user.address} bg="bg-indigo-100" color="text-indigo-600" />
                        <InfoBlock icon={<ShieldCheck className="h-5 w-5" />} label="Blood Group" value={user.bloodGroup} bg="bg-orange-100" color="text-orange-600" />
                        <InfoBlock icon={<ShieldCheck className="h-5 w-5" />} label="Nationality" value={user.nationality} bg="bg-teal-100" color="text-teal-600" />
                    </div>
                </div>

                {/* Qualifications Section */}
                {user.qualifications?.length > 0 && (
                    <div className="px-6 pb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Qualifications</h2>
                        <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {user.qualifications.map((qual, idx) => (
                                <li key={idx}>{qual}</li>
                            ))}
                        </ul>
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
                <p className="text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );
}
