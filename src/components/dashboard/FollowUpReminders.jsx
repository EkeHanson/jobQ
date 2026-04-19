import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import applicationService from '../../services/applications'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { BellIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function FollowUpReminders() {
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowUps()
  }, [])

  const fetchFollowUps = async () => {
    try {
      const response = await applicationService.getFollowUps()
      // Filter to only show upcoming follow-ups (not sent yet)
      const upcoming = response.data ? response.data.filter(fu => !fu.follow_up_sent) : []
      setFollowUps(upcoming.slice(0, 5)) // Show max 5
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSent = async (applicationId) => {
    try {
      await applicationService.markFollowUpSent(applicationId)
      // Remove from list
      setFollowUps(followUps.filter(fu => fu.id !== applicationId))
    } catch (error) {
      console.error('Failed to mark follow-up as sent:', error)
    }
  }

  const getFollowUpLabel = (date) => {
    const followUpDate = new Date(date)
    if (isToday(followUpDate)) return 'Today'
    if (isTomorrow(followUpDate)) return 'Tomorrow'
    return format(followUpDate, 'MMM d')
  }

  const isOverdue = (date) => {
    return isPast(new Date(date)) && !isToday(new Date(date))
  }

  if (loading) {
    return (
      <div className="glass-card p-3 sm:p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (followUps.length === 0) {
    return null // Don't show if no follow-ups
  }

  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          <BellIcon className="w-4 h-4 text-orange-500" />
          <h3 className="font-semibold text-gray-900 text-sm">Follow-up Reminders</h3>
        </div>
        <Link to="/applications" className="text-xs text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>

      <div className="space-y-2">
        {followUps.map((app) => (
          <div 
            key={app.id} 
            className={`p-2 sm:p-2.5 rounded border ${
              isOverdue(app.follow_up_date) 
                ? 'bg-red-50 border-red-200' 
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                  {app.job_title || 'Untitled'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {app.company_name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CalendarIcon className={`w-3 h-3 ${isOverdue(app.follow_up_date) ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className={`text-[10px] sm:text-xs ${isOverdue(app.follow_up_date) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {getFollowUpLabel(app.follow_up_date)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleMarkSent(app.id)}
                className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
                title="Mark as done"
              >
                <CheckCircleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
