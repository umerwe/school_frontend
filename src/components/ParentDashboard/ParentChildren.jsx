import { useSelector } from "react-redux";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "";

export default function ParentChildren() {
  const { user } = useSelector((store) => store.userSlice);
  const children = user.childrens;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {children.length === 0 ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No Children Found
          </h3>
          <p className="text-gray-500">
            No children are currently associated with this account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {children.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-5 flex flex-col items-center">
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

                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {capitalizeName(student.name)}
                </h3>
                
                <div className="text-sm text-gray-500 mb-3">
                  Roll No: {student.rollNumber}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
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

                <div className="text-sm text-gray-600 truncate w-full text-center">
                  {student.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}