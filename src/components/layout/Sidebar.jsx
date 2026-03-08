import { NavLink, Link } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar, toggleSidebarCollapse } from '../../store/uiSlice'
import { cn } from '../../utils/helpers'

const navigation = [
  { name: 'Home', to: '/', icon: GlobeAltIcon },
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Applications', to: '/applications', icon: DocumentTextIcon },
  { name: 'Jobs', to: '/jobs', icon: DocumentTextIcon },
  { name: 'AI Paste', to: '/ai-paste', icon: SparklesIcon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
  { name: 'Profile', to: '/profile', icon: UserIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  { name: 'Subscription', to: '/subscription', icon: CreditCardIcon },
]

export default function Sidebar() {
  const { sidebar } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const isCollapsed = sidebar.isCollapsed

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex lg:flex-col bg-gray-900/95 backdrop-blur-xl text-white transition-all duration-300 border-r border-gray-800/50",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-primary-500/25">
              J
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold whitespace-nowrap">JobTrack<span className="text-gradient">AI</span></span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/25'
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
            <p className="text-xs text-gray-500">JobTrack AI v1.0.0</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary-500/25">
                  J
                </div>
                <span className="text-lg font-semibold">JobTrack<span className="text-gradient">AI</span></span>
              </div>
              <button onClick={() => dispatch(toggleSidebar())} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1.5">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => dispatch(toggleSidebar())}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/25'
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
              <p className="text-xs text-gray-500">JobTrack AI v1.0.0</p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
