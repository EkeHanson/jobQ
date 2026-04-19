import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import StatisticsCard from '../components/common/StatisticsCard'
import adminService from '../services/admin'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/common/Toast'

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({})
  const [statistics, setStatistics] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0,
    newThisMonth: 0,
    unsubscribed: 0
  })
  const { addToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    console.log('Current user:', user)
    console.log('Is admin:', user?.is_staff || user?.is_superuser)
    fetchSubscribers()
  }, [params])

  // Separate useEffect for statistics to run after subscribers are loaded
  useEffect(() => {
    if (subscribers.length > 0) {
      fetchStatistics()
    }
  }, [subscribers])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      console.log('Fetching subscribers...')
      const data = await adminService.getBlogSubscribers(params)
      console.log('Subscribers data:', data)
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      setSubscribers(Array.isArray(data) ? data : (data.results || data || []))
    } catch (err) {
      console.error('Failed to load subscribers', err)
      console.error('Error response:', err.response)
      console.error('Error status:', err.response?.status)
      console.error('Error data:', err.response?.data)
      addToast(`Unable to load subscribers: ${err.response?.data?.detail || err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      // Calculate statistics from all loaded subscribers
      const totalSubscribers = subscribers.length
      const activeSubscribers = subscribers.filter(sub => sub.is_active).length
      const inactiveSubscribers = subscribers.filter(sub => !sub.is_active).length

      // Calculate new subscribers this month
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const newThisMonth = subscribers.filter(sub => {
        const subDate = new Date(sub.created_at || sub.date_joined)
        return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear
      }).length

      // For unsubscribed, we'll assume inactive subscribers are unsubscribed
      const unsubscribed = inactiveSubscribers

      setStatistics({
        totalSubscribers,
        activeSubscribers,
        inactiveSubscribers,
        newThisMonth,
        unsubscribed
      })
    } catch (err) {
      console.warn('Failed to calculate subscriber statistics:', err)
      // Set default values if calculation fails
      setStatistics({
        totalSubscribers: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        newThisMonth: 0,
        unsubscribed: 0
      })
    }
  }

  const toggleSubscriberStatus = async (subscriber) => {
    try {
      const payload = { is_active: !subscriber.is_active }
      await adminService.updateBlogSubscriber(subscriber.id, payload)
      addToast('Subscriber status updated.', 'success')
      fetchSubscribers()
    } catch (err) {
      console.error('Failed to update subscriber', err)
      addToast('Unable to update subscriber status.', 'error')
    }
  }

  const deleteSubscriber = async (subscriber) => {
    if (!window.confirm('Delete this subscriber?')) return
    try {
      await adminService.deleteBlogSubscriber(subscriber.id)
      addToast('Subscriber deleted successfully.', 'success')
      fetchSubscribers()
    } catch (err) {
      console.error('Failed to delete subscriber', err)
      addToast('Unable to delete subscriber.', 'error')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-2">
          <a href="/admin" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </a>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Subscribers</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">View blog newsletter subscribers and their subscription status.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatisticsCard
            title="Total Subscribers"
            value={statistics.totalSubscribers}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatisticsCard
            title="Active"
            value={statistics.activeSubscribers}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatisticsCard
            title="Inactive"
            value={statistics.inactiveSubscribers}
            color="gray"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            }
          />
          <StatisticsCard
            title="New This Month"
            value={statistics.newThisMonth}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatisticsCard
            title="Unsubscribed"
            value={statistics.unsubscribed}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          />
        </div>

        {/* Subscribers Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Active</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Subscribed Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Source</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading subscribers…
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-500">No subscribers found.</td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.email || subscriber.id} className="hover:bg-pink-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriber.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subscriber.subscribed_date ? new Date(subscriber.subscribed_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subscriber.source || 'Website'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSubscriberStatus(subscriber)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${subscriber.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          {subscriber.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubscriber(subscriber)}
                          className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Subscribers Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading subscribers…</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No subscribers found.</div>
          ) : (
            subscribers.map((subscriber) => (
              <div key={subscriber.email || subscriber.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{subscriber.email}</h3>
                    <p className="text-sm text-gray-600">{subscriber.source || 'Website'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriber.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {subscriber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Subscribed: {subscriber.subscribed_date ? new Date(subscriber.subscribed_date).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSubscriberStatus(subscriber)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold text-white flex-1 ${subscriber.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {subscriber.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSubscriber(subscriber)}
                    className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
