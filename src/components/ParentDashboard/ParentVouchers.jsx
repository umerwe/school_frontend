import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2, BookOpen, X, User, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import {
  AcademicCapIcon,
  UserCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  useCreateCheckoutSessionMutation,
  useGetParentDashboardSummaryQuery,
} from "../../store/slices/parentDashboardApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function ParentVouchers() {
  const currentUser = useSelector((store) => store.userSlice.user);
  const children = currentUser?.childrens || [];
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState("");
  const [loadingVouchers, setLoadingVouchers] = useState({}); // Track loading per voucher

  const { data: dashboardData, isLoading, error: queryError } = useGetParentDashboardSummaryQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  // Format date for display
  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color and button style based on voucher status
  const getStatusInfo = (status) => {
    const statusLower = (status || "").toLowerCase();
    const statusConfig = {
      unpaid: {
        class: "bg-red-100 text-red-800 border-red-200",
        buttonClass: "bg-indigo-600 text-white hover:bg-indigo-700",
        buttonText: "Pay Now",
        disabled: false,
      },
      paid: {
        class: "bg-green-100 text-green-800 border-green-200",
        buttonClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
        buttonText: "Paid",
        disabled: true,
      },
      default: {
        class: "bg-gray-100 text-gray-800 border-gray-200",
        buttonClass: "bg-gray-300 text-gray-600 cursor-not-allowed",
        buttonText: "N/A",
        disabled: true,
      },
    };
    return statusConfig[statusLower] || statusConfig.default;
  };

  // Handle payment action
  const handlePayment = async (voucherId) => {
    setLoadingVouchers((prev) => ({ ...prev, [voucherId]: true }));
    setError("");
    try {
      const response = await createCheckoutSession({ voucherId }).unwrap();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.id,
      });
      if (error) {
        throw new Error(error.message || "Failed to redirect to Stripe checkout");
      }
    } catch (err) {
      setError(
        err.data?.error ||
          err.message ||
          "Failed to initiate payment. Please try again."
      );
      setLoadingVouchers((prev) => ({ ...prev, [voucherId]: false }));
    }
  };

  // Update vouchers when selected student changes or dashboard data updates
  useEffect(() => {
    if (dashboardData && selectedStudentId) {
      const selectedChild = dashboardData.childrenDetails.find(
        (child) => child.studentId === selectedStudentId
      );
      setVouchers(selectedChild?.vouchers || []);
      setError("");
      setLoadingVouchers({}); // Reset loading states
    }
  }, [dashboardData, selectedStudentId]);

  // Set the first child as the default selected student
  useEffect(() => {
    if (children.length > 0 && !selectedStudentId) {
      setSelectedStudentId(children[0]._id);
    }
  }, [children, selectedStudentId]);

  const selectedStudent = children.find((child) => child._id === selectedStudentId);

  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-nunito">
            No Students Found
          </h3>
          <p className="text-gray-500 font-nunito">
            Please contact administration for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CurrencyDollarIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">
              Voucher Records
            </h2>
          </div>
          <p className="text-gray-500 font-nunito">
            View and manage voucher records for your children
          </p>
        </div>

        {/* Student Selection */}
        <div className="mb-8">
          <label
            htmlFor="studentSelect"
            className="block text-sm font-medium text-gray-700 mb-2 font-nunito"
          >
            Select Student
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserCircleIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <select
              id="studentSelect"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none bg-white font-nunito"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {capitalizeWords(child.name) || `Student ${child._id}`} (Class{" "}
                  {child.studentClass || "N/A"} - {child.section || "N/A"})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Error State */}
        {(error || queryError) && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center mt-0.5">
              <X className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium font-nunito">
                {error || queryError?.data?.message || "Failed to fetch voucher records"}
              </p>
              <button
                onClick={() => {
                  setError("");
                  window.location.reload();
                }}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 font-nunito"
              >
                <CurrencyDollarIcon className="w-3 h-3" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-nunito">Loading vouchers...</p>
          </div>
        ) : vouchers.length > 0 ? (
          <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        Due Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      <div className="flex items-center gap-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        Voucher ID
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-nunito">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {vouchers.map((voucher) => {
                    const statusInfo = getStatusInfo(voucher.status);
                    const isLoading = loadingVouchers[voucher._id];
                    return (
                      <tr
                        key={voucher._id}
                        className="hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                          {formatDisplayDate(voucher.dueDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                          {voucher.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusInfo.class}`}
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {voucher.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-nunito">
                          {voucher.voucherId || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handlePayment(voucher.voucherId)}
                            disabled={statusInfo.disabled || isLoading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 min-w-[100px] ${
                              statusInfo.disabled || isLoading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              statusInfo.buttonText
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-nunito">
              No Vouchers Found
            </h3>
            <p className="text-gray-500 font-nunito">
              No voucher records available for this student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}