import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import { loginSchema } from '../utils/validators'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { APP_NAME } from '../utils/config'
import { ChevronLeftIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { ShieldCheckIcon, DocumentTextIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/solid'
import { FaLinkedin } from 'react-icons/fa'
import authService from '../services/auth'

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

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleButton
    document.body.appendChild(script)
    return () => {}
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
    if (user?.is_staff || user?.is_superuser) return '/admin'
    if (user?.is_staff_poster) return '/job-poster-dashboard'
    return '/dashboard'
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
      const rememberMe = Boolean(data.rememberMe)
      const action = await login({ identifier: data.identifier, password: data.password, rememberMe })
      const response = action?.payload ?? action
      
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
      const errorMessage = err?.response?.data?.detail ||
        (isTimeoutError ? 'Login request timed out. Please check your network and try again.' : err?.message) ||
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
      const errorMessage = err?.response?.data?.detail || err?.message || 'Invalid verification code. Please try again.'
      toast.error(errorMessage)
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setTwoFactorRequired(false)
    setTwoFactorEmail('')
  }

  const benefits = [
    { icon: DocumentTextIcon, text: 'AI-powered job extraction' },
    { icon: ChartBarIcon, text: 'Real-time application tracking' },
    { icon: BellIcon, text: 'Smart interview reminders' },
    { icon: ShieldCheckIcon, text: 'Advanced analytics dashboard' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Panel - Brand/Value Proposition */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 border-r border-gray-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-between w-full p-12">
            {/* Logo */}
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                  JT
                </div>
                <span className="font-medium text-gray-900 tracking-tight">{APP_NAME}</span>
              </Link>
            </div>

            {/* Main content */}
            <div className="max-w-sm mx-auto">
              <div className="mb-8">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
                  Sign in to continue
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Access your job search dashboard, track applications, and get AI-powered insights.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <benefit.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Trusted by 50,000+ job seekers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Back to Home */}
            <div className="mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
              >
                <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to home
              </Link>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                  JT
                </div>
                <span className="font-medium text-gray-900 tracking-tight">{APP_NAME}</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Don't have an account?{' '}
                <Link to="/register" className="text-gray-900 font-medium hover:underline">
                  Create account
                </Link>
              </p>
            </div>

            {twoFactorRequired ? (
              <form onSubmit={handleSubmit2FA(onVerifyTwoFactor)} className="space-y-6">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-2"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back to login
                </button>

                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Two-factor authentication</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{twoFactorEmail}</p>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...register2FA('token')}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-center text-lg tracking-[0.5em] placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  {errors2FA?.token && (
                    <p className="text-xs text-red-500 mt-1">{errors2FA.token.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="remember-device"
                    type="checkbox"
                    {...register2FA('rememberMe')}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                  />
                  <label htmlFor="remember-device" className="text-sm text-gray-500">
                    Remember this device for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={twoFactorLoading}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {twoFactorLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" className="text-white" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify code'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Email or username"
                    {...register('identifier')}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  {errors.identifier && (
                    <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                    />
                    <span className="text-sm text-gray-500">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div ref={googleButtonRef} className="w-full [&>div]:!w-full [&>div>div]:!w-full [&>div>div>iframe]:!w-full" />
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
                  >
                    <FaLinkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                </div>
              </form>
            )}

            {/* Terms notice */}
            <p className="text-center text-xs text-gray-400 mt-8">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-gray-500 hover:text-gray-700">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}