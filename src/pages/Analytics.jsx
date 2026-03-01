import DashboardLayout from '../components/layout/DashboardLayout'
import ActivityChart from '../components/dashboard/ActivityChart'
import StatsCards from '../components/dashboard/StatsCards'
import { useApplications } from '../hooks/useApplications'
import Spinner from '../components/common/Spinner'

export default function Analytics() {
  const { applications, stats, loading } = useApplications()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Deep dive into your application performance and trends</p>
        </div>

        <StatsCards stats={stats} loading={loading} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <ActivityChart applications={applications} />
        )}
      </div>
    </DashboardLayout>
  )
}
