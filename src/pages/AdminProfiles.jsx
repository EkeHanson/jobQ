import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const data = await adminService.getProfiles()
      setProfiles(data.results || data || [])
    } catch (err) {
      console.error('Failed to load profiles', err)
      addToast('Unable to load profiles. Check permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('Delete this profile?')) return
    try {
      await adminService.deleteProfile(profileId)
      addToast('Profile deleted successfully.', 'success')
      fetchProfiles()
    } catch (err) {
      console.error('Failed to delete profile', err)
      addToast('Unable to delete profile. Check permissions.', 'error')
    }
  }

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profiles</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Review user profiles stored in the system.</p>
        </div>

        {/* Profiles Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Bio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Website</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading profiles…
                    </div>
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">No profiles found.</td>
                </tr>
              ) : (
                profiles.map((profile, index) => (
                  <tr key={profile.id} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.user?.username || profile.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs break-words">{profile.bio || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.location || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">{profile.website || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 shadow-sm"
                          onClick={() => handleViewProfile(profile)}
                        >
                          View
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(profile.id)}
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

        {/* Profiles Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading profiles…</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No profiles found.</div>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.user?.username || profile.user}</h3>
                    <p className="text-sm text-gray-600">{profile.location || 'No location'}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    ID: {profile.id}
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.bio}</p>
                )}
                {profile.website && (
                  <p className="text-sm text-primary-600 mb-3">{profile.website}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 flex-1"
                    onClick={() => handleViewProfile(profile)}
                  >
                    View
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProfile(profile.id)}
                    className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Profile Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm">👤</span>
              Profile Details
            </h2>
            {selectedProfile && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedProfile.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedProfile.user?.username || selectedProfile.user || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedProfile.user?.email || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedProfile.location || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Website</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedProfile.website || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedProfile.linkedin_url || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">GitHub</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedProfile.github_url || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Twitter</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedProfile.twitter_url || '—'}</p>
                  </div>
                </div>
                {selectedProfile.bio && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bio</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedProfile.bio}</p>
                  </div>
                )}
                {selectedProfile.resume_url && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resume</p>
                    <p className="text-sm text-primary-600 mt-1">{selectedProfile.resume_url}</p>
                  </div>
                )}
                {selectedProfile.skills && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedProfile.skills}</p>
                  </div>
                )}
                {selectedProfile.experience && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedProfile.experience}</p>
                  </div>
                )}
                {selectedProfile.education && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Education</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedProfile.education}</p>
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
