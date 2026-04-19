import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StatisticsCard from '../components/common/StatisticsCard'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    archivedApplications: 0
  })
  const { addToast } = useToast()

  useEffect(() => {
    fetchApplications(page)
  }, [page]);

  // Separate useEffect for statistics to run after applications are loaded
  useEffect(() => {
    if (applications.length > 0) {
      fetchStatistics();
    }
  }, [applications]);

  const fetchApplications = async (pageNumber = 1) => {
    try {
      setLoading(true)
      const data = await adminService.getApplications({ page: pageNumber })
      const results = data.results || data
      setApplications(results || [])
      setTotalPages(data.total_pages || 1)
      setPage(Number(data.current_page) || pageNumber)
    } catch (err) {
      console.error('Failed to load applications', err)
      addToast('Unable to load applications. Check permissions or backend status.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      // Calculate statistics from all loaded applications
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      const approvedApplications = applications.filter(app => app.status === 'approved').length;
      const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
      const archivedApplications = applications.filter(app => app.archived).length;

      setStatistics({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        archivedApplications
      });
    } catch (err) {
      console.warn('Failed to calculate application statistics:', err);
      // Set default values if calculation fails
      setStatistics({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        archivedApplications: 0
      });
    }
  };

  const handleArchiveToggle = async (application) => {
    try {
      if (application.archived) {
        await adminService.unarchiveApplication(application.id)
        addToast('Application unarchived.', 'success')
      } else {
        await adminService.archiveApplication(application.id)
        addToast('Application archived.', 'success')
      }
      fetchApplications(page)
    } catch (err) {
      console.error('Unable to archive/unarchive application', err)
      addToast('Action failed. Check permissions.', 'error')
    }
  }

  const handleSoftDelete = async (application) => {
    if (!window.confirm('Soft delete this application? It can be restored later.')) return
    try {
      await adminService.softDeleteApplication(application.id)
      addToast('Application soft deleted.', 'success')
      fetchApplications(page)
    } catch (err) {
      console.error('Failed to soft delete application', err)
      addToast('Unable to soft delete application. Check permissions.', 'error')
    }
  }

  const handleRestore = async (application) => {
    try {
      await adminService.restoreApplication(application.id)
      addToast('Application restored.', 'success')
      fetchApplications(page)
    } catch (err) {
      console.error('Failed to restore application', err)
      addToast('Unable to restore application. Check permissions.', 'error')
    }
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setShowViewModal(true)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">View all applications in the system. Staff users may archive, soft delete, or restore records.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatisticsCard
            title="Total Applications"
            value={statistics.totalApplications}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatisticsCard
            title="Pending"
            value={statistics.pendingApplications}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatisticsCard
            title="Approved"
            value={statistics.approvedApplications}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatisticsCard
            title="Rejected"
            value={statistics.rejectedApplications}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          />
          <StatisticsCard
            title="Archived"
            value={statistics.archivedApplications}
            color="gray"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            }
          />
        </div>

        {/* Applications Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Archived</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Deleted</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading applications…
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-sm text-gray-500">No applications found.</td>
                </tr>
              ) : (
                applications.map((application, index) => (
                  <tr key={application.id} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.user?.username || application.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.job_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.company_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                        application.status === 'Offer' ? 'bg-green-100 text-green-800' :
                        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.archived ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                        {application.archived ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.deleted_at ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {application.deleted_at ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewApplication(application)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchiveToggle(application)}
                          className={`p-1.5 rounded-lg transition-colors ${application.archived ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}
                          title={application.archived ? 'Unarchive' : 'Archive'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {application.archived ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            )}
                          </svg>
                        </button>
                        {application.deleted_at ? (
                          <button
                            type="button"
                            onClick={() => handleRestore(application)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Restore"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSoftDelete(application)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Soft Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Applications Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading applications…</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No applications found.</div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.job_title}</h3>
                    <p className="text-sm text-gray-600">{application.company_name}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                    application.status === 'Offer' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">By {application.user?.username || application.user}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {application.archived && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Archived
                    </span>
                  )}
                  {application.deleted_at && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Deleted
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 flex-1"
                    onClick={() => handleViewApplication(application)}
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    className={`px-3 py-1.5 text-xs flex-1 ${application.archived ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}`}
                    onClick={() => handleArchiveToggle(application)}
                  >
                    {application.archived ? 'Unarchive' : 'Archive'}
                  </Button>
                  {application.deleted_at ? (
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 flex-1"
                      onClick={() => handleRestore(application)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 flex-1"
                      onClick={() => handleSoftDelete(application)}
                    >
                      Soft Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600">Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="flex-1 sm:flex-none"
            >
              ← Previous
            </Button>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
              className="flex-1 sm:flex-none"
            >
              Next →
            </Button>
          </div>
        </div>

        {/* View Application Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">📄</span>
              Application Details
            </h2>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.user?.username || selectedApplication.user || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Title</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.job_title || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.company_name || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.status || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Applied Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.applied_date ? new Date(selectedApplication.applied_date).toLocaleString() : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Archived</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.archived ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Archived At</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.archived_at ? new Date(selectedApplication.archived_at).toLocaleString() : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Soft Deleted</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.deleted_at ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deleted At</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.deleted_at ? new Date(selectedApplication.deleted_at).toLocaleString() : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Follow Up Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.follow_up_date ? new Date(selectedApplication.follow_up_date).toLocaleString() : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Source</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedApplication.source || '—'}</p>
                  </div>
                </div>
                {selectedApplication.description && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedApplication.description}</p>
                  </div>
                )}
                {selectedApplication.notes && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedApplication.notes}</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
