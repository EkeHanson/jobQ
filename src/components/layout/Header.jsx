import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import { Link, useNavigate } from 'react-router-dom'
import { Bars3Icon, BellIcon, UserCircleIcon, Cog6ToothIcon, CreditCardIcon, StarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toggleSidebar, toggleSidebarCollapse } from '../../store/uiSlice'
import NotificationBell from '../notifications/NotificationBell'
import subscriptionService from '../../services/subscription'
import { APP_NAME } from '../../utils/config'

export default function Header() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const dispatch = useDispatch()
  const navigatecls = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)

  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subData = await subscriptionService.getMySubscription()
        setCurrentSubscription(subData)
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      }
    }
    fetchSubscription()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className="hidden lg:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="hidden sm:inline font-semibold text-gray-900">{APP_NAME}</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <NotificationBell />

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium text-sm">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.first_name}</span>
            </button>

            {showMenu && (
              <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {currentSubscription?.plan && (
                    <p className="text-xs text-primary-600 mt-1">
                      {currentSubscription.plan.name} Plan {currentSubscription.active ? '(Active)' : ''}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    to="/reviews"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <StarIcon className="w-5 h-5" />
                    Reviews
                  </Link>
                  <Link
                    to="/subscription"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    Subscription
                  </Link>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
