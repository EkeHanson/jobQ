import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import usersService from '../services/users'
import Spinner from '../components/common/Spinner'
import { ArrowLeftIcon, BriefcaseIcon, ChatBubbleLeftIcon, GiftIcon, TrophyIcon } from '@heroicons/react/24/outline'

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
      // API returns response.data directly due to interceptor
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Create your own JobQ profile
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-primary-500/30">
            {profile.display_name ? profile.display_name[0].toUpperCase() : '?'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.display_name || 'Job Seeker'}
          </h1>
          <p className="text-gray-500 mt-1">Sharing their job search journey</p>
          <p className="text-sm text-gray-400 mt-2">
            Updated {new Date(profile.updated_at).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {profile.show_applications_count && (
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{profile.stats.total_applications}</p>
              <p className="text-gray-500">Applications</p>
            </div>
          )}
          
          {profile.show_interviews_count && (
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 flex items-center justify-center">
                <ChatBubbleLeftIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{profile.stats.interviews}</p>
              <p className="text-gray-500">Interviews</p>
            </div>
          )}
          
          {profile.show_offers_count && (
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-100 flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{profile.stats.offers}</p>
              <p className="text-gray-500">Offers</p>
            </div>
          )}
          
          {profile.show_success_rate && (
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{profile.stats.success_rate}%</p>
              <p className="text-gray-500">Success Rate</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg shadow-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Start Your Own Journey
            </h2>
            <p className="text-gray-600 mb-6">
              Track your job applications, set goals, and share your progress with the world.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Powered by <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">JobQ</Link> - Track your job search</p>
        </div>
      </footer>
    </div>
  )
}
