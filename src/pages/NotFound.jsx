import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { 
  FaceFrownIcon,
  ArrowLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Animated 404 Illustration */}
          <div className="relative mb-8">
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
              <FaceFrownIcon className="w-20 h-20 text-primary-400" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-accent-200 rounded-full opacity-50"></div>
          </div>

          {/* Error Code */}
          <h1 className="text-7xl font-black text-gray-900 mb-2 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link to="/" className="block">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
                <HomeIcon className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Go to Homepage</p>
              </div>
            </Link>
            <Link to="/jobs" className="block">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
                <MagnifyingGlassIcon className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Browse Jobs</p>
              </div>
            </Link>
            <Link to="/applications" className="block">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
                <DocumentTextIcon className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">My Applications</p>
              </div>
            </Link>
            <Link to="/dashboard" className="block">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
                <Squares2X2Icon className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Go back to previous page</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          JobQ - Your Job Search Companion
        </p>
      </div>
    </div>
  )
}
