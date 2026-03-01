import DashboardLayout from '../components/layout/DashboardLayout'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import jobService from '../services/jobs'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { formatDate, formatSalaryRange } from '../utils/formatters'

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJob(id)
        setJob(res)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchJob()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">{job.company?.name}</span>
          <Badge status={job.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description || 'No description provided.'}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Details</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Location:</strong> {job.location || 'N/A'}
              </li>
              <li>
                <strong>Type:</strong> {job.employment_type}
              </li>
              <li>
                <strong>Experience:</strong> {job.experience_level}
              </li>
              <li>
                <strong>Salary:</strong>{' '}
                {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
              </li>
              <li>
                <strong>Deadline:</strong>{' '}
                {job.deadline ? formatDate(job.deadline) : 'N/A'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <Button>Apply Now</Button>
          <Button variant="outline">Save Job</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
