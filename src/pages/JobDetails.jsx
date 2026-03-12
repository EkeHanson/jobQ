import { useState, useMemo } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import jobService from '../services/jobs'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  ShareIcon,
  BookmarkIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { formatDate, formatSalaryRange } from '../utils/formatters'

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 p-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary-600" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{value}</p>
      </div>
    </div>
  )
}

function SkillTag({ skill }) {
  return (
    <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-primary-50 text-primary-700 rounded-full border border-primary-100 whitespace-nowrap">
      {skill}
    </span>
  )
}

function BenefitItem({ benefit }) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
      <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
      <span className="break-words">{benefit}</span>
    </div>
  )
}

function JobDescription({ description }) {
  // Handle both plain text (legacy) and HTML-formatted content
  if (!description) return null
  
  // Check if it contains HTML tags
  const containsHtml = /<[a-z][\s\S]*>/i.test(description)
  
  if (containsHtml) {
    return (
      <div 
        className="prose prose-sm sm:prose-lg max-w-none text-gray-600"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    )
  }
  
  // Fallback: parse plain text with markdown-like formatting
  const sections = description?.split('\n\n') || []
  
  return (
    <div className="prose prose-sm sm:prose-lg max-w-none">
      {sections.map((section, index) => {
        if (section.startsWith('**') && section.includes('**')) {
          const headingEnd = section.indexOf('**', 2)
          if (headingEnd > 0) {
            const heading = section.slice(2, headingEnd)
            const content = section.slice(headingEnd + 2).replace(/^[:\s-]+/, '').replace(/•/g, '•')
            return (
              <div key={index} className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{heading}</h3>
                <div className="text-sm sm:text-base text-gray-600 whitespace-pre-line break-words">{content}</div>
              </div>
            )
          }
        }
        if (section.includes('•')) {
          const lines = section.split('\n').filter(line => line.trim())
          return (
            <div key={index} className="mb-3 sm:mb-4">
              <ul className="space-y-1 sm:space-y-2">
                {lines.map((line, i) => (
                  <li key={i} className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
                    <span className="break-words">{line.replace(/^[•\s]+/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        return section.trim() ? (
          <p key={index} className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words">{section}</p>
        ) : null
      })}
    </div>
  )
}

export default function JobDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [savingToApplications, setSavingToApplications] = useState(false)

  useEffect(() => {
    if (location.state?.job) {
      setJob(location.state.job)
      setIsSaved(location.state.job.is_bookmarked || false)
      setLoading(false)
      return
    }
    
    const fetchJob = async () => {
      try {
        const res = await jobService.getJob(id)
        setJob(res)
        setIsSaved(res.is_bookmarked || false)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchJob()
  }, [id, location.state])

  const handleToggleBookmark = async () => {
    try {
      if (isSaved) {
        await jobService.unbookmarkJob(id)
        toast.success('Job removed from bookmarks')
      } else {
        await jobService.bookmarkJob(id)
        toast.success('Job added to bookmarks')
      }
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Bookmark error:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const handleSaveToApplications = async (apply = false) => {
    try {
      setSavingToApplications(true)
      const status = apply ? 'applied' : 'saved'
      await jobService.saveApplication(id, status)
      if (apply) {
        toast.success('Application saved and marked as applied!')
      } else {
        toast.success('Job saved to your applications')
      }
      // Navigate to applications page after successful save
      navigate('/applications')
    } catch (error) {
      console.error('Save to applications error:', error)
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Failed to save application')
      }
    } finally {
      setSavingToApplications(false)
    }
  }

  const daysUntilDeadline = useMemo(() => {
    if (!job?.deadline) return null
    const deadline = new Date(job.deadline)
    const now = new Date()
    const diffTime = deadline - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [job?.deadline])

  const isDeadlineUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 sm:py-20 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <BriefcaseIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="inline-block">
            <Button size="sm" className="sm:size-md">
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Back Button */}
          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Back to Jobs</span>
          </Link>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              {/* Job Header */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-20 sm:h-32 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
                </div>
                
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-8 sm:-mt-12 relative">
                  <div className="flex items-end gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-white shadow-lg flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 border-2 sm:border-4 border-white flex-shrink-0">
                      {job.company?.name?.charAt(0) || 'J'}
                    </div>
                    <div className="flex-1 min-w-0 pb-1 sm:pb-2">
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{job.title}</h1>
                      <p className="text-sm sm:text-base text-gray-600 font-medium truncate">{job.company?.name}</p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 pb-1 sm:pb-2 flex-shrink-0">
                      <button
                        onClick={handleToggleBookmark}
                        className={`p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl transition-colors ${
                          isSaved 
                            ? 'bg-primary-100 text-primary-600' 
                            : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                      >
                        <BookmarkIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        {showShareMenu && (
                          <div className="absolute right-0 top-8 sm:top-10 lg:top-12 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 py-1 sm:py-2 min-w-[140px] sm:min-w-[160px] z-10">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                toast.success('Link copied!')
                                setShowShareMenu(false)
                              }}
                              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
                            >
                              Copy Link
                            </button>
                            <button 
                              onClick={() => {
                                const url = encodeURIComponent(window.location.href)
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
                                setShowShareMenu(false)
                              }}
                              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
                            >
                              Share on LinkedIn
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <StatItem 
                      icon={MapPinIcon} 
                      label="Location" 
                      value={job.location || 'Remote'} 
                    />
                    <StatItem 
                      icon={CurrencyDollarIcon} 
                      label="Salary" 
                      value={formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency) || 'Competitive'} 
                    />
                    <StatItem 
                      icon={BriefcaseIcon} 
                      label="Type" 
                      value={job.employment_type || job.jobType || 'Full-time'} 
                    />
                    <StatItem 
                      icon={UserGroupIcon} 
                      label="Level" 
                      value={job.experience_level || 'Mid-Level'} 
                    />
                  </div>
                  
                  {job.industry && (
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">Industry: <span className="font-medium text-gray-900">{job.industry}</span></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <SectionCard icon={BriefcaseIcon} title="About This Role">
                <JobDescription description={job.description} />
              </SectionCard>

              {/* Requirements */}
              {job.requirements && (
                <SectionCard icon={CheckCircleIcon} title="Requirements">
                  <JobDescription description={job.requirements} />
                </SectionCard>
              )}

              {/* Skills */}
              {(job.skills) && (
                <SectionCard icon={SparklesIcon} title="Required Skills">
                  <JobDescription description={job.skills} />
                </SectionCard>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <SectionCard icon={CheckCircleIcon} title="What We Offer">
                  <div className="grid grid-cols-1 gap-2">
                    {job.benefits.map((benefit, index) => (
                      <BenefitItem key={index} benefit={benefit} />
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Deadline Warning */}
                {daysUntilDeadline !== null && (
                  <div className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${
                    isDeadlineUrgent 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <ClockIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDeadlineUrgent ? 'text-red-500' : 'text-amber-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${isDeadlineUrgent ? 'text-red-700' : 'text-amber-700'}`}>
                        {isDeadlineUrgent ? 'Urgent' : 'Application Deadline'}
                      </p>
                      <p className={`text-xs sm:text-sm ${isDeadlineUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                        {daysUntilDeadline === 0 
                          ? 'Deadline is today!' 
                          : `${daysUntilDeadline} days remaining`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Apply Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                  {job.application_link ? (
                    <>
                      <a
                        href={job.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-center block mb-3 transition-colors"
                      >
                        Apply Now
                      </a>
                      <p className="text-xs text-gray-500 text-center">
                        You'll be redirected
                      </p>
                    </>
                  ) : job.application_email ? (
                    <>
                      <a
                        href={`mailto:${job.application_email}?subject=Application for ${job.title}`}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-center block mb-3"
                      >
                        <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                        Send Application
                      </a>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                        {job.application_email}
                      </p>
                    </>
                  ) : (
                    <Button className="w-full py-2.5 sm:py-3 text-sm sm:text-base">
                      Apply for this Job
                    </Button>
                  )}
                  
                  {/* Save to Applications Section */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 text-center mb-2">Save to your applications</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveToApplications(false)}
                        disabled={savingToApplications}
                        className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleSaveToApplications(true)}
                        disabled={savingToApplications}
                        className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Save & Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <button 
                      onClick={handleToggleBookmark}
                      className="w-full py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
                    >
                      <BookmarkIcon className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
                      {isSaved ? 'Saved' : 'Save for Later'}
                    </button>
                  </div>
                </div>

                {/* Company Info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">About the Company</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="font-medium text-gray-900 text-sm truncate">{job.company?.name}</p>
                      </div>
                    </div>
                    {job.industry && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Industry</p>
                          <p className="font-medium text-gray-900 text-sm truncate">{job.industry}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Meta */}
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3">Job Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Posted</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {job.posted_date ? formatDate(job.posted_date) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Deadline</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {job.deadline ? formatDate(job.deadline) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Job ID</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">#{job.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}