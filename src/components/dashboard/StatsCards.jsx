import Card from '../common/Card'
import Spinner from '../common/Spinner'

export default function StatsCards({ stats, loading = false }) {
  const cards = [
    {
      title: 'Total Applications',
      value: stats?.total || 0,
      icon: '📝',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Interviews',
      value: stats?.by_status?.interview || 0,
      icon: '🎯',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Offers',
      value: stats?.by_status?.offer || 0,
      icon: '🎉',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Response Rate',
      value: stats?.response_rate ? `${stats.response_rate.toFixed(1)}%` : '0%',
      icon: '📊',
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={card.color}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              {loading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              )}
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
