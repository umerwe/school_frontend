import React from 'react';
import { useSelector } from 'react-redux';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';
import { Loader2, AlertCircle, ClipboardList, FileText, DollarSign, Calendar, CheckCircle, Clock, XCircle, BookOpen, Ticket } from 'lucide-react';

const FeeStatus = () => {
  const { user } = useSelector((store) => store.userSlice);
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const vouchers = data?.vouchers || [];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-160px)] p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading fee vouchers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-160px)] p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="p-4 bg-red-50 rounded-full">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md">
              {error.data?.message || 'Failed to fetch voucher information. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-1.5 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 mr-1.5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with icon and title */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Fee Vouchers
              </h1>
              <p className="text-sm text-gray-600">
                View your payment history and status
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-1">
          {vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-4 bg-indigo-50 rounded-full mb-4">
                <ClipboardList className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vouchers Available</h3>
              <p className="text-gray-500 max-w-md">
                Currently there are no fee vouchers associated with your account.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="pl-6 pr-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Voucher ID
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        Amount
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        Month
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-gray-400" />
                        Year
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Due Date
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vouchers.map((voucher) => (
                    <tr key={voucher._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {voucher.voucherId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">
                          {voucher.amount ? voucher.amount.toFixed(2) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {voucher.month || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {voucher.year || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {voucher.dueDate
                            ? new Date(voucher.dueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          voucher.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : voucher.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getStatusIcon(voucher.status)}
                          {voucher.status ? voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1) : 'Unknown'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeStatus;