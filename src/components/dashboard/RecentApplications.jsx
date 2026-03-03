import { Link } from 'react-router-dom'
import Card from '../common/Card'
import StatusBadge from '../applications/StatusBadge'
import { formatDate } from '../../utils/formatters'
import Button from '../common/Button'

export default function RecentApplications({ applications = [] }) {
  const recentApps = applications.slice(0, 5)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        <Link to="/applications">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {recentApps.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No applications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {recentApps.map((app) => (
            <div key={app.id} className="py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{app.job_title}</p>
                  <p className="text-sm text-gray-600">{app.company_name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on {formatDate(app.applied_date)}
                  </p>
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
