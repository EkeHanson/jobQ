import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import StatsCards from '../components/dashboard/StatsCards'
import ActivityChart from '../components/dashboard/ActivityChart'
import RecentApplications from '../components/dashboard/RecentApplications'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { SparklesIcon, ArrowUpTrayIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { applications, stats, loading } = useApplications()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your job search overview.</p>
          </div>
          <Link to="/ai-paste">
            <Button className="btn-gradient shadow-lg shadow-primary-500/25">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Add with AI
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} loading={loading} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/applications" className="group">
            <div className="glass-card p-6 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <ArrowUpTrayIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Applications</h3>
                  <p className="text-sm text-gray-500">View all your applications</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/ai-paste" className="group">
            <div className="glass-card p-6 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Extraction</h3>
                  <p className="text-sm text-gray-500">Paste a job description</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/analytics" className="group">
            <div className="glass-card p-6 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-500">View your insights</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

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
