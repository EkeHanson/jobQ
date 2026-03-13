import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import StatsCards from '../components/dashboard/StatsCards'
import ActivityChart from '../components/dashboard/ActivityChart'
import RecentApplications from '../components/dashboard/RecentApplications'
import FollowUpReminders from '../components/dashboard/FollowUpReminders'
import JobSearchGoalTracker from '../components/dashboard/JobSearchGoalTracker'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { SparklesIcon, ArrowUpTrayIcon, CalendarDaysIcon, ChartBarIcon, HomeIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { applications, stats, loading } = useApplications()
  const [activeTab, setActiveTab] = useState('overview') // 'overview' or 'analytics'

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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            Analytics
          </button>
        </div>

        {/* Stats - Show on both tabs */}
        <StatsCards stats={stats} loading={loading} />

        {activeTab === 'overview' ? (
          <>
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
              
              <button onClick={() => setActiveTab('analytics')} className="group">
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
              </button>
            </div>

            {/* Goal & Follow-ups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobSearchGoalTracker />
              <FollowUpReminders />
            </div>

            {/* Recent Applications */}
            <RecentApplications applications={applications} />
          </>
        ) : (
          <>
            {/* Analytics Tab - More detailed charts and insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <ActivityChart applications={applications} />
                )}
              </div>
              <div className="space-y-6">
                {/* Additional Analytics Cards */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Application Status</h3>
                  <div className="space-y-3">
                    {['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected'].map(status => {
                      const count = applications.filter(app => app.status === status).length
                      const total = applications.length
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-gray-600">{status}</span>
                            <span className="font-medium">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary-600">{applications.length}</p>
                      <p className="text-sm text-gray-500">Total Applications</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {applications.filter(a => a.status === 'interview').length}
                      </p>
                      <p className="text-sm text-gray-500">Interviews</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {applications.filter(a => a.status === 'applied').length}
                      </p>
                      <p className="text-sm text-gray-500">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {applications.filter(a => a.status === 'offer').length}
                      </p>
                      <p className="text-sm text-gray-500">Offers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
