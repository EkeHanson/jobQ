import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
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

const DUMMY_JOBS = {
  1: {
    id: 1,
    title: 'Senior Frontend Developer',
    company: { name: 'Tech Innovations Inc', description: 'Leading tech company specializing in AI solutions' },
    location: 'San Francisco, CA',
    description: `We are looking for an experienced Frontend Developer with expertise in React and modern web technologies. You will be responsible for building responsive user interfaces, optimizing performance, and collaborating with our design and backend teams.

**About the Role**

Join our dynamic team of engineers and help build the next generation of our product. You'll work on challenging problems, collaborate with talented colleagues, and make a significant impact on millions of users worldwide.

**What You'll Do**

• Design and implement new features for our web applications
• Collaborate with designers to bring pixel-perfect UIs to life
• Optimize application performance for maximum speed and scalability
• Write clean, maintainable, and well-tested code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with emerging trends and best practices

**What We're Looking For**

• 5+ years of experience with React and modern JavaScript
• Strong knowledge of TypeScript and state management (Redux, Context API)
• Experience with testing frameworks (Jest, React Testing Library)
• Understanding of responsive design and web accessibility (WCAG)
• Excellent communication and collaboration skills`,
    salary_min: 120000,
    salary_max: 150000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Senior',
    status: 'active',
    posted_date: '2026-02-15',
    deadline: '2026-03-30',
    application_link: 'https://techinnovations.com/careers/apply/frontend-dev',
    skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Jest', 'Webpack'],
    benefits: ['Health Insurance', '401k Matching', 'Remote Work', 'Unlimited PTO', 'Learning Budget', 'Stock Options'],
    company_size: '500-1000',
    company_industry: 'Technology',
  },
  2: {
    id: 2,
    title: 'Backend Engineer',
    company: { name: 'Cloud Solutions Ltd', description: 'Enterprise cloud infrastructure provider' },
    location: 'New York, NY',
    description: `Join our team to build scalable backend systems using Node.js and microservices architecture. You will work on API development, database optimization, and cloud infrastructure.

**About the Role**

We're looking for a Backend Engineer to help us scale our platform and build robust APIs that power our products. You'll work with a team of experienced engineers to design and implement high-performance systems.

**What You'll Do**

• Design and implement scalable RESTful and GraphQL APIs
• Optimize database queries and ensure data integrity
• Work with DevOps team on deployment and infrastructure
• Write comprehensive unit and integration tests
• Troubleshoot and resolve production issues
• Participate in on-call rotation

**What We're Looking For**

• 4+ years of backend development experience
• Proficiency in Node.js, Python, or Go
• Experience with PostgreSQL, MongoDB, and Redis
• Knowledge of microservices architecture and message queues
• Experience with Docker and Kubernetes is a plus`,
    salary_min: 110000,
    salary_max: 140000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-Level',
    status: 'active',
    posted_date: '2026-02-20',
    deadline: '2026-03-25',
    application_email: 'careers@cloudsolutions.com',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    benefits: ['Health Insurance', '401k', 'Hybrid Work', 'Gym Membership', 'Free Lunch'],
    company_size: '200-500',
    company_industry: 'Cloud Computing',
  },
  3: {
    id: 3,
    title: 'DevOps Engineer',
    company: { name: 'Digital Platforms Co', description: 'Digital transformation company' },
    location: 'Austin, TX',
    description: `Seeking a DevOps specialist to manage cloud infrastructure, CI/CD pipelines, and Kubernetes deployments. You will ensure system reliability, scalability, and security.

**What You'll Do**

• Design and maintain cloud infrastructure on AWS/GCP
• Build and maintain CI/CD pipelines
• Implement monitoring, logging, and alerting systems
• Ensure security best practices are followed
• Automate deployment processes

**What We're Looking For**

• 3+ years of DevOps experience
• Strong knowledge of AWS/GCP/Azure
• Experience with Kubernetes and Docker
• Proficiency with CI/CD tools`,
    salary_min: 100000,
    salary_max: 130000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-Level',
    status: 'active',
    posted_date: '2026-02-18',
    deadline: '2026-04-01',
    application_link: 'https://jobs.digitalplatforms.io/devops-engineer',
    skills: ['Kubernetes', 'Terraform', 'Jenkins', 'GCP', 'AWS', 'Linux'],
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Unlimited PTO'],
    company_size: '100-200',
    company_industry: 'Digital Services',
  },
}

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function SkillTag({ skill }) {
  return (
    <span className="px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700 rounded-full border border-primary-100">
      {skill}
    </span>
  )
}

function BenefitItem({ benefit }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircleIcon className="w-4 h-4 text-green-500" />
      <span>{benefit}</span>
    </div>
  )
}

function JobDescription({ description }) {
  // Split description into sections
  const sections = description?.split('\n\n') || []
  
  return (
    <div className="prose prose-lg max-w-none">
      {sections.map((section, index) => {
        // Check if this is a bold heading
        if (section.startsWith('**') && section.includes('**')) {
          const headingEnd = section.indexOf('**', 2)
          if (headingEnd > 0) {
            const heading = section.slice(2, headingEnd)
            const content = section.slice(headingEnd + 2).replace(/^[:\s-]+/, '').replace(/•/g, '•')
            return (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{heading}</h3>
                <div className="text-gray-600 whitespace-pre-line">{content}</div>
              </div>
            )
          }
        }
        // Regular paragraph with bullet points
        if (section.includes('•')) {
          const lines = section.split('\n').filter(line => line.trim())
          return (
            <div key={index} className="mb-4">
              <ul className="space-y-2">
                {lines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-primary-500 mt-1.5">•</span>
                    <span>{line.replace(/^[•\s]+/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        // Regular paragraph
        return section.trim() ? (
          <p key={index} className="text-gray-600 mb-4">{section}</p>
        ) : null
      })}
    </div>
  )
}

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJob(id)
        setJob(res)
      } catch (e) {
        console.error(e)
        // Fallback to dummy data
        const dummyJob = DUMMY_JOBS[id]
        if (dummyJob) {
          setJob(dummyJob)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchJob()
  }, [id])

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
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <BriefcaseIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          to="/jobs" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to Jobs</span>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc=')] opacity-30"></div>
              </div>
              
              {/* Job Info */}
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex items-end gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl font-bold text-primary-600 border-4 border-white">
                    {job.company?.name?.charAt(0) || 'J'}
                  </div>
                  <div className="flex-1 pb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-600 font-medium">{job.company?.name}</p>
                  </div>
                  <div className="flex gap-2 pb-2">
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        isSaved 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </button>
                      {showShareMenu && (
                        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[160px] z-10">
                          <button 
                            onClick={() => {
                              const linkToCopy = job.application_link || job.application_email || window.location.href
                              navigator.clipboard.writeText(linkToCopy)
                              toast.success('Application link copied!')
                              setShowShareMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          >
                            Copy Link
                          </button>
                          <button 
                            onClick={() => {
                              const url = encodeURIComponent(job.application_link || window.location.href)
                              const title = encodeURIComponent(job.title)
                              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
                              setShowShareMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          >
                            Share on LinkedIn
                          </button>
                          <button 
                            onClick={() => {
                              const url = encodeURIComponent(job.application_link || window.location.href)
                              const text = encodeURIComponent(`Check out this job: ${job.title}`)
                              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
                              setShowShareMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          >
                            Share on Twitter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    value={job.employment_type || job.jobType} 
                  />
                  <StatItem 
                    icon={UserGroupIcon} 
                    label="Level" 
                    value={job.experience_level || 'Mid-Level'} 
                  />
                </div>
                {job.industry && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>Industry: <span className="font-medium text-gray-900">{job.industry}</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">About This Role</h2>
              </div>
              <div className="p-6">
                <JobDescription description={job.description} />
              </div>
            </div>

            {/* Skills Card */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">Required Skills</h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Card */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">What We Offer</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <BenefitItem key={index} benefit={benefit} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card - Sticky */}
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Deadline Warning */}
              {daysUntilDeadline !== null && (
                <div className={`rounded-2xl p-4 flex items-center gap-3 ${
                  isDeadlineUrgent 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <ClockIcon className={`w-5 h-5 ${isDeadlineUrgent ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDeadlineUrgent ? 'text-red-700' : 'text-amber-700'}`}>
                      {isDeadlineUrgent ? 'Urgent' : 'Application Deadline'}
                    </p>
                    <p className={`text-sm ${isDeadlineUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                      {daysUntilDeadline === 0 
                        ? 'Deadline is today!' 
                        : `${daysUntilDeadline} days remaining`}
                    </p>
                  </div>
                </div>
              )}

              {/* Apply Button Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {job.application_link ? (
                  <>
                    <a
                      href={job.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-gradient py-3 px-6 rounded-xl font-semibold text-center block mb-4"
                    >
                      Apply Now
                    </a>
                    <p className="text-xs text-gray-500 text-center">
                      You'll be redirected to the company's website
                    </p>
                  </>
                ) : job.application_email ? (
                  <>
                    <a
                      href={`mailto:${job.application_email}?subject=Application for ${job.title}`}
                      className="w-full btn-gradient py-3 px-6 rounded-xl font-semibold text-center block mb-4"
                    >
                      <EnvelopeIcon className="w-5 h-5 inline-block mr-2" />
                      Send Application
                    </a>
                    <p className="text-sm text-gray-600 mb-3">
                      Send your resume and cover letter to:
                    </p>
                    <a
                      href={`mailto:${job.application_email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium block"
                    >
                      {job.application_email}
                    </a>
                  </>
                ) : (
                  <Button className="w-full btn-gradient py-3">
                    Apply for this Job
                  </Button>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full py-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
                    <BookmarkIcon className="w-4 h-4 inline-block mr-2" />
                    Save for Later
                  </button>
                </div>
              </div>

              {/* Company Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">About the Company</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{job.company?.name}</p>
                    </div>
                  </div>
                  {job.company_industry && (
                    <div className="flex items-start gap-3">
                      <SparklesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="font-medium text-gray-900">{job.company_industry}</p>
                      </div>
                    </div>
                  )}
                  {job.industry && !job.company_industry && (
                    <div className="flex items-start gap-3">
                      <SparklesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="font-medium text-gray-900">{job.industry}</p>
                      </div>
                    </div>
                  )}
                  {job.company_size && (
                    <div className="flex items-start gap-3">
                      <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Company Size</p>
                        <p className="font-medium text-gray-900">{job.company_size} employees</p>
                      </div>
                    </div>
                  )}
                  {job.company?.description && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{job.company.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Meta Card */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Posted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {job.posted_date ? formatDate(job.posted_date) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Deadline</span>
                    <span className="text-sm font-medium text-gray-900">
                      {job.deadline ? formatDate(job.deadline) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Job ID</span>
                    <span className="text-sm font-medium text-gray-900">#{job.id}</span>
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
