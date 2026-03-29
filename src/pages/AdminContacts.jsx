import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

export default function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { addToast } = useToast()

  useEffect(() => {
    fetchMessages(page)
  }, [page])

  const fetchMessages = async (pageNumber = 1) => {
    try {
      setLoading(true)
      const data = await adminService.getContactMessages(pageNumber)
      setMessages(data.results || [])
      setTotalPages(data.total_pages || 1)
      setPage(Number(data.current_page) || 1)
    } catch (err) {
      console.error('Failed to load contact messages', err)
      addToast('Unable to load messages. Make sure you are logged in as an admin.', 'error')
    } finally {
      setLoading(false)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Review inbound messages submitted through the contact form.</p>
        </div>

        {/* Messages Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Responded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading messages…
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">No contact messages found.</td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(message.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{message.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{message.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[28rem] break-words">{message.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${message.responded ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {message.responded ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Messages Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No contact messages found.</div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${message.responded ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {message.responded ? 'Responded' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">{message.subject}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{message.message}</p>
                <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600">Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="flex-1 sm:flex-none rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
              className="flex-1 sm:flex-none rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
