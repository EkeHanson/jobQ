import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await adminService.getNotifications()
      setNotifications(data.results || data || [])
    } catch (err) {
      console.error('Failed to load notifications', err)
      addToast('Unable to load notifications. Make sure you are logged in as an admin.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotification = async (notification) => {
    if (!window.confirm('Delete this notification?')) return
    try {
      await adminService.deleteNotification(notification.id)
      addToast('Notification deleted successfully.', 'success')
      fetchNotifications()
    } catch (err) {
      console.error('Failed to delete notification', err)
      addToast('Unable to delete notification. Check permissions.', 'error')
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Review and manage system notifications across all users.</p>
        </div>

        {/* Notifications Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Link</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Read</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading notifications…
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">No notifications found.</td>
                </tr>
              ) : (
                notifications.map((notification, index) => (
                  <tr key={notification.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs break-words">{notification.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">{notification.link || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notification.read ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {notification.read ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{notification.created_at ? new Date(notification.created_at).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        type="button"
                        className="bg-red-500 px-3 py-1.5 text-xs hover:bg-red-600 shadow-sm"
                        onClick={() => handleDeleteNotification(notification)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Notifications Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading notifications…</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No notifications found.</div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notification.read ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {notification.read ? 'Read' : 'Unread'}
                  </span>
                </div>
                {notification.link && (
                  <p className="text-sm text-primary-600 mb-3">{notification.link}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{notification.created_at ? new Date(notification.created_at).toLocaleString() : '—'}</p>
                  <Button
                    type="button"
                    className="bg-red-500 px-3 py-1.5 text-xs hover:bg-red-600"
                    onClick={() => handleDeleteNotification(notification)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
