import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { message } from 'antd';

const PaymentCanceled = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const voucherId = searchParams.get('voucherId');

    useEffect(() => {
        message.warning({
            content: 'Payment process was canceled',
            duration: 3,
            className: 'custom-message-warning'
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
                        <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Canceled</h2>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        The payment process for {voucherId ? `Voucher #${voucherId}` : 'your voucher'} 
                        was not completed. You can return to your vouchers and try again whenever you're ready.
                    </p>

                    <button
                        onClick={() => navigate('/parent-dashboard/fees')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Return to Vouchers
                    </button>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 text-center">
                    <p className="text-xs text-gray-500">
                        Need help? Contact our support team at support@schoolpay.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCanceled;