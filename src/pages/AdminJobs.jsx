import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

const INDUSTRY_CHOICES = [
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
  'Other',
]

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [newJob, setNewJob] = useState({
    title: '',
    company_name: '',
    company_website: '',
    location: '',
    industry: 'Other',
    job_type: 'Full-time',
    experience_level: 'Mid-Level',
    application_link: '',
    application_email: '',
    description: '',
    requirements: '',
  })
  const { addToast } = useToast()

  useEffect(() => {
    fetchJobs(page)
  }, [page])

  const fetchJobs = async (pageNumber = 1) => {
    try {
      setLoading(true)
      const data = await adminService.getJobs({ page: pageNumber })
      const results = data.results || data
      setJobs(results || [])
      setTotalPages(data.total_pages || 1)
      setPage(Number(data.current_page) || pageNumber)
    } catch (err) {
      console.error('Failed to load jobs', err)
      addToast('Unable to load jobs. Check permissions or backend status.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNewJobChange = (event) => {
    const { name, value } = event.target
    setNewJob((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateJob = async () => {
    try {
      setLoading(true)
      const payload = {
        title: newJob.title,
        company: {
          name: newJob.company_name,
          website: newJob.company_website,
        },
        location: newJob.location,
        industry: newJob.industry,
        job_type: newJob.job_type,
        experience_level: newJob.experience_level,
        application_link: newJob.application_link,
        application_email: newJob.application_email,
        description: newJob.description,
        requirements: newJob.requirements,
      }
      await adminService.createJob(payload)
      addToast('Job created successfully.', 'success')
      setNewJob({
        title: '',
        company_name: '',
        company_website: '',
        location: '',
        industry: 'Other',
        job_type: 'Full-time',
        experience_level: 'Mid-Level',
        application_link: '',
        application_email: '',
        description: '',
        requirements: '',
      })
      setShowCreateForm(false)
      fetchJobs(page)
    } catch (err) {
      console.error('Failed to create job', err)
      const errorData = err.response?.data
      if (errorData) {
        const errorMessages = []
        for (const [field, messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`)
          } else if (typeof messages === 'object') {
            // Nested like company.website
            for (const [subField, subMessages] of Object.entries(messages)) {
              errorMessages.push(`${field}.${subField}: ${subMessages.join(', ')}`)
            }
          } else {
            errorMessages.push(`${field}: ${messages}`)
          }
        }
        addToast(`Validation errors: ${errorMessages.join('; ')}`, 'error')
      } else {
        addToast('Unable to create job. Check permissions or required fields.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setNewJob({
      title: job.title || '',
      company_name: job.company?.name || job.company || '',
      company_website: job.company?.website || '',
      location: job.location || '',
      industry: job.industry || '',
      job_type: job.job_type || 'Full-time',
      experience_level: job.experience_level || 'Mid-Level',
      application_link: job.application_link || '',
      application_email: job.application_email || '',
      description: job.description || '',
      requirements: job.requirements || '',
    })
    setShowEditForm(true)
  }

  const handleUpdateJob = async () => {
    try {
      setLoading(true)
      const payload = {
        title: newJob.title,
        company: {
          name: newJob.company_name,
          website: newJob.company_website,
        },
        location: newJob.location,
        industry: newJob.industry,
        job_type: newJob.job_type,
        experience_level: newJob.experience_level,
        application_link: newJob.application_link,
        application_email: newJob.application_email,
        description: newJob.description,
        requirements: newJob.requirements,
      }
      await adminService.updateJob(selectedJob.id, payload)
      addToast('Job updated successfully.', 'success')
      setShowEditForm(false)
      setSelectedJob(null)
      fetchJobs(page)
    } catch (err) {
      console.error('Failed to update job', err)
      const errorData = err.response?.data
      if (errorData) {
        const errorMessages = []
        for (const [field, messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`)
          } else if (typeof messages === 'object') {
            // Nested like company.website
            for (const [subField, subMessages] of Object.entries(messages)) {
              errorMessages.push(`${field}.${subField}: ${subMessages.join(', ')}`)
            }
          } else {
            errorMessages.push(`${field}: ${messages}`)
          }
        }
        addToast(`Validation errors: ${errorMessages.join('; ')}`, 'error')
      } else {
        addToast('Unable to update job. Check permissions.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = (job) => {
    setSelectedJob(job)
    setShowViewModal(true)
  }

  const handleDelete = async (job) => {
    if (!window.confirm('Delete this job permanently?')) return
    try {
      await adminService.deleteJob(job.id)
      addToast('Job deleted successfully.', 'success')
      fetchJobs(page)
    } catch (err) {
      console.error('Failed to delete job', err)
      addToast('Unable to delete job. Check permissions.', 'error')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-2">
          <a href="/admin" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </a>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage jobs and remove any outdated or invalid listings.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 transition-all duration-200 w-full sm:w-auto"
          >
            {showCreateForm ? 'Hide create form' : '+ Create new job'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm">💼</span>
              Create Job
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  name="title"
                  value={newJob.title}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  name="company_name"
                  value={newJob.company_name}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  name="company_website"
                  value={newJob.company_website}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  name="location"
                  value={newJob.location}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  name="industry"
                  value={newJob.industry}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                >
                  {INDUSTRY_CHOICES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="job_type"
                  value={newJob.job_type}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  name="experience_level"
                  value={newJob.experience_level}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Link</label>
                <input
                  name="application_link"
                  value={newJob.application_link}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Email</label>
                <input
                  name="application_email"
                  value={newJob.application_email}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleNewJobChange}
                  rows={4}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={newJob.requirements}
                  onChange={handleNewJobChange}
                  rows={4}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateJob} className="w-full sm:w-auto">
                Save Job
              </Button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedJob && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">✎</span>
              Edit Job: {selectedJob.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  name="title"
                  value={newJob.title}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  name="company_name"
                  value={newJob.company_name}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  name="company_website"
                  value={newJob.company_website}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  name="location"
                  value={newJob.location}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  name="industry"
                  value={newJob.industry}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="job_type"
                  value={newJob.job_type}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  name="experience_level"
                  value={newJob.experience_level}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Link</label>
                <input
                  name="application_link"
                  value={newJob.application_link}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Email</label>
                <input
                  name="application_email"
                  value={newJob.application_email}
                  onChange={handleNewJobChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleNewJobChange}
                  rows={4}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={newJob.requirements}
                  onChange={handleNewJobChange}
                  rows={4}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => {
                  setShowEditForm(false)
                  setSelectedJob(null)
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateJob} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                Update Job
              </Button>
            </div>
          </div>
        )}

        {/* Jobs Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-16">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-64">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-40">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-28">Job Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading jobs…
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center text-sm text-gray-500">No jobs found.</td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={job.id} className="hover:bg-cyan-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="truncate max-w-xs" title={job.title}>{job.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="truncate max-w-[150px]" title={job.company?.name || job.company}>{job.company?.name || job.company}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="truncate max-w-[120px]" title={job.location}>{job.location}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        {job.job_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewJob(job)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditJob(job)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Jobs Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading jobs…</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No jobs found.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-semibold text-gray-900 truncate" title={job.title}>{job.title}</h3>
                    <p className="text-sm text-gray-600 truncate" title={job.company?.name || job.company}>{job.company?.name || job.company}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 flex-shrink-0">
                    {job.job_type || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 truncate" title={job.location}>{job.location}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewJob(job)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditJob(job)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(job)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600">Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="flex-1 sm:flex-none"
            >
              ← Previous
            </Button>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
              className="flex-1 sm:flex-none"
            >
              Next →
            </Button>
          </div>
        </div>

        {/* View Job Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm">💼</span>
              Job Details
            </h2>
            {selectedJob && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.title}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.company?.name || selectedJob.company || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company Website</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedJob.company?.website || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.location || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industry</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.industry || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Type</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.job_type || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience Level</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.experience_level || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Application Link</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{selectedJob.application_link || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Application Email</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.application_email || '—'}</p>
                  </div>
                </div>
                {selectedJob.description && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedJob.description}</p>
                  </div>
                )}
                {selectedJob.requirements && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requirements</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedJob.requirements}</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
