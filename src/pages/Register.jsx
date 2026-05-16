import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import { registrationSchema } from '../utils/validators'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { APP_NAME } from '../utils/config'
import { 
  CheckIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CalendarIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { FaGoogle, FaLinkedin } from 'react-icons/fa'

export default function Register() {
  const navigate = useNavigate()
  const { register: authRegister, loading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data) => {
    try {
      await authRegister({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      })
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(error || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Editorial, minimal visual storytelling */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50">
        {/* Subtle texture instead of gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo and back link */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                JT
              </div>
              <span className="font-medium text-gray-900 tracking-tight">{APP_NAME}</span>
            </Link>
          </div>

          {/* Main content - editorial, story-driven */}
          <div className="max-w-sm mx-auto">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm mb-8">
                <SparklesIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Join 50,000+ job seekers</span>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
                Start tracking your job search like a pro
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Used by engineers, product managers, and designers at companies like Stripe, Notion, and Linear.
              </p>
            </div>

            {/* Stats - clean, no gradients */}
            <div className="grid grid-cols-3 gap-3 mb-12">
              <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">47K+</div>
                <div className="text-xs text-gray-400">applications</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">73%</div>
                <div className="text-xs text-gray-400">faster tracking</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">892</div>
                <div className="text-xs text-gray-400">offers landed</div>
              </div>
            </div>

            {/* Features - minimal list */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-2">What you get:</p>
              {[
                'AI-powered job description parsing',
                'Centralized application tracking',
                'Interview preparation tools',
                'Performance analytics dashboard'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <CheckIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-xs text-gray-400">
            <p>Trusted by job seekers at top tech companies worldwide.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Clean form, premium feel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile back link */}
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                JT
              </div>
              <span className="font-medium text-gray-900 tracking-tight">{APP_NAME}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name fields - side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 ${
                    errors.firstName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 ${
                    errors.lastName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password with toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 pr-10 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password with toggle */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 pr-10 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Terms agreement */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agree"
                className="mt-0.5 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900/20"
                required
              />
              <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed">
                By creating an account, I agree to the{' '}
                <Link to="/terms" className="text-gray-900 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gray-900 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <FaGoogle className="w-4 h-4" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
          </form>

          {/* Help text */}
          <p className="mt-6 text-center text-xs text-gray-400">
            No credit card required. Free plan includes all core features.
          </p>
        </div>
      </div>
    </div>
  )
}