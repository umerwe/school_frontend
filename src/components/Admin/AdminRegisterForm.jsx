import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import {
  LockClosedIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingLibraryIcon,
  CloudArrowUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    instituteName: '',
    email: '',
    password: ''
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    instituteName: '',
    email: '',
    password: '',
    logo: ''
  });
  const [success, setSuccess] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  // Subtle background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateBackground(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'File is too large. Maximum allowed size is 10MB'
        }));
        setLogo(null);
        setLogoPreview(null);
      } else {
        setErrors(prev => ({ ...prev, logo: '' }));
        setLogo(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.instituteName.trim()) {
      newErrors.instituteName = 'Institute name is required';
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, and special char';
      valid = false;
    }

    if (!logo) {
      newErrors.logo = 'Please upload a logo';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    payload.append('instituteName', formData.instituteName);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    if (logo) payload.append('logo', logo);

    try {

      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_API_BASE_URL_PROD
          : import.meta.env.VITE_API_BASE_URL_LOCAL;

      setLoading(true);
      setLoading(true);
      await axios.post(
        `${baseUrl}/auth/register-admin`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      message.success('Admin Registration Successfully!');

      setSuccess(true);
      setTimeout(() => {
        setFormData({ instituteName: '', email: '', password: '' });
        setLogo(null);
        setLogoPreview(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Registration failed';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[94vh] pb-10 flex items-center justify-center p-4  bg-gradient-to-br from-indigo-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-64 h-64 rounded-full bg-indigo-500 opacity-5 transition-all duration-5000 ease-in-out ${animateBackground ? 'translate-x-10 translate-y-10' : '-translate-x-6 -translate-y-6'}`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-600 opacity-5 transition-all duration-5000 ease-in-out ${animateBackground ? '-translate-x-10 -translate-y-10' : 'translate-x-6 translate-y-6'}`}></div>
        <div className={`absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-indigo-400 opacity-5 transition-all duration-3000 ease-in-out ${animateBackground ? 'scale-110' : 'scale-100'}`}></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden transform transition-all duration-500 hover:shadow-2xl z-10">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <div className="flex items-center mb-8 transition-all duration-300 hover:translate-x-1">
            <AcademicCapIcon className="h-10 w-10 text-amber-500 -rotate-[25deg]" />
            <span
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="text-[25px] font-extrabold text-indigo-700 tracking-wide mt-1"
            >
              eSchool.
            </span>
          </div>
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <CheckCircleIcon className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Registration Successful!</h3>
              <Link
                to="/"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors transform hover:scale-105 active:scale-95 duration-200"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Institute Name */}
              <div className="transform transition duration-200 hover:translate-y-px">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingLibraryIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-md border ${errors.instituteName ? 'border-red-500' : 'border-gray-300'} py-2.5 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition duration-200`}
                    placeholder="Institute Name"
                  />
                </div>
                {errors.instituteName && <p className="text-red-500 text-xs mt-1">{errors.instituteName}</p>}
              </div>

              {/* Email */}
              <div className="transform transition duration-200 hover:translate-y-px">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} py-2.5 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition duration-200`}
                    placeholder="Email Address"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="transform transition duration-200 hover:translate-y-px">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} py-2.5 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition duration-200`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity duration-200"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5 text-indigo-400 hover:text-indigo-600" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5 text-indigo-400 hover:text-indigo-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Logo Upload */}
              <div className="transform transition duration-200 hover:scale-[1.01]">
                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 ${errors.logo ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md cursor-pointer bg-white hover:bg-indigo-50 transition duration-300 ${logoPreview ? 'border-indigo-300 bg-indigo-50' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 text-center">
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-2 text-xs text-indigo-600">Logo selected</div>
                      </div>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-8 h-8 mb-2 text-indigo-400" />
                        <p className="text-sm text-indigo-500">Upload Logo (SVG, PNG, JPG)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium transition-all duration-300 transform hover:translate-y-px hover:shadow-md flex items-center justify-center gap-2 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side - Promotional Poster */}
        <div className="hidden md:flex w-1/2  bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 flex-col justify-between relative overflow-hidden">
          {/* Background abstract shapes */}
          <div className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-400 opacity-20 transition-transform duration-3000 ease-in-out ${animateBackground ? 'scale-110' : 'scale-100'}`}></div>
          <div className={`absolute -top-8 -left-8 w-40 h-40 rounded-full bg-indigo-300 opacity-20 transition-transform duration-3000 ease-in-out ${animateBackground ? 'scale-90' : 'scale-100'}`}></div>

          <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
            <h2 className="text-3xl font-bold mb-4 transform transition duration-500 hover:translate-y-px">Join eSchool</h2>
            <p className="text-indigo-100 text-base max-w-xs mb-6">
              Streamline institute management and empower your digital classroom.
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
    </div>
  );
}
