import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { notification, message } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/userSlice';
import {
    LockClosedIcon,
    AcademicCapIcon,
    EyeIcon,
    EyeSlashIcon,
    UserCircleIcon,
    UserIcon,
    UserGroupIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const roleConfig = {
    admin: {
        label: 'Institute Name / Email',
        placeholder: 'Enter Institute Name or Email',
        icon: <UserCircleIcon className="h-5 w-5" />
    },
    teacher: {
        label: 'Teacher ID / Email',
        placeholder: 'Enter Teacher ID or Email',
        icon: <UserIcon className="h-5 w-5" />
    },
    student: {
        label: 'Roll Number / Email',
        placeholder: 'Enter Roll Number or Email',
        icon: <UserGroupIcon className="h-5 w-5" />
    },
    parent: {
        label: 'Parent Email',
        placeholder: 'Enter Parent Email',
        icon: <UsersIcon className="h-5 w-5" />
    },
};

export default function LoginForm() {
    const dispatch = useDispatch();
    const user = useSelector(store => store.userSlice.user);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('admin');
    const [formData, setFormData] = useState({ instituteNameOrEmail: "", password: "" });
    const [errors, setErrors] = useState({ instituteNameOrEmail: "", password: "" });
    const navigate = useNavigate();
    const currentConfig = roleConfig[selectedRole];
    const [animateBackground, setAnimateBackground] = useState(false);

    // Subtle background animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimateBackground(prev => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Redirect based on user role
    if (user?.role === 'admin') {
        return <Navigate to="/admin-dashboard" />;
    } else if (user?.role === 'teacher') {
        return <Navigate to="/teacher-dashboard" />;
    } else if (user?.role === 'student') {
        return <Navigate to="/student-dashboard" />;
    } else if (user?.role === 'parent') {
        return <Navigate to="/parent-dashboard" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.instituteNameOrEmail.trim()) newErrors.instituteNameOrEmail = 'Field is required';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(formData.password)) {
            newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, and special char';
        }
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const payload = {};
        if (selectedRole === 'admin') {
            payload['instituteNameOrEmail'] = formData.instituteNameOrEmail;
            payload.password = formData.password;
        } else if (selectedRole === 'teacher') {
            payload['teacherIdOrEmail'] = formData.instituteNameOrEmail;
            payload.password = formData.password;
        } else if (selectedRole === 'student') {
            payload['rollNumberOrEmail'] = formData.instituteNameOrEmail;
            payload.password = formData.password;
        } else if (selectedRole === 'parent') {
            payload['email'] = formData.instituteNameOrEmail;
            payload.password = formData.password;
        }

        try {
            const baseUrl =
                import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL_LOCAL;

            const { data } = await axios.post(
                `${baseUrl}/auth/login-${selectedRole}`,
                payload,
                { withCredentials: true }
            );
            message.success('Logged in successfully!');
            const user = data.data[selectedRole];

            dispatch(login(user));

            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (user.role === 'teacher') {
                navigate('/teacher-dashboard');
            } else if (user.role === 'student') {
                navigate('/student-dashboard');
            } else if (user.role === 'parent') {
                navigate('/parent-dashboard');
            }
        } catch (err) {
            message.error(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-gray-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-0 w-64 h-64 rounded-full bg-indigo-500 opacity-5 transition-all duration-5000 ease-in-out ${animateBackground ? 'translate-x-10 translate-y-10' : '-translate-x-6 -translate-y-6'}`}></div>
                <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-600 opacity-5 transition-all duration-5000 ease-in-out ${animateBackground ? '-translate-x-10 -translate-y-10' : 'translate-x-6 translate-y-6'}`}></div>
                <div className={`absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-indigo-400 opacity-5 transition-all duration-3000 ease-in-out ${animateBackground ? 'scale-110' : 'scale-100'}`}></div>
            </div>

            <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden transform transition-all duration-500 hover:shadow-2xl z-10">
                {/* Form Section - Always visible */}
                <div className="w-full lg:w-1/2 px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-6 bg-white">
                    <div className="flex items-center mb-6 transition-all duration-300 hover:translate-x-1">
                        <AcademicCapIcon className="h-10 w-10 text-amber-500 -rotate-[25deg]" />
                        <span
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                            className="text-2xl font-extrabold text-indigo-700 tracking-wide mt-1 ml-0.5"
                        >
                            eSchool.
                        </span>
                    </div>

                    {/* Role Selection - Improved responsive layout */}
                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 mb-6 md:mb-8">
                        {Object.keys(roleConfig).map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${selectedRole === role
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                                    }`}
                            >
                                {React.cloneElement(roleConfig[role].icon, {
                                    className: `h-5 w-5 mb-2 transition-colors ${selectedRole === role ? 'text-white' : 'text-indigo-600'}`
                                })}
                                <span className="text-xs font-medium capitalize">
                                    {role}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-3 w-full max-w-md mx-auto">
                        {/* Username/Email Field */}
                        <div>
                            <label htmlFor="instituteNameOrEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {currentConfig.label}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-[42px] mt-[1px]">
                                    {React.cloneElement(currentConfig.icon, { className: 'h-5 w-5 text-indigo-400' })}
                                </div>
                                <input
                                    id="instituteNameOrEmail"
                                    type="text"
                                    name="instituteNameOrEmail"
                                    value={formData.instituteNameOrEmail}
                                    onChange={handleChange}
                                    className={`pl-10 w-full rounded-lg border ${errors.instituteNameOrEmail ? 'border-red-500' : 'border-gray-300'} py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition duration-200`}
                                    placeholder={currentConfig.placeholder}
                                />
                            </div>
                            {errors.instituteNameOrEmail && (
                                <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">{errors.instituteNameOrEmail}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-[42px] mt-[1px]">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`pl-10 pr-10 w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition duration-200`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center h-[42px] mt-[1px]"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? (
                                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                    ) : (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">{errors.password}</p>}
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-600 mt-6 md:mt-8">
                        Don't have an account?{' '}
                        <Link to="/admin-register" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Right Side - Promotional Section - Hidden on mobile/tablet */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 flex-col justify-between relative overflow-hidden">
                    {/* Background abstract shapes */}
                    <div className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-500 opacity-20 transition-transform duration-3000 ease-in-out ${animateBackground ? 'scale-110' : 'scale-100'}`}></div>
                    <div className={`absolute -top-8 -left-8 w-40 h-40 rounded-full bg-indigo-400 opacity-20 transition-transform duration-3000 ease-in-out ${animateBackground ? 'scale-90' : 'scale-100'}`}></div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
                        <h2 className="text-3xl font-bold mb-6">Welcome to eSchool</h2>
                        <p className="text-indigo-100 text-base max-w-xs mb-8">
                            Transform your educational institution with our comprehensive management platform.
                        </p>
                        <div className="relative">
                                      <div className="absolute -inset-4 rounded-full bg-indigo-400 opacity-20 animate-pulse"></div>
                                      <AcademicCapIcon className="h-20 w-20 text-amber-400 relative z-10 transform transition duration-500 hover:rotate-12" />
                                    </div>
                    </div>
                    <div className="text-sm text-indigo-200 text-center z-10">
                        © 2025 eSchool. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                
                /* Add transition durations that aren't in Tailwind by default */
                .duration-3000 { transition-duration: 3000ms; }
                .duration-5000 { transition-duration: 5000ms; }
            `}</style>
        </div>
    );
}