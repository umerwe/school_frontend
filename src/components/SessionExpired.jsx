import { Button } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { LockOutlined } from '@ant-design/icons';

export default function SessionExpired() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear auth state
    dispatch(logout());
    
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  }, [dispatch]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-indigo-700 p-6 text-center text-amber-400">
          <LockOutlined className="text-white text-4xl mb-4" />
          <h1 className="text-2xl font-bold text-white">Session Expired</h1>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-8 text-lg">
            Your session has expired due to inactivity. For security reasons, please login again to continue.
          </p>
          
          <Button 
            type="primary" 
            size="large"
            className="w-full max-w-xs h-12 text-lg font-medium"
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
            }}
            onClick={() => window.location.href = '/'}
            icon={<LockOutlined className="text-indigo-100" />}
          >
            Return to Login
          </Button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Having trouble? Contact uemyy1@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}