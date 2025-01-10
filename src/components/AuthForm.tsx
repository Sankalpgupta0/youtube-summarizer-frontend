import React, { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import { toast } from 'react-hot-toast';
import { IoMdLogIn } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(() => {
    const stored = localStorage.getItem('isSignUp');
    return stored ? JSON.parse(stored) : false;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const { signInEmailPassword, isLoading: isSignInLoading } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: isSignUpLoading } = useSignUpEmailPassword();

  const isLoading = isSignInLoading || isSignUpLoading;

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (isSignUp && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        const { error } = await signUpEmailPassword(email, password);
        if (error) throw error;
        toast.success('Account created successfully! You can now sign in.', {
          id: 'signup-success',
          duration: 3000,
        });
        setIsSignUp(false);
      } else {
        const { error } = await signInEmailPassword(email, password);
        if (error) throw error;
        localStorage.setItem('isLogin', 'true');
        toast.success('Signed in successfully!', {
          id: 'signin-success',
          duration: 3000,
          position: 'top-center',
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      localStorage.setItem('isLogin', 'false');
      const errorMessage = error.message || 'An error occurred. Please try again.';
      toast.error(errorMessage, {
        id: 'auth-error',
        duration: 4000,
      });
    }
  };

  const addUserInNhostDB = async () => {
    
  };

  const handleAuthTypeChange = (value: boolean) => {
    setIsSignUp(value);
    localStorage.setItem('isSignUp', JSON.stringify(value));
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600">
          {isSignUp 
            ? 'Sign up to start summarizing videos'
            : 'Sign in to access your summaries'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMailBulk className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`pl-10 w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
              placeholder="you@example.com"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center  pointer-events-none">
              <CiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`pl-10 w-full rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter your password"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
            {isSignUp && (
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters long
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? 
                <IoMdEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              }
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          ) : isSignUp ? (
            <>
              <FiUserPlus className="w-5 h-5 mr-2" />
              Create Account
            </>
          ) : (
            <>
              <IoMdLogIn className="w-5 h-5 mr-2" />
              Sign In
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => handleAuthTypeChange(!isSignUp)}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}