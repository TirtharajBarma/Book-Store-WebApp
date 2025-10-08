import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Key, LogIn, UserPlus } from 'lucide-react'

const AuthForm = ({ 
  mode = 'login', // 'login' or 'signup'
  onSubmit, 
  onGoogleLogin,
  error 
}) => {
  const isLogin = mode === 'login';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e) => {
    setIsSubmitting(true);
    // Call the parent's onSubmit (parent handles preventDefault)
    onSubmit(e);
    // Reset after 3 seconds (typical operation time)
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  const handleGoogleClick = () => {
    setIsGoogleLoading(true);
    onGoogleLogin();
    // Reset after 3 seconds
    setTimeout(() => setIsGoogleLoading(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Animated Background Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 animate-pulse"></div>
          
          {/* Main Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                {isLogin ? (
                  <LogIn className="text-white" size={28} />
                ) : (
                  <UserPlus className="text-white" size={28} />
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-500">
                {isLogin ? 'Sign in to continue to your account' : 'Sign up to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Sign Up only) */}
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                    placeholder="Full Name"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                  placeholder="Email address"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                  placeholder="Password"
                />
              </div>

              {/* Admin Key (Sign Up only) */}
              {!isLogin && (
                <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none">
                    <Key className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="adminKey"
                    name="adminKey"
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800"
                    placeholder="Admin Secret Key (Optional)"
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Leave empty for regular user account
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Please wait...
                  </>
                ) : isLogin ? (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>

              {/* Toggle Link */}
              <p className="text-center text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link
                  to={isLogin ? '/sign-up' : '/login'}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleClick}
              type="button"
              disabled={isGoogleLoading || isSubmitting}
              className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  Please wait...
                </>
              ) : (
                <>
                  <img
                    src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </>
              )}
            </button>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
