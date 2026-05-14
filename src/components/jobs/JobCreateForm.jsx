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

  const InputField = ({ label, name, type = "text", placeholder, required, icon: Icon }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 ${Icon ? 'pl-9' : ''} text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
          placeholder={placeholder}
        />
      </div>
    </div>
  )

  const SelectField = ({ label, name, options, value }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )

  const TextAreaField = ({ label, name, rows = 3, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        rows={rows}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Job' : 'New Job'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Fill in the details below
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Basic Info - 2 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField label="Job Title" name="title" placeholder="e.g., Senior Software Engineer" required />
          <InputField label="Location" name="location" placeholder="e.g., San Francisco, CA" required />
          <SelectField label="Job Type" name="job_type" options={JOB_TYPES} value={formData.job_type} />
          <SelectField label="Experience" name="experience_level" options={EXPERIENCE_LEVELS} value={formData.experience_level} />
        </div>

        {/* Company Info - 2 Column */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Company Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Company Name" name="company.name" placeholder="e.g., TechCorp Inc." required />
            <InputField label="Company Website" name="company.website" type="url" placeholder="https://example.com" />
            <SelectField label="Industry" name="industry" options={INDUSTRIES} value={formData.industry} />
          </div>
        </div>

        {/* Job Description */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Job Description</h3>
          <div className="space-y-3">
            <TextAreaField 
              label="Description" 
              name="description" 
              rows={3}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
            <TextAreaField 
              label="Requirements" 
              name="requirements" 
              rows={2}
              placeholder="List the required skills and qualifications..."
            />
            <InputField 
              label="Skills" 
              name="skills" 
              placeholder="JavaScript, React, Node.js (comma separated)"
            />
          </div>
        </div>

        {/* Salary - Compact Row */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Salary (Optional)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min ($)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="50,000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max ($)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="100,000"
              />
            </div>
            <SelectField label="Currency" name="salary_currency" options={SALARY_CURRENCIES} value={formData.salary_currency} />
          </div>
        </div>

        {/* Application Info */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">How to Apply</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField 
              label="Application Link" 
              name="application_link" 
              type="url"
              placeholder="https://company.com/careers/123"
            />
            <InputField 
              label="Application Email" 
              name="application_email" 
              type="email"
              placeholder="careers@company.com"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Provide at least one application method (link or email)
          </p>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            size="sm"
            className="px-4 py-1.5 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            size="sm"
            className="px-4 py-1.5 text-sm"
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default JobCreateForm