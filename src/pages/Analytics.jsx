import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import analyticsService from '../services/analytics'
import {
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

export default function Analytics() {
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await analyticsService.getSummary(period)
        setData(response)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const totals = data?.totals || {}
  const devices = data?.devices || {}
  const dailyData = data?.daily || []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your website visitors and engagement</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === days
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={UsersIcon}
            title="Total Visitors"
            value={totals.visitors || 0}
            color="blue"
          />
          <StatCard
            icon={GlobeAltIcon}
            title="Unique Visitors"
            value={totals.unique_visitors || 0}
            color="green"
          />
          <StatCard
            icon={ArrowTrendingUpIcon}
            title="New Visitors"
            value={totals.new_visitors || 0}
            color="purple"
          />
          <StatCard
            icon={ChartBarIcon}
            title="Page Views"
            value={totals.page_views || 0}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="unique_visitors" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={false}
                    name="Visitors"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total_page_views" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                    name="Page Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Desktop', value: devices.desktop || 0 },
                      { name: 'Mobile', value: devices.mobile || 0 },
                      { name: 'Tablet', value: devices.tablet || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-gray-600">Desktop ({devices.desktop || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600">Mobile ({devices.mobile || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-600">Tablet ({devices.tablet || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!data || dailyData.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics data yet</h3>
            <p className="text-gray-600">
              Start tracking your visitors. Data will appear here once visitors browse your site.
            </p>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon: Icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
