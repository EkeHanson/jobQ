import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import { formatDate } from '../../utils/formatters'

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{job.company?.name}</p>
        <Badge status={job.status} />
        <p className="text-sm text-gray-500 mt-2">
          Posted {formatDate(job.posted_date)}
        </p>
      </div>
      <div className="mt-4">
        <Link
          to={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View details &rarr;
        </Link>
      </div>
    </div>
  )
}
