import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '../../store/uiSlice'
import { cn } from '../../utils/helpers'

const navigation = [
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            J
          </div>
          <span className="text-lg font-semibold">JobTrack AI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-400">JobTrack AI v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebar.isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => dispatch(toggleSidebar())} />

          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                  J
                </div>
                <span className="text-lg font-semibold">JobTrack AI</span>
              </div>
              <button onClick={() => dispatch(toggleSidebar())}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => dispatch(toggleSidebar())}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="px-3 py-4 border-t border-gray-800">
              <p className="text-xs text-gray-400">JobTrack AI v1.0.0</p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
