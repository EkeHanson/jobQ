import { Link } from 'react-router-dom'
import Card from '../common/Card'
import StatusBadge from '../applications/StatusBadge'
import { formatDate } from '../../utils/formatters'
import Button from '../common/Button'

export default function RecentApplications({ applications = [] }) {
  const recentApps = applications.slice(0, 5)

  return (
    <Card>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Recent Applications</h3>
        <Link to="/applications">
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </Link>
      </div>

      {recentApps.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No applications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentApps.map((app) => (
            <div key={app.id} className="py-2 sm:py-2.5 hover:bg-gray-50 px-1 rounded">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{app.job_title}</p>
                  <p className="text-xs text-gray-600 truncate">{app.company_name}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
