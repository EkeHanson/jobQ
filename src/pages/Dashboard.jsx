import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import { useAuth } from '../hooks/useAuth'
import StatsCards from '../components/dashboard/StatsCards'
import ActivityChart from '../components/dashboard/ActivityChart'
import RecentApplications from '../components/dashboard/RecentApplications'
import FollowUpReminders from '../components/dashboard/FollowUpReminders'
import JobSearchGoalTracker from '../components/dashboard/JobSearchGoalTracker'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'
import useSubscription from '../hooks/useSubscription'
import {
  SparklesIcon,
  ArrowUpTrayIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserPlusIcon,
  DocumentTextIcon,
  CursorArrowRaysIcon,
  LightBulbIcon,
  PlusIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { applications, stats, loading, create, refetch } = useApplications()
  const { user } = useAuth()
  const { canCreateApplication, refresh } = useSubscription()
  const [activeTab, setActiveTab] = useState('overview')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [goalSet, setGoalSet] = useState(false)
  const [showManualCreate, setShowManualCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [manualData, setManualData] = useState({
    jobTitle: '',
    companyName: '',
    status: 'saved',
    source: '',
    appliedDate: '',
    followUpDate: '',
    notes: ''
  })

  // Create userName from user data
  const userName = user ? (user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`.trim()
    : user.first_name || user.last_name || user.username || user.email?.split('@')[0] || 'User'
  ) : null

  // Check if user is new (no applications, no goals set)
  const isNewUser = applications.length === 0 && !stats?.total

  useEffect(() => {
    // Check if user has dismissed onboarding
    const onboardingDismissed = localStorage.getItem('onboarding_dismissed')
    
    // Show onboarding for new users or users with very few applications
    if (!onboardingDismissed && (isNewUser || applications.length < 3)) {
      setShowOnboarding(true)
    }
  }, [isNewUser, applications.length])

  // Handle goal status changes
  const handleGoalStatusChange = (hasGoal) => {
    setGoalSet(hasGoal)
  }

  // Handle manual application creation
  const handleManualCreate = async () => {
    if (!manualData.jobTitle.trim() || !manualData.companyName.trim()) {
      toast.error('Job title and company name are required')
      return
    }

    const check = await canCreateApplication()
    if (!check.allowed) {
      toast.error(check.reason || 'Application limit reached')
      return
    }

    setSaving(true)

    const payload = new FormData()
    payload.append('job_title', manualData.jobTitle)
    payload.append('company_name', manualData.companyName)
    payload.append('status', manualData.status)
    payload.append('source', manualData.source || '')
    
    if (manualData.appliedDate && manualData.appliedDate.trim()) {
      payload.append('applied_date', manualData.appliedDate)
    }
    if (manualData.followUpDate && manualData.followUpDate.trim()) {
      payload.append('follow_up_date', manualData.followUpDate)
    }
    
    payload.append('notes', manualData.notes)

    try {
      await create(payload)
      setShowManualCreate(false)
      setManualData({
        jobTitle: '',
        companyName: '',
        status: 'saved',
        source: '',
        appliedDate: '',
        followUpDate: '',
        notes: ''
      })
      refetch()
      refresh()
      toast.success('Application created successfully!')
    } catch (error) {
      toast.error('Failed to create application')
    } finally {
      setSaving(false)
    }
  }

  // Onboarding steps for new users
  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your skills, experience, and preferences to get better job matches.',
      icon: UserPlusIcon,
      action: '/profile',
      actionText: 'Update Profile',
      completed: user?.first_name && user?.last_name // Simple check
    },
    {
      id: 'goal',
      title: 'Set Your Weekly Goal',
      description: 'Define how many applications you want to submit each week.',
      icon: CursorArrowRaysIcon,
      action: '#goal',
      actionText: 'Set Goal',
      completed: goalSet
    },
    {
      id: 'first_app',
      title: 'Add Your First Application',
      description: 'Start tracking your job applications with our AI-powered tool or manual entry.',
      icon: DocumentTextIcon,
      action: '#manual-create',
      actionText: 'Create Manually',
      completed: applications.length > 0
    },
    {
      id: 'explore',
      title: 'Explore Job Opportunities',
      description: 'Browse and match with jobs that fit your profile.',
      icon: LightBulbIcon,
      action: '/jobs',
      actionText: 'Browse Jobs',
      completed: false
    }
  ]

  if (showOnboarding && isNewUser) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to JobQ, {userName}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let's get you started on your job search journey. Follow these steps to maximize your success.
            </p>
          </div>

          {/* Onboarding Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="glass-card p-6 relative">
                {step.completed && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>

                    {step.action.startsWith('#') ? (
                      step.action === '#goal' ? (
                        <button
                          onClick={() => {
                            document.getElementById('goal-section')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`btn-gradient text-sm ${step.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={step.completed}
                        >
                          {step.actionText}
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </button>
                      ) : step.action === '#manual-create' ? (
                        <button
                          onClick={() => {
                            setShowManualCreate(true)
                            setShowOnboarding(false)
                          }}
                          className={`btn-gradient text-sm ${step.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={step.completed}
                        >
                          {step.actionText}
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            document.getElementById('goal-section')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`btn-gradient text-sm ${step.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={step.completed}
                        >
                          {step.actionText}
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </button>
                      )
                    ) : (
                      <Link
                        to={step.action}
                        className={`btn-gradient text-sm inline-flex items-center ${step.completed ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {step.actionText}
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Start Actions */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">Quick Start</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/ai-paste" className="group">
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors group-hover:bg-primary-50">
                  <SparklesIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">AI Job Extraction</h4>
                  <p className="text-sm text-gray-600">Paste any job description</p>
                </div>
              </Link>

              <Link to="/jobs" className="group">
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors group-hover:bg-blue-50">
                  <DocumentTextIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Browse Jobs</h4>
                  <p className="text-sm text-gray-600">Find your next opportunity</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  setShowManualCreate(true)
                  setShowOnboarding(false)
                }}
                className="group"
              >
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors group-hover:bg-blue-50">
                  <PencilSquareIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Manual Entry</h4>
                  <p className="text-sm text-gray-600">Enter details manually</p>
                </div>
              </button>
            </div>
          </div>

          {/* Skip Onboarding */}
          <div className="text-center">
            <button
              onClick={() => {
                setShowOnboarding(false)
                localStorage.setItem('onboarding_dismissed', 'true')
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip onboarding and go to dashboard →
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Professional */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {userName ? `Welcome back, ${userName}` : 'Welcome back'} • Track your job search progress
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setShowManualCreate(true)}
              className="border-gray-300"
              variant="outline"
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
            <Link to="/ai-paste">
              <Button className="btn-gradient shadow-lg shadow-primary-500/25">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Add with AI
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" className="border-gray-300">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <StatsCards stats={stats} loading={loading} />

        {/* Main Action Cards - Professional Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Actions */}
          <div className="md:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
              <RecentApplications applications={applications.slice(0, 3)} />
            </div>

            {/* Goal Progress */}
            <div id="goal-section" className="glass-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h2>
              <JobSearchGoalTracker onGoalStatusChange={handleGoalStatusChange} />
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/ai-paste" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <SparklesIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Add with AI</h4>
                    <p className="text-sm text-gray-600">Extract job details automatically</p>
                  </div>
                </Link>

                <Link to="/applications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ArrowUpTrayIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Track Applications</h4>
                    <p className="text-sm text-gray-600">Manage your job applications</p>
                  </div>
                </Link>

                <Link to="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <DocumentTextIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Jobs</h4>
                    <p className="text-sm text-gray-600">Find matching opportunities</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Follow-up Reminders */}
            <FollowUpReminders />
          </div>
        </div>

        {/* Analytics Section - Optional */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Analytics</h2>
            <Link to="/analytics" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View detailed analytics →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : (
            <ActivityChart applications={applications} />
          )}
        </div>
      </div>

      {/* Manual Application Creation Modal */}
      <Modal
        isOpen={showManualCreate}
        onClose={() => setShowManualCreate(false)}
        title="Create Application Manually"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={manualData.jobTitle}
              onChange={(e) => setManualData({...manualData, jobTitle: e.target.value})}
              placeholder="e.g. Senior Software Engineer"
              required
            />
            <Input
              label="Company Name"
              value={manualData.companyName}
              onChange={(e) => setManualData({...manualData, companyName: e.target.value})}
              placeholder="e.g. Google Inc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={manualData.status}
                onChange={(e) => setManualData({...manualData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Input
              label="Source"
              value={manualData.source}
              onChange={(e) => setManualData({...manualData, source: e.target.value})}
              placeholder="e.g. LinkedIn, Company Website"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Applied Date"
              type="date"
              value={manualData.appliedDate}
              onChange={(e) => setManualData({...manualData, appliedDate: e.target.value})}
            />
            <Input
              label="Follow-up Date"
              type="date"
              value={manualData.followUpDate}
              onChange={(e) => setManualData({...manualData, followUpDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={manualData.notes}
              onChange={(e) => setManualData({...manualData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Add any notes about this application..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowManualCreate(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleManualCreate}
              disabled={saving}
              className="btn-gradient"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Application
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
