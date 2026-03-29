import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import { UserCircleIcon, EnvelopeIcon, DocumentTextIcon, SparklesIcon, ChartBarIcon, Cog6ToothIcon, CreditCardIcon, WrenchScrewdriverIcon, DocumentMagnifyingGlassIcon, BellAlertIcon } from '@heroicons/react/24/outline'

const sections = [
  // {
  //   name: 'Users',
  //   description: 'Manage registered users and account suspensions.',
  //   to: '/admin/users',
  //   icon: UserCircleIcon,
  //   color: 'from-blue-500 to-indigo-600',
  //   bgColor: 'bg-blue-50',
  //   textColor: 'text-blue-600',
  // },
  {
    name: 'Contact Messages',
    description: 'Review inbound contact requests from the website.',
    to: '/admin/contacts',
    icon: EnvelopeIcon,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  // {
  //   name: 'Blog Posts',
  //   description: 'Review and moderate blog content published on Insights.',
  //   to: '/admin/blog',
  //   icon: DocumentTextIcon,
  //   color: 'from-purple-500 to-pink-600',
  //   bgColor: 'bg-purple-50',
  //   textColor: 'text-purple-600',
  // },
  {
    name: 'Subscribers',
    description: 'See newsletter subscribers and manage their status.',
    to: '/admin/subscribers',
    icon: SparklesIcon,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  // {
  //   name: 'Notifications',
  //   description: 'Manage system notifications sent to users.',
  //   to: '/admin/notifications',
  //   icon: BellAlertIcon,
  //   color: 'from-red-500 to-rose-600',
  //   bgColor: 'bg-red-50',
  //   textColor: 'text-red-600',
  // },
  // {
  //   name: 'Applications',
  //   description: 'Review all applications across users.',
  //   to: '/admin/applications',
  //   icon: DocumentMagnifyingGlassIcon,
  //   color: 'from-cyan-500 to-blue-600',
  //   bgColor: 'bg-cyan-50',
  //   textColor: 'text-cyan-600',
  // },
  {
    name: 'Job Listings',
    description: 'Inspect jobs and companies exposed through the API.',
    to: '/admin/jobs',
    icon: WrenchScrewdriverIcon,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  // {
  //   name: 'Profiles',
  //   description: 'Review user profiles stored in the system.',
  //   to: '/admin/profiles',
  //   icon: UserCircleIcon,
  //   color: 'from-teal-500 to-cyan-600',
  //   bgColor: 'bg-teal-50',
  //   textColor: 'text-teal-600',
  // },
  // {
  //   name: 'Subscription Plans',
  //   description: 'Review available subscription tiers.',
  //   to: '/admin/subscriptions',
  //   icon: CreditCardIcon,
  //   color: 'from-green-500 to-emerald-600',
  //   bgColor: 'bg-green-50',
  //   textColor: 'text-green-600',
  // },
  // {
  //   name: 'Analytics',
  //   description: 'View visitor and traffic analytics from the dashboard.',
  //   to: '/analytics',
  //   icon: ChartBarIcon,
  //   color: 'from-indigo-500 to-blue-600',
  //   bgColor: 'bg-indigo-50',
  //   textColor: 'text-indigo-600',
  // },
  // {
  //   name: 'Subscription',
  //   description: 'Review current plan and available subscription tiers. QWERTY',
  //   to: '/subscription',
  //   icon: CreditCardIcon,
  //   color: 'from-pink-500 to-rose-600',
  //   bgColor: 'bg-pink-50',
  //   textColor: 'text-pink-600',
  // },
]

const quickStats = [
  {
    name: 'Total Users',
    to: '/admin/users',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/30',
  },
  {
    name: 'Blog Posts',
    to: '/admin/blog',
    color: 'from-purple-500 to-pink-600',
    shadow: 'shadow-purple-500/30',
  },
  {
    name: 'Subscriptions',
    to: '/admin/subscriptions',
    color: 'from-green-500 to-emerald-600',
    shadow: 'shadow-green-500/30',
  },
  // {
  //   name: 'Applications',
  //   to: '/admin/applications',
  //   color: 'from-amber-500 to-orange-600',
  //   shadow: 'shadow-amber-500/30',
  // },
]

export default function AdminPanel() {
  return (
    <AdminLayout>
      <div className="space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-3 text-base sm:text-lg max-w-2xl">
            This admin section brings the Django admin functionality into the React application.
            Use the links below to manage users, contact messages, blog content, subscribers, and more.
          </p>
        </div>

        {/* Quick Stats - Clickable Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.to}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg ${stat.shadow} hover:opacity-90 transition-opacity cursor-pointer`}
            >
              <p className="text-sm font-medium text-white/80">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">Manage →</p>
            </Link>
          ))}
        </div>

        {/* Admin Sections Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.name}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 ${section.textColor}`} />
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{section.description}</p>
                
                <Link to={section.to}>
                  <Button className={`w-full justify-center bg-gradient-to-r ${section.color} hover:opacity-90 text-white shadow-md`}>
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-lg shadow-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Important</h2>
              <p className="mt-2 text-sm leading-6 text-amber-50">
                Some admin features require Django staff permissions. If you are not seeing data, make sure
                you are authenticated as an admin user and that the backend user account has staff privileges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
