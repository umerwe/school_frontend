// src/components/SessionExpired.jsx
import { Button } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';

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
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Session Expired</h1>
        <p className="mb-6">Your session has expired. Please login again to continue.</p>
        <Button 
          type="primary" 
          size="large"
          onClick={() => window.location.href = '/'}
        >
          Go to Login Page
        </Button>
      </div>
    </div>
  );
}