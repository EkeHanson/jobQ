import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import toast from 'react-hot-toast'
import { createJob, updateJob } from '../../store/jobSlice'

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const EXPERIENCE_LEVELS = ['Trainee', 'Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive']
const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Security',
  'Retail', 'Education', 'Construction', 'Transportation', 'Hospitality',
  'Media', 'Consulting', 'Legal', 'Real Estate', 'Energy',
  'Telecommunications', 'Government', 'Non-Profit', 'Other'
]
const SALARY_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']

const JobCreateForm = ({ initialData = null, onCancel, onSuccess }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.jobs)
  
  const [formData, setFormData] = useState({
    title: '',
    company: { name: '', website: '', description: '' },
    location: '',
    industry: 'Other',
    description: '',
    requirements: '',
    skills: '',
    job_type: 'Full-time',
    experience_level: 'Mid-Level',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    application_link: '',
    application_email: ''
  })
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || { name: '', website: '', description: '' },
        location: initialData.location || '',
        industry: initialData.industry || 'Other',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
        skills: initialData.skills || '',
        job_type: initialData.job_type || 'Full-time',
        experience_level: initialData.experience_level || 'Mid-Level',
        salary_min: initialData.salary_min?.toString() || '',
        salary_max: initialData.salary_max?.toString() || '',
        salary_currency: initialData.salary_currency || 'USD',
        application_link: initialData.application_link || '',
        application_email: initialData.application_email || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('company.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        company: { ...prev.company, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Job title is required')
      return
    }
    if (!formData.company?.name?.trim()) {
      toast.error('Company name is required')
      return
    }
    if (!formData.location.trim()) {
      toast.error('Location is required')
      return
    }
    if (!formData.application_link && !formData.application_email) {
      toast.error('Either application link or email is required')
      return
    }

    const submitData = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
    }

    try {
      if (initialData) {
        await dispatch(updateJob({ id: initialData.id, data: submitData })).unwrap()
        toast.success('Job updated successfully!')
      } else {
        const result = await dispatch(createJob(submitData)).unwrap()
        toast.success('Job created successfully!')
        if (onSuccess) {
          onSuccess(result)
          return
        }
        navigate(`/jobs/${result.id}`)
        return
      }
      
      if (onCancel) onCancel()
    } catch (err) {
      console.error('Failed to save job:', err)
      toast.error(err.message || 'Failed to save job')
    }
  }

  const isEdit = !!initialData

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Edit Job' : 'Create New Job'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Company Information
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company.name"
                value={formData.company?.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="TechCorp Inc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  name="company.website"
                  value={formData.company?.website || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                >
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Job Description
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="List the required skills and qualifications..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="JavaScript, React, Node.js, SQL"
            />
          </div>
        </div>

        {/* Salary Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Salary Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                {SALARY_CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Application Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Application Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Link
              </label>
              <input
                type="url"
                name="application_link"
                value={formData.application_link}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="https://company.com/careers/123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Email
              </label>
              <input
                type="email"
                name="application_email"
                value={formData.application_email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="careers@company.com"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="px-6"
          >
            {isEdit ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default JobCreateForm