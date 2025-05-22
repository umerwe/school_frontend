import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useVerifyPaymentMutation } from "../../store/slices/parentDashboardApi";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");
  const [verifyPayment] = useVerifyPaymentMutation();

  useEffect(() => {
    const verifyPaymentAction = async () => {
      const query = new URLSearchParams(location.search);
      const voucherId = query.get("voucherId");

      if (!voucherId) {
        setStatus("error");
        setError("No voucher reference found");
        return;
      }

      try {
        const response = await verifyPayment({ voucherId }).unwrap();
console.log(response)
        if (response.data.status === "paid") {
          setStatus("success");
          setTimeout(() => navigate("/parent-dashboard/fees?fromPayment=true"), 3000);
        } else {
          setStatus("error");
          setError("Payment confirmation pending");
        }
      } catch (err) {
        setStatus("error");
        setError(err.data?.error || "Could not verify payment");
      }
    };

    verifyPaymentAction();
  }, [location, navigate, verifyPayment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8 text-center">
          {status === "verifying" ? (
            <>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </>
          ) : status === "success" ? (
            <>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your voucher has been updated.
              </p>
              <div className="animate-pulse text-sm text-gray-500">
                Redirecting you back in 3 seconds...
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Issue</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => navigate("/parent-dashboard/fees?fromPayment=true")}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Return to Vouchers
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}