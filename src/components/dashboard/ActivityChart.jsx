import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from '../common/Card'

export default function ActivityChart({ applications = [] }) {
  // Prepare data for bar chart (by status)
  const statusData = {}
  applications.forEach((app) => {
    const status = app.status || 'unknown'
    statusData[status] = (statusData[status] || 0) + 1
  })

  const barChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }))

  // Prepare data for pie chart (by source)
  const sourceData = {}
  applications.forEach((app) => {
    const source = app.job?.source || 'Other'
    sourceData[source] = (sourceData[source] || 0) + 1
  })

  const pieChartData = Object.entries(sourceData).map(([source, count]) => ({
    name: source,
    value: count,
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Source Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
