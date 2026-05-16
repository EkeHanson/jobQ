import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import usersService from '../services/users'
import Spinner from '../components/common/Spinner'
import { 
  ArrowLeftIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftIcon, 
  GiftIcon, 
  TrophyIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { APP_NAME } from '../utils/config'

export default function PublicView() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchPublicProfile()
  }, [slug])

  const fetchPublicProfile = async () => {
    try {
      const data = await usersService.getPublicProfileBySlug(slug)
      setProfile(data)
    } catch (err) {
      setError('Profile not found or is not public')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-7xl font-light text-gray-200 mb-4">404</div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-400 text-sm mb-8">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  // Determine which stats to show based on user preferences
  const visibleStats = [
    { 
      key: 'applications', 
      label: 'Applications', 
      value: profile.stats.total_applications,
      show: profile.show_applications_count,
      icon: BriefcaseIcon,
      color: 'gray'
    },
    { 
      key: 'interviews', 
      label: 'Interviews', 
      value: profile.stats.interviews,
      show: profile.show_interviews_count,
      icon: ChatBubbleLeftIcon,
      color: 'gray'
    },
    { 
      key: 'offers', 
      label: 'Offers', 
      value: profile.stats.offers,
      show: profile.show_offers_count,
      icon: GiftIcon,
      color: 'gray'
    },
    { 
      key: 'success', 
      label: 'Success rate', 
      value: `${profile.stats.success_rate}%`,
      show: profile.show_success_rate,
      icon: TrophyIcon,
      color: 'gray'
    }
  ].filter(stat => stat.show)

  // Calculate response rate (interviews / applications)
  const responseRate = profile.stats.total_applications > 0 
    ? Math.round((profile.stats.interviews / profile.stats.total_applications) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Create your profile on {APP_NAME}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Profile Header - clean, editorial */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-2xl font-medium">
              {profile.display_name ? profile.display_name[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profile.display_name || 'Job Seeker'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-400">
                  Job search journey
                </p>
                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                <p className="text-xs text-gray-300">
                  Updated {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bio if available */}
          {profile.bio && (
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Stats Grid - minimal, intentional */}
        {visibleStats.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <ChartBarIcon className="w-4 h-4 text-gray-400" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Key metrics</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visibleStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={stat.key} className="border border-gray-100 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Response Rate Insight - only if both apps and interviews shown */}
        {profile.show_applications_count && profile.show_interviews_count && profile.stats.total_applications > 0 && (
          <div className="mb-16 bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Response rate</div>
                <div className="text-2xl font-semibold text-gray-900">{responseRate}%</div>
                <p className="text-xs text-gray-400 mt-1">
                  {profile.stats.interviews} interviews from {profile.stats.total_applications} applications
                </p>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full"
                  style={{ width: `${Math.min(responseRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Application Timeline Preview - if apps are shown */}
        {profile.show_applications_count && profile.recent_applications && profile.recent_applications.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Recent activity</h2>
            </div>
            <div className="space-y-3">
              {profile.recent_applications.slice(0, 5).map((app, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{app.position || 'Application'}</div>
                    {app.company && (
                      <div className="text-xs text-gray-400 mt-0.5">{app.company}</div>
                    )}
                  </div>
                  <div className="text-right">
                    {app.status && (
                      <div className="text-xs text-gray-500 capitalize">{app.status}</div>
                    )}
                    {app.applied_date && (
                      <div className="text-xs text-gray-300 mt-0.5">
                        {new Date(app.applied_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust/Credibility element */}
        {visibleStats.length > 0 && (
          <div className="mb-12 py-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <CheckBadgeIcon className="w-4 h-4 text-gray-300" />
              <p className="text-xs text-gray-400">
                Verified job search activity · Updated regularly
              </p>
            </div>
          </div>
        )}

        {/* CTA - minimal, direct, no gradients */}
        <div className="text-center border-t border-gray-100 pt-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to track your journey?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Join others who have organized their job search and landed their dream roles.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get started free
              <ArrowLeftIcon className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-gray-400">
          <p>Powered by <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">{APP_NAME}</Link></p>
        </div>
      </footer>
    </div>
  )
}