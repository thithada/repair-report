import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword || confirmPassword === '');
  }, [password, confirmPassword]);

  useEffect(() => {
    const checkEmail = async () => {
      if (email.trim() === '' || !isValidEmail(email)) {
        setIsEmailAvailable(true);
        return;
      }
      try {
        const response = await api.post('/auth/check-email', { email });
        setIsEmailAvailable(response.data.available);
        if (!response.data.available) {
          toast.warn(response.data.message);
        }
      } catch (error) {
        console.error('Email check error:', error);
        setIsEmailAvailable(true); // Assume available in case of error
        toast.error('เกิดข้อผิดพลาดในการตรวจสอบอีเมล');
      }
    };

    const debounce = setTimeout(() => {
      checkEmail();
    }, 500);

    return () => clearTimeout(debounce);
  }, [email]);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@up\.ac\.th$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', { email, password });
      console.log('Registration response:', response.data);
      toast.success('ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดระหว่างการลงทะเบียน กรุณาลองอีกครั้ง';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const isFormValid = () => {
    return isValidEmail(email) && 
           password.trim() !== '' && 
           confirmPassword.trim() !== '' && 
           passwordsMatch && 
           isEmailAvailable;
  };


  return (
    <>
    <Navbar />
    
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">สมัครสมาชิก</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">อีเมล (@up.ac.th):</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded ${!isEmailAvailable || (email && !isValidEmail(email)) ? 'border-red-500' : ''}`}
          />
          {!isEmailAvailable && <p className="text-red-500 text-sm mt-1">อีเมลนี้ถูกใช้แล้ว</p>}
          {email && !isValidEmail(email) && <p className="text-red-500 text-sm mt-1">กรุณาใช้อีเมล @up.ac.th เท่านั้น</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">รหัสผ่าน:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">ยืนยันรหัสผ่าน:</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded ${!passwordsMatch ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {!passwordsMatch && <p className="text-red-500 text-sm mt-1">รหัสผ่านไม่ตรงกัน</p>}
        </div>
        <button 
          type="submit" 
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${(!isFormValid() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Register;