import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import JobCreateForm from '../components/jobs/JobCreateForm'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const JobCreate = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [initialData, setInitialData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we have job data to edit (passed via state)
    const state = location.state
    if (state?.job) {
      setInitialData(state.job)
    }
  }, [location.state])

  const handleCancel = () => {
    const from = location.state?.from || '/jobs'
    navigate(from)
  }

  const handleSuccess = () => {
    // Navigate back to jobs list on success
    navigate('/jobs')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Job' : 'Create New Job'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {initialData 
              ? 'Update the job posting details below'
              : 'Fill in the details to create a new job posting. Your job will be published immediately.'
            }
          </p>
        </div>

        {/* Job Create Form */}
        <JobCreateForm 
          initialData={initialData}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </DashboardLayout>
  )
}

export default JobCreate