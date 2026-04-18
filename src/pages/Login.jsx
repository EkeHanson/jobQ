import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import { loginSchema } from '../utils/validators'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { APP_NAME } from '../utils/config'
import { CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { FaLinkedin } from 'react-icons/fa'
import authService from '../services/auth'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '773400491834-4nm9tdgvh2ghehj1di55gpcmten1coqg.apps.googleusercontent.com'

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loading, error } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [twoFactorEmail, setTwoFactorEmail] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const googleButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: register2FA,
    handleSubmit: handleSubmit2FA,
    formState: { errors: errors2FA },
  } = useForm()

  // Initialize Google OAuth button
  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleButton
    document.body.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [])

  const initializeGoogleButton = () => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        ux_mode: 'popup',
      })
      
      // Render the Google button
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }
  }

  const getDestinationPath = (user) => {
    return user?.is_staff || user?.is_superuser ? '/admin' : '/dashboard'
  }

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      setGoogleLoading(true)
      try {
        const action = await loginWithGoogle(response.credential)
        const payload = action?.payload ?? action
        toast.success('Google login successful!')
        navigate(getDestinationPath(payload?.user))
      } catch (err) {
        toast.error('Google login failed. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      // Ensure rememberMe is properly converted to boolean
      // react-hook-form checkbox returns true when checked, undefined when unchecked
      const rememberMe = Boolean(data.rememberMe)
      console.log('Remember me value:', rememberMe, 'Raw:', data.rememberMe)
      const action = await login({ identifier: data.identifier, password: data.password, rememberMe })
      const response = action?.payload ?? action
      
      // Check if 2FA is required
      if (response?.require_2fa) {
        setTwoFactorRequired(true)
        setTwoFactorEmail(response.email)
        toast.success(response.message || 'Verification code sent to your email')
        return
      }
      
      toast.success('Login successful!')
      navigate(getDestinationPath(response?.user))
    } catch (err) {
      const isTimeoutError = err?.message?.toLowerCase().includes('timed out')
      const errorMessage =
        err?.response?.data?.detail ||
        (isTimeoutError
          ? 'Login request timed out. Please check your network and try again.'
          : err?.message) ||
        'Login failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  const onVerifyTwoFactor = async (data) => {
    try {
      setTwoFactorLoading(true)
      await authService.verifyTwoFactor(twoFactorEmail, data.token, data.rememberMe)
      toast.success('Login successful!')
      const savedUser = JSON.parse(localStorage.getItem('user'))
      navigate(getDestinationPath(savedUser))
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Invalid verification code. Please try again.'
      toast.error(errorMessage)
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setTwoFactorRequired(false)
    setTwoFactorEmail('')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-brand-500 to-accent-600" />
        <div className="absolute inset-0 floating-shapes opacity-30" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                J
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-white/80 text-lg mb-8">
              Sign in to continue your job search journey and track your applications with AI-powered insights.
            </p>

            {/* Features List */}
            <div className="space-y-4 text-left">
              {[
                'AI-powered job extraction',
                'Real-time application tracking',
                'Smart interview reminders',
                'Advanced analytics dashboard'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                J
              </div>
              <span className="font-bold text-2xl text-gray-900">{APP_NAME}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-semibold">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Form */}
          {twoFactorRequired ? (
            <form className="space-y-5" onSubmit={handleSubmit2FA(onVerifyTwoFactor)}>
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to login
              </button>

              {/* 2FA Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-2 text-gray-600">
                  Enter the 6-digit code sent to your email
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {twoFactorEmail}
                </p>
              </div>

              <div className="space-y-1">
                <Input
                  label="Verification Code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  {...register2FA('token')}
                  error={errors2FA?.token?.message}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me-2fa"
                  name="rememberMe"
                  type="checkbox"
                  {...register2FA('rememberMe')}
                  className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500/20"
                />
                <label htmlFor="remember-me-2fa" className="ml-2 block text-sm text-gray-700">
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={twoFactorLoading}
                className="btn-gradient w-full py-4 rounded-xl font-semibold text-lg shadow-xl shadow-primary-500/25"
              >
                {twoFactorLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" className="text-white" />
                    Verifying...
                  </span>
                ) : (
                  'Verify'
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Input
                label="Email or Username"
                type="text"
                placeholder="name@example.com or johndoe"
                {...register('identifier')}
                error={errors.identifier?.message}
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                showPasswordToggle={true}
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-4 rounded-xl font-semibold text-lg shadow-xl shadow-primary-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div ref={googleButtonRef} className="w-full"></div>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed opacity-50"
              >
                <FaLinkedin className="w-5 h-5" />
                LinkedIn
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
