import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PrivateRoute from './PrivateRoute'

// Common
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import NotFound from '../pages/NotFound'

// Footer pages
import Features from '../pages/Features'
import About from '../pages/About'
import Insights from '../pages/Insights'
import Contact from '../pages/Contact'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import Security from '../pages/Security'
import Demo from '../pages/Demo'

// Lazy loaded
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Applications = lazy(() => import('../pages/Applications'))
const AIPaste = lazy(() => import('../pages/AIPaste'))
const Jobs = lazy(() => import('../pages/Jobs'))
const JobDetails = lazy(() => import('../pages/JobDetails'))
const Profile = lazy(() => import('../pages/Profile'))
const Settings = lazy(() => import('../pages/Settings'))
const JobMatch = lazy(() => import('../pages/JobMatch'))
const Subscription = lazy(() => import('../pages/Subscription'))
const Analytics = lazy(() => import('../pages/Analytics'))
const Reviews = lazy(() => import('../pages/Reviews'))
const InterviewPrep = lazy(() => import('../pages/InterviewPrep'))
const PublicView = lazy(() => import('../pages/PublicView'))

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  </div>
)

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:slug" element={<Insights />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/security" element={<Security />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/public/:slug" element={<PublicView />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/applications"
          element={
            <Suspense fallback={<Loading />}>
              <Applications />
            </Suspense>
          }
        />
        <Route
          path="/jobs"
          element={
            <Suspense fallback={<Loading />}>
              <Jobs />
            </Suspense>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <Suspense fallback={<Loading />}>
              <JobDetails />
            </Suspense>
          }
        />
        <Route
          path="/ai-paste"
          element={
            <Suspense fallback={<Loading />}>
              <AIPaste />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="/subscription"
          element={
            <Suspense fallback={<Loading />}>
              <Subscription />
            </Suspense>
          }
        />
        <Route
          path="/reviews"
          element={
            <Suspense fallback={<Loading />}>
              <Reviews />
            </Suspense>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <Suspense fallback={<Loading />}>
              <InterviewPrep />
            </Suspense>
          }
        />
        <Route
          path="/interview-prep/:id"
          element={
            <Suspense fallback={<Loading />}>
              <InterviewPrep />
            </Suspense>
          }
        />
        <Route
          path="/job-match"
          element={
            <Suspense fallback={<Loading />}>
              <JobMatch />
            </Suspense>
          }
        />
      </Route>

      {/* Catch 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
