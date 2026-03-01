import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useJobs } from '../hooks/useJobs'
import JobCard from '../components/jobs/JobCard'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function Jobs() {
  const { jobs, loading, create, refetch } = useJobs()
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [newJobData, setNewJobData] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
  })

  const handleSaveJob = async () => {
    const payload = {
      title: newJobData.title,
      company: { name: newJobData.companyName },
      description: newJobData.description,
      location: newJobData.location,
    }
    await create(payload)
    setIsJobModalOpen(false)
    refetch()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-gray-600 mt-1">
              Browse or manage job postings
            </p>
          </div>
          <Button
            onClick={() => {
              setNewJobData({
                title: '',
                companyName: '',
                description: '',
                location: '',
              })
              setIsJobModalOpen(true)
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2 inline-block" />
            New Job
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <Modal
              isOpen={isJobModalOpen}
              onClose={() => setIsJobModalOpen(false)}
              title="New Job"
            >
              <div className="space-y-4">
                <Input
                  label="Title"
                  required
                  value={newJobData.title}
                  onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                />
                <Input
                  label="Company"
                  required
                  value={newJobData.companyName}
                  onChange={(e) => setNewJobData({ ...newJobData, companyName: e.target.value })}
                />
                <Input
                  label="Location"
                  value={newJobData.location}
                  onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newJobData.description}
                    onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveJob}>Create Job</Button>
                  <Button variant="secondary" onClick={() => setIsJobModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
