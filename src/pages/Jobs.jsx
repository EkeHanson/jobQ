import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useJobs } from '../hooks/useJobs'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import { formatSalaryRange } from '../utils/formatters'
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  XMarkIcon,
  BookmarkIcon,
  EyeIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const ITEMS_PER_PAGE = 12

// const DUMMY_JOBS = [
//   {
//     id: 1,
//     title: 'Senior Frontend Developer',
//     company: { name: 'Tech Innovations Inc', logo: null },
//     location: 'San Francisco, CA',
//     description: 'We are looking for an experienced Frontend Developer with expertise in React and modern web technologies.',
//     salary: '$120,000 - $150,000',
//     jobType: 'Full-time',
//     experience_level: 'Senior',
//     posted_date: '2026-02-15',
//     skills: ['React', 'TypeScript', 'Redux', 'Tailwind'],
//   },
//   {
//     id: 2,
//     title: 'Backend Engineer',
//     company: { name: 'Cloud Solutions Ltd', logo: null },
//     location: 'New York, NY',
//     description: 'Join our team to build scalable backend systems using Node.js and microservices architecture.',
//     salary: '$110,000 - $140,000',
//     jobType: 'Full-time',
//     experience_level: 'Mid-Level',
//     posted_date: '2026-02-20',
//     skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
//   },
//   {
//     id: 3,
//     title: 'DevOps Engineer',
//     company: { name: 'Digital Platforms Co', logo: null },
//     location: 'Austin, TX',
//     description: 'Seeking a DevOps specialist to manage cloud infrastructure, CI/CD pipelines, and Kubernetes deployments.',
//     salary: '$100,000 - $130,000',
//     jobType: 'Full-time',
//     experience_level: 'Mid-Level',
//     posted_date: '2026-02-18',
//     skills: ['Kubernetes', 'Terraform', 'Jenkins', 'GCP'],
//   },
//   {
//     id: 4,
//     title: 'Full Stack Developer',
//     company: { name: 'StartUp Ventures', logo: null },
//     location: 'Remote',
//     description: 'Build end-to-end web applications using React, Node.js, and PostgreSQL in a fast-paced startup environment.',
//     salary: '$90,000 - $120,000',
//     jobType: 'Full-time',
//     experience_level: 'Mid-Level',
//     posted_date: '2026-02-22',
//     skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL'],
//   },
//   {
//     id: 5,
//     title: 'Mobile App Developer',
//     company: { name: 'AppWorks Studios', logo: null },
//     location: 'Seattle, WA',
//     description: 'Develop iOS and Android applications using React Native and latest mobile technologies.',
//     salary: '$95,000 - $125,000',
//     jobType: 'Full-time',
//     experience_level: 'Mid-Level',
//     posted_date: '2026-02-19',
//     skills: ['React Native', 'iOS', 'Android', 'Firebase'],
//   },
//   {
//     id: 6,
//     title: 'Data Scientist',
//     company: { name: 'Analytics Pro', logo: null },
//     location: 'Boston, MA',
//     description: 'Work with machine learning models, data analysis, and AI solutions to drive business insights.',
//     salary: '$105,000 - $145,000',
//     jobType: 'Full-time',
//     experience_level: 'Mid-Level',
//     posted_date: '2026-02-21',
//     skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'],
//   },
// ]

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship']
const EXPERIENCE_LEVELS = ['All', 'Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive']
const INDUSTRIES = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Security',
  'Retail',
  'Education',
  'Construction',
  'Transportation',
  'Hospitality',
  'Media',
  'Consulting',
  'Legal',
  'Real Estate',
  'Energy',
  'Telecommunications',
  'Government',
  'Non-Profit',
  'Other'
]

function JobCard({ job, onView }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const daysAgo = useMemo(() => {
    const postedDate = job.posted_date || job.posted_at
    if (!postedDate) return 0
    const posted = new Date(postedDate)
    const now = new Date()
    const diffTime = Math.abs(now - posted)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [job.posted_date, job.posted_at])

  return (
    <div 
      className={`group bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
        isHovered 
          ? 'border-primary-200 shadow-lg shadow-primary-500/10 -translate-y-1' 
          : 'border-gray-100 shadow-sm hover:border-primary-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-xl font-bold text-primary-600">
              {job.company?.name?.charAt(0) || 'J'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500">{job.company?.name}</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved) }}
            className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50'}`}
          >
            <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.slice(0, 4).map((skill, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full border border-gray-100"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 4 && (
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-500 rounded-full">
              +{job.skills.length - 4}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>{job.salary || formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BriefcaseIcon className="w-4 h-4" />
            <span>{job.jobType}</span>
          </div>
          {job.industry && (
            <div className="flex items-center gap-1">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>{job.industry}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>{daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => { e.stopPropagation(); onView?.(job) }}
              className="text-primary-600 hover:text-primary-700"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </Button>
            <Link to={`/jobs/${job.id}`}>
              <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                Details
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
        <BriefcaseIcon className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  )
}

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> jobs
        {totalPages > 1 && (
          <span className="ml-2 text-gray-400">(Page {currentPage} of {totalPages})</span>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="secondary"
            size="sm"
            disabled={!currentPage || currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="secondary"
            size="sm"
            disabled={!currentPage || currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Build filters for API - LIFO (Last In First Out) with ordering by -posted_at
  const jobFilters = useMemo(() => ({
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
    ordering: '-posted_at', // LIFO - most recent first (using posted_at field)
    search: searchQuery || undefined,
    job_type: selectedJobType !== 'All' ? selectedJobType : undefined,
    experience_level: selectedExperience !== 'All' ? selectedExperience : undefined,
    industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
  }), [currentPage, searchQuery, selectedJobType, selectedExperience, selectedIndustry])

  const { jobs, loading, pagination } = useJobs(jobFilters)

  // Use API results (or empty list if none)
  const jobsList = jobs || []

  // Calculate pagination for dummy data
  const totalItems = pagination?.count || jobsList.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedJobType, selectedExperience, selectedIndustry])

  const hasActiveFilters = searchQuery || selectedJobType !== 'All' || selectedExperience !== 'All' || selectedIndustry !== 'All'

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedJobType('All')
    setSelectedExperience('All')
    setSelectedIndustry('All')
    setCurrentPage(1)
  }

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Filter jobs (client-side for dummy data)
  const filteredJobs = useMemo(() => {
    return jobsList.filter(job => {
      const matchesSearch = searchQuery === '' || 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesJobType = selectedJobType === 'All' || job.jobType === selectedJobType
      const matchesExperience = selectedExperience === 'All' || job.experience_level === selectedExperience
      const matchesIndustry = selectedIndustry === 'All' || job.industry === selectedIndustry
      
      return matchesSearch && matchesJobType && matchesExperience && matchesIndustry
    })
  }, [jobsList, searchQuery, selectedJobType, selectedExperience, selectedIndustry])

  // Paginate dummy data
  const paginatedJobs = useMemo(() => {
    if (jobs && jobs.length > 0) {
      return jobs // API already returns paginated data
    }
    // Dummy data pagination
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE)
  }, [jobs, filteredJobs, currentPage])

  const displayTotalPages = pagination?.count ? Math.ceil(pagination.count / ITEMS_PER_PAGE) : totalPages

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-gray-500 mt-1">
              Discover exciting job opportunities
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                  {[searchQuery, selectedJobType !== 'All', selectedExperience !== 'All', selectedIndustry !== 'All'].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Job Type Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((type) => (
                      <FilterChip
                        key={type}
                        label={type}
                        isActive={selectedJobType === type}
                        onClick={() => setSelectedJobType(type)}
                      />
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <FilterChip
                        key={level}
                        label={level}
                        isActive={selectedExperience === level}
                        onClick={() => setSelectedExperience(level)}
                      />
                    ))}
                  </div>
                </div>

                {/* Industry Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.slice(0, 10).map((industry) => (
                      <FilterChip
                        key={industry}
                        label={industry}
                        isActive={selectedIndustry === industry}
                        onClick={() => setSelectedIndustry(industry)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {hasActiveFilters ? (
              <>Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> filtered jobs</>
            ) : (
              <>Showing <span className="font-semibold text-gray-900">{totalItems}</span> total jobs</>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowsRightLeftIcon className="w-4 h-4" />
            <span>Sorted by: <span className="font-medium text-gray-700">Newest First (LIFO)</span></span>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : paginatedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={displayTotalPages}
              totalItems={hasActiveFilters ? filteredJobs.length : totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState onClear={handleClearFilters} />
        )}
      </div>
    </DashboardLayout>
  )
}
