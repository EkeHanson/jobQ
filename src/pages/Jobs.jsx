import DashboardLayout from '../components/layout/DashboardLayout'
import { useJobs } from '../hooks/useJobs'
import JobCard from '../components/jobs/JobCard'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function Jobs() {
  const { jobs, loading } = useJobs()

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
          <Button>
            <PlusIcon className="w-5 h-5 mr-2 inline-block" />
            New Job
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
