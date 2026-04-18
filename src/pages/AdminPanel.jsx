import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import {
  UserGroupIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  DocumentMagnifyingGlassIcon,
  BellAlertIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const adminSections = [
  {
    title: 'User Management',
    description: 'Manage user accounts, permissions, and access control',
    items: [
      {
        name: 'Users',
        description: 'View and manage all registered users',
        to: '/admin/users',
        icon: UserGroupIcon,
        color: 'from-slate-600 to-slate-700',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-700',
        badge: 'Core'
      }
    ]
  },
  {
    title: 'Content & Communication',
    description: 'Manage website content, communications, and user engagement',
    items: [
      {
        name: 'Contact Messages',
        description: 'Review and respond to website inquiries',
        to: '/admin/contacts',
        icon: EnvelopeIcon,
        color: 'from-blue-600 to-blue-700',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        badge: 'Support'
      },
      {
        name: 'Blog Posts',
        description: 'Create and manage blog content',
        to: '/admin/blog',
        icon: DocumentTextIcon,
        color: 'from-purple-600 to-purple-700',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        badge: 'Content'
      },
      {
        name: 'Subscribers',
        description: 'Manage newsletter subscriptions',
        to: '/admin/subscribers',
        icon: SparklesIcon,
        color: 'from-amber-600 to-amber-700',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        badge: 'Marketing'
      },
      {
        name: 'Notifications',
        description: 'Send system-wide notifications',
        to: '/admin/notifications',
        icon: BellAlertIcon,
        color: 'from-red-600 to-red-700',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        badge: 'Communication'
      }
    ]
  },
  {
    title: 'Platform Operations',
    description: 'Monitor and manage platform data and operations',
    items: [
      {
        name: 'Job Listings',
        description: 'Review and moderate job postings',
        to: '/admin/jobs',
        icon: BuildingOfficeIcon,
        color: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        badge: 'Jobs'
      },
      {
        name: 'Applications',
        description: 'Monitor job applications and user activity',
        to: '/admin/applications',
        icon: DocumentMagnifyingGlassIcon,
        color: 'from-cyan-600 to-cyan-700',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-700',
        badge: 'Activity'
      },
      {
        name: 'User Profiles',
        description: 'Review and manage user profiles',
        to: '/admin/profiles',
        icon: ShieldCheckIcon,
        color: 'from-indigo-600 to-indigo-700',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        badge: 'Profiles'
      }
    ]
  },
  {
    title: 'Business & Analytics',
    description: 'Manage subscriptions, billing, and platform analytics',
    items: [
      {
        name: 'Subscriptions',
        description: 'Manage subscription plans and user billing',
        to: '/admin/subscriptions',
        icon: CreditCardIcon,
        color: 'from-emerald-600 to-emerald-700',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        badge: 'Revenue'
      },
      {
        name: 'Analytics',
        description: 'View platform usage and performance metrics',
        to: '/analytics',
        icon: ChartBarIcon,
        color: 'from-violet-600 to-violet-700',
        bgColor: 'bg-violet-50',
        textColor: 'text-violet-700',
        badge: 'Insights'
      }
    ]
  }
]

const quickActions = [
  {
    name: 'System Status',
    description: 'Check platform health and performance',
    icon: Cog6ToothIcon,
    color: 'from-gray-600 to-gray-700',
    action: () => {} // Placeholder for future implementation
  },
  {
    name: 'Recent Activity',
    description: 'View latest user and system activity',
    icon: ChartBarIcon,
    color: 'from-blue-600 to-blue-700',
    action: () => {} // Placeholder for future implementation
  },
  {
    name: 'Support Tickets',
    description: 'Manage user support requests',
    icon: EnvelopeIcon,
    color: 'from-green-600 to-green-700',
    action: () => {} // Placeholder for future implementation
  }
]

export default function AdminPanel() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage and monitor your platform operations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.name}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Admin Sections */}
          <div className="space-y-8">
            {adminSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.to}
                        className="group block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-5 h-5 ${item.textColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${item.color} text-white`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Administrative Access</h3>
                <p className="text-sm text-blue-700 mt-1">
                  All administrative actions are logged and monitored. Ensure you have the necessary permissions
                  before making changes to user data, content, or system settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}