import React from 'react'

const StatisticsCard = ({ title, value, icon, color = 'blue', trend, trendValue }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      icon: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      icon: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      icon: 'text-purple-600'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      icon: 'text-amber-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      icon: 'text-red-600'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    }
  }

  const classes = colorClasses[color] || colorClasses.blue

  return (
    <div className={`rounded-2xl ${classes.bg} border ${classes.border} p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${classes.text} mb-2`}>{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${classes.bg} ${classes.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatisticsCard