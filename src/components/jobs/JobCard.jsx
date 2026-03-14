import { Link } from 'react-router-dom'
import { MapPinIcon, ClockIcon } from '@heroicons/react/16/solid'
import { formatDate } from '../../utils/formatters'

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-md p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Company Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">
            {job.company?.name?.charAt(0) || 'J'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {job.company?.name}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-xs text-gray-500 hidden sm:block">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-3 h-3" />
                {job.location}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(job.posted_date)}
          </span>
          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
            Apply
          </span>
        </div>
      </div>
    </Link>
  )
}
