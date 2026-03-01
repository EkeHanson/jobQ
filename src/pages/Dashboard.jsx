import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import StatsCards from '../components/dashboard/StatsCards'
import ActivityChart from '../components/dashboard/ActivityChart'
import RecentApplications from '../components/dashboard/RecentApplications'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { applications, stats, loading } = useApplications()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your job search overview.</p>
          </div>
          <Link to="/ai-paste">
            <Button>
              <SparklesIcon className="w-5 h-5 mr-2 inline-block" />
              Add with AI
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} loading={loading} />

        {/* Charts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <ActivityChart applications={applications} />
        )}

        {/* Recent Applications */}
        <RecentApplications applications={applications} />
      </div>
    </DashboardLayout>
  )
}
