import Card from '../common/Card'
import Button from '../common/Button'
import Badge from '../common/Badge'
import Input from '../common/Input'
import { useState } from 'react'
import { formatCurrency } from '../../utils/formatters'

export default function ExtractionPreview({ data, confidence, onSave, onEdit, loading = false }) {
  const [editedData, setEditedData] = useState(data)

  const handleFieldChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value })
  }

  const getConfidenceColor = () => {
    if (confidence >= 0.85) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Extracted Information</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Confidence:</span>
          <Badge variant="subtle" className={`${getConfidenceColor()} font-semibold`}>
            {Math.round(confidence * 100)}%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={editedData?.company_name || ''}
              onChange={(e) => handleFieldChange('company_name', e.target.value)}
            />
            <Input
              label="Job Title"
              value={editedData?.job_title || ''}
              onChange={(e) => handleFieldChange('job_title', e.target.value)}
            />
            <Input
              label="Location"
              value={editedData?.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={editedData?.location_type || 'onsite'}
              onChange={(e) => handleFieldChange('location_type', e.target.value)}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        {/* Employment Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
          <div className="space-y-4">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={editedData?.employment_type || 'full_time'}
              onChange={(e) => handleFieldChange('employment_type', e.target.value)}
            >
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={editedData?.experience_level || 'mid'}
              onChange={(e) => handleFieldChange('experience_level', e.target.value)}
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead / Manager</option>
            </select>
            <Input
              label="Contact Email"
              type="email"
              value={editedData?.contact_email || ''}
              onChange={(e) => handleFieldChange('contact_email', e.target.value)}
            />
          </div>
        </div>

        {/* Salary Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Minimum Salary"
              type="number"
              value={editedData?.salary_min || ''}
              onChange={(e) => handleFieldChange('salary_min', e.target.value)}
            />
            <Input
              label="Maximum Salary"
              type="number"
              value={editedData?.salary_max || ''}
              onChange={(e) => handleFieldChange('salary_max', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={editedData?.salary_currency || 'USD'}
                onChange={(e) => handleFieldChange('salary_currency', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {editedData?.skills?.map((skill, idx) => (
              <Badge key={idx} variant="subtle">
                {skill}
              </Badge>
            )) || <p className="text-gray-500">No skills identified</p>}
          </div>
        </div>

        {/* Deadline */}
        <div className="md:col-span-2">
          <Input
            label="Application Deadline"
            type="date"
            value={editedData?.deadline || ''}
            onChange={(e) => handleFieldChange('deadline', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={() => onSave(editedData)} loading={loading}>
          Save Application
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Edit All Details
        </Button>
      </div>
    </Card>
  )
}
