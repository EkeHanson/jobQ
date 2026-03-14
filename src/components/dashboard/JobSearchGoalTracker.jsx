import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../../services/users'
import { BookmarkSquareIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function JobSearchGoalTracker() {
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [weeklyTarget, setWeeklyTarget] = useState(10)

  useEffect(() => {
    fetchGoal()
  }, [])

  const fetchGoal = async () => {
    try {
      const response = await usersService.getGoal()
      if (response.data) {
        setGoal(response.data)
        setWeeklyTarget(response.data.weekly_target || 10)
      }
    } catch (error) {
      // Goal might not exist yet
      console.log('No goal set yet')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGoal = async () => {
    try {
      if (goal && goal.id) {
        await usersService.updateGoal(goal.id, { weekly_target: weeklyTarget })
      } else {
        await usersService.createGoal({ weekly_target: weeklyTarget })
      }
      fetchGoal()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save goal:', error)
    }
  }

  const progress = goal ? (goal.applications_this_week / goal.weekly_target) * 100 : 0
  const progressClamped = Math.min(progress, 100)

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // If no goal set and not editing, show a prompt
  if (!goal && !isEditing) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookmarkSquareIcon className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-900">Weekly Goal</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Set a weekly application target to track your job search progress.
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="btn-gradient text-sm"
        >
          Set Your Goal
        </button>
      </div>
    )
  }

  // If editing, show the form
  if (isEditing) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookmarkSquareIcon className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-900">Set Weekly Goal</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applications per week
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSaveGoal}
              className="btn-gradient text-sm flex-1"
            >
              Save Goal
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show the goal progress
  const isComplete = goal.applications_this_week >= goal.weekly_target
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TargetIcon className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-900">Weekly Goal</h3>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Edit
        </button>
      </div>

      <div className="space-y-4">
        {/* Progress Stats */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {goal.applications_this_week}
              <span className="text-lg text-gray-400 font-normal">/{goal.weekly_target}</span>
            </p>
            <p className="text-sm text-gray-500">applications this week</p>
          </div>
          <div className={`text-right ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
            <p className="text-lg font-semibold">{Math.round(progress)}%</p>
            <p className="text-xs">complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
              isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}
            style={{ width: `${progressClamped}%` }}
          />
        </div>

        {/* Motivational Message */}
        {isComplete ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <ArrowTrendingUpIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Goal achieved! Keep up the great work!</span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {goal.weekly_target - goal.applications_this_week} more to reach your goal
          </p>
        )}
      </div>
    </div>
  )
}
