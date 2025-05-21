// src/components/ParentList.js
import React, { useState, useEffect } from "react";
import { User, Users, Plus, Trash2, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { useSelector } from "react-redux";
import { useGetDashboardSummaryQuery, useDeleteParentMutation } from "../../store/slices/adminDashboardApi";

const capitalizeWords = (str) =>
  str
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ParentList() {
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.userSlice.user);

  // Fetch parents from dashboard summary
  const { data: parentsData, isLoading, error } = useGetDashboardSummaryQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => ({
      data: data?.parents || [],
      isLoading,
      error,
    }),
  });

  const [deleteParent, { isLoading: isDeleting }] = useDeleteParentMutation();
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync parents state
  useEffect(() => {
    if (parentsData) {
      setParents(parentsData);
    }
  }, [parentsData]);

  // Filter parents based on search term
  const filteredParents = parents.filter((parent) =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete parent with Modal confirmation
  const handleDelete = (parentId) => {
    if (!/^[0-9a-fA-F]{24}$/.test(parentId)) {
      message.error("Invalid parent ID");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the parent.",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const messageKey = `deleteParent-${parentId}`;
        message.loading({ content: "Deleting parent...", key: messageKey });

        try {
          await deleteParent(parentId).unwrap();
          message.success({
            content: "Parent deleted successfully",
            key: messageKey,
            duration: 2,
          });
        } catch (err) {
          console.error("Delete parent error:", err);
          const errMsg = err?.data?.message || "Failed to delete parent";
          message.error({
            content: errMsg,
            key: messageKey,
            duration: 3,
          });
        }
      },
      onCancel: () => {
        message.info("Parent deletion cancelled");
      },
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="md:h-8 md:w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-nunito">
                    Parents
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 font-nunito">
                    {filteredParents.length} {filteredParents.length === 1 ? "parent" : "parents"} in total
                    {searchTerm && ` (filtered from ${parents.length})`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="pl-10 w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-nunito"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => navigate("/admin-dashboard/parents/new")}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto font-nunito shadow-sm hover:shadow-md"
                >
                  <Plus className="h-5 w-5" />
                  Add Parent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Parents Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              Error
            </h3>
            <p className="text-gray-500 font-nunito">
              {error?.message || "Failed to load parents. Please try again."}
            </p>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Parents Found
            </h3>
            <p className="text-gray-500 font-nunito">
              {searchTerm ? "Try a different search term" : "Add your first parent to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-indigo-500 hover:text-indigo-700 transition-colors font-nunito"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParents.map((parent) => (
              <div
                key={parent._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-indigo-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-nunito">
                          {capitalizeWords(parent.name)}
                        </h3>
                        <p className="text-sm text-gray-500 -mt-1 font-nunito">{parent.email}</p>
                        <p className="text-sm text-gray-500 font-nunito">{parent.phoneNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(parent._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Parent"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-indigo-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-nunito">Children</h4>
                    {!parent.childrens || parent.childrens.length === 0 ? (
                      <div className="text-sm text-gray-400 italic bg-indigo-50 p-2 rounded font-nunito">
                        No children listed
                      </div>
                    ) : (
                      <ul className="space-y-1 bg-indigo-50 p-2 rounded">
                        {parent.childrens.map((child, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2 font-nunito">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            {capitalizeWords(child.name)}
                          </li>
                        ))}
                      </ul>
                    )}
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