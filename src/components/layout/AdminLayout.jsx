import { NavLink, Link } from 'react-router-dom'
import { APP_NAME, APP_VERSION } from '../../utils/config'
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BriefcaseIcon,
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  EnvelopeIcon,
  BellIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { toggleSidebar, toggleSidebarCollapse } from '../../store/uiSlice'
import { cn } from '../../utils/helpers'

const adminNavigation = [
  { name: 'Dashboard', to: '/admin', icon: HomeIcon },
  { name: 'Users', to: '/admin/users', icon: UsersIcon },
  { name: 'Blog', to: '/admin/blog', icon: DocumentTextIcon },
  { name: 'Subscriptions', to: '/admin/subscriptions', icon: CreditCardIcon },
  { name: 'Jobs', to: '/admin/jobs', icon: BriefcaseIcon },
  { name: 'Applications', to: '/admin/applications', icon: DocumentMagnifyingGlassIcon },
  { name: 'Profiles', to: '/admin/profiles', icon: UserGroupIcon },
  { name: 'Contacts', to: '/admin/contacts', icon: EnvelopeIcon },
  { name: 'Subscribers', to: '/admin/subscribers', icon: EnvelopeIcon },
  { name: 'Notifications', to: '/admin/notifications', icon: BellIcon },
]

export default function AdminLayout({ children }) {
  const { sidebar } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const { user } = useAuth()
  const isCollapsed = sidebar.isCollapsed

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex lg:flex-col bg-gray-900/95 backdrop-blur-xl text-white transition-all duration-300 border-r border-gray-800/50",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800/50">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-red-500/25">
              A
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold whitespace-nowrap">Admin Panel</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                  isCollapsed && 'justify-center px-3'
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                !isCollapsed && "group-hover:scale-110"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="px-3 py-4 border-t border-gray-800/50">
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 w-full transition-all duration-200',
              isCollapsed && 'justify-center px-3'
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        <div className="px-4 py-4 border-t border-gray-800/50">
          {!isCollapsed && (
            <>
              <p className="text-xs text-gray-500">{APP_NAME} Admin</p>
              <p className="text-xs text-gray-500 mt-1">v{APP_VERSION}</p>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebar.isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => dispatch(toggleSidebar())} />

          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl text-white flex flex-col border-r border-gray-800/50">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-red-500/25">
                  A
                </div>
                <span className="text-lg font-semibold">Admin Panel</span>
              </div>
              <button onClick={() => dispatch(toggleSidebar())} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1.5">
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.to === '/admin'}
                  onClick={() => dispatch(toggleSidebar())}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="px-4 py-4 border-t border-gray-800/50">
              <p className="text-xs text-gray-500">{APP_NAME} Admin</p>
              <p className="text-xs text-gray-500 mt-1">v{APP_VERSION}</p>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 lg:${isCollapsed ? 'ml-20' : 'ml-64'} ml-0`}>
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Manage your application</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.username || 'Admin'}</span>
              </span>
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Exit Admin
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto scrollbar-thin">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
