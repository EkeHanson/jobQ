import Card from '../common/Card'
import Spinner from '../common/Spinner'
import {
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function StatsCards({ stats, loading = false }) {
  const cards = [
    {
      title: 'Total Applications',
      value: stats?.total || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Interviews',
      value: stats?.by_status?.interview || 0,
      icon: CalendarDaysIcon,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Offers',
      value: stats?.by_status?.offer || 0,
      icon: CheckCircleIcon,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Response Rate',
      value: stats?.response_rate ? `${stats.response_rate.toFixed(1)}%` : '0%',
      icon: ChartBarIcon,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {cards.map((card) => (
        <Card key={card.title} className={card.color}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
              {loading ? (
                <Spinner size="sm" className="mt-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold mt-1">{card.value}</p>
              )}
            </div>
            <div>
              <card.icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
