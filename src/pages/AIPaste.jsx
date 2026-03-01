import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import JobPasteArea from '../components/ai/JobPasteArea'
import ExtractionPreview from '../components/ai/ExtractionPreview'
import Card from '../components/common/Card'
import toast from 'react-hot-toast'

export default function AIPaste() {
  const [extractedData, setExtractedData] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('paste') // paste, preview, done

  const handleExtract = async (jobText) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted data
      const mockData = {
        company_name: 'TechCorp Solutions',
        job_title: 'Senior Backend Engineer',
        location: 'San Francisco, CA',
        location_type: 'hybrid',
        employment_type: 'full_time',
        experience_level: 'senior',
        salary_min: 150000,
        salary_max: 200000,
        salary_currency: 'USD',
        contact_email: 'careers@techcorp.com',
        deadline: '2024-03-15',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      }

      setExtractedData(mockData)
      setConfidence(0.92)
      setStep('preview')
      toast.success('Job details extracted successfully!')
    } catch (error) {
      toast.error('Failed to extract job details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSume = async (data) => {
    setLoading(true)
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Application saved successfully!')
      setExtractedData(null)
      setStep('paste')
    } catch (error) {
      toast.error('Failed to save application.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Job Extraction</h1>
          <p className="text-gray-600 mt-1">
            Paste any job description and let our AI extract the key information
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex gap-4">
          {['paste', 'preview', 'done'].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                step === s
                  ? 'bg-blue-600'
                  : ['paste', 'preview'].indexOf(s) < ['paste', 'preview'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        {step === 'paste' && (
          <JobPasteArea onExtract={handleExtract} loading={loading} />
        )}

        {step === 'preview' && extractedData && (
          <ExtractionPreview
            data={extractedData}
            confidence={confidence}
            onSave={handleSume}
            onEdit={() => setStep('paste')}
            loading={loading}
          />
        )}

        {/* Tips Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Copy the entire job posting for best results</li>
            <li>✓ Include job title, company, location, and requirements</li>
            <li>✓ The more complete the job description, the better the extraction</li>
            <li>✓ Always review extracted information before saving</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
