import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import { useSelector } from 'react-redux'
import ApplicationTable from '../components/applications/ApplicationTable'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { filterApplications } from '../utils/helpers'
import { PlusIcon } from '@heroicons/react/24/outline'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'

export default function Applications() {
  const {
    applications,
    loading,
    currentApplication,
    setCurrent,
    clearCurrent,
    update,
    create,
    refetch,
  } = useApplications()
  const filters = useSelector((state) => state.ui.filters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editData, setEditData] = useState(null)
  const [newData, setNewData] = useState({
    jobTitle: '',
    companyName: '',
    status: 'saved',
    appliedDate: '',
    deadline: '',
    notes: '',
  })

  const filteredApps = filterApplications(applications, filters)

  const handleEdit = (app) => {
    setIsCreating(false)
    setCurrent(app)
    setEditData({ status: app.status, notes: app.notes })
    setIsModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (currentApplication && editData) {
      await update(currentApplication.id, editData)
      setIsModalOpen(false)
      clearCurrent()
    }
  }

  const handleView = (app) => {
    setIsCreating(false)
    setCurrent(app)
    setIsModalOpen(true)
  }

  const handleSaveNew = async () => {
    const payload = {
      job: {
        title: newData.jobTitle,
        company: { name: newData.companyName },
      },
      status: newData.status,
      applied_date: newData.appliedDate || null,
      deadline: newData.deadline || null,
      notes: newData.notes,
    }

    await create(payload)
    setIsModalOpen(false)
    setIsCreating(false)
    refetch()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">
              Track all your job applications in one place
            </p>
          </div>
          <Button onClick={() => {
              setIsCreating(true)
              clearCurrent()
              setNewData({
                jobTitle: '',
                companyName: '',
                status: 'saved',
                appliedDate: '',
                deadline: '',
                notes: '',
              })
              setIsModalOpen(true)
            }}>
            <PlusIcon className="w-5 h-5 mr-2 inline-block" />
            New Application
          </Button>
        </div>

        {/* Filters */}
        <ApplicationFilters />

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredApps.length} of {applications.length} applications
                </p>
              </div>
              <ApplicationTable
                applications={filteredApps}
                onEdit={handleEdit}
                onView={handleView}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          clearCurrent()
          setIsCreating(false)
        }}
        title={isCreating ? 'New Application' : currentApplication ? 'Update Application' : 'Application Details'}
      >
        {isCreating ? (
          <div className="space-y-4">
            <Input
              label="Job Title"
              required
              value={newData.jobTitle}
              onChange={(e) => setNewData({ ...newData, jobTitle: e.target.value })}
            />
            <Input
              label="Company"
              required
              value={newData.companyName}
              onChange={(e) => setNewData({ ...newData, companyName: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newData.status}
                onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applied Date
              </label>
              <Input
                type="date"
                value={newData.appliedDate}
                onChange={(e) => setNewData({ ...newData, appliedDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <Input
                type="date"
                value={newData.deadline}
                onChange={(e) => setNewData({ ...newData, deadline: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newData.notes}
                onChange={(e) => setNewData({ ...newData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveNew}>Create Application</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false)
                  setIsCreating(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          currentApplication && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <p className="text-gray-900 font-medium">{currentApplication.job?.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <p className="text-gray-900">{currentApplication.job?.company?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editData?.status || currentApplication.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="assessment">Assessment</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={editData?.notes || currentApplication.notes || ''}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </Modal>
    </DashboardLayout>
  )
}
