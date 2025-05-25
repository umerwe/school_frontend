import { useSelector } from "react-redux";
import { Users } from "lucide-react";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "";

export default function ParentChildren() {
  const { user } = useSelector((store) => store.userSlice);
  const children = user.childrens;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                  My Children
                </h1>
                <p className="text-sm md:text-base text-gray-500 font-nunito">
                  View details of your {children.length} {children.length === 1 ? "child" : "children"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Children Found
            </h3>
            <p className="text-gray-500 font-nunito">
              No children are currently associated with this account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-indigo-100 overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {student.logo ? (
                        <img
                          className="w-full h-full object-cover"
                          src={student.logo}
                          alt={student.name}
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-1 font-nunito">
                    {capitalizeName(student.name)}
                  </h3>

                  <div className="text-sm text-gray-500 mb-3 font-nunito">
                    Roll No: {student.rollNumber}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2 font-nunito">
                    <svg
                      className="w-4 h-4 mr-1 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Class {student.studentClass} - {student.section}
                  </div>

                  <div className="text-sm text-gray-600 truncate w-full text-center font-nunito">
                    {student.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}