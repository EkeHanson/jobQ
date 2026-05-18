import { Link } from 'react-router-dom'
import { MapPinIcon, ClockIcon } from '@heroicons/react/16/solid'
import { formatDate } from '../../utils/formatters'

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        {/* Company Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">
            {job.company?.name?.charAt(0) || 'J'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">
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
          <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
            Apply
          </span>
        </div>
      </div>
    </Link>
  )
}
