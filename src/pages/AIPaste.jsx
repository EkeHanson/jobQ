import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import JobPasteArea from '../components/ai/JobPasteArea'
import ExtractionPreview from '../components/ai/ExtractionPreview'
import Card from '../components/common/Card'
import toast from 'react-hot-toast'
import jobService from '../services/jobs'
import { useApplications } from '../hooks/useApplications'

export default function AIPaste() {
  const { create } = useApplications()
  const [extractedData, setExtractedData] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('paste') // paste, preview, done

  const handleExtract = async (jobText) => {
    setLoading(true)
    try {
      const { task_id } = await jobService.extractJobFromText(jobText)

      // poll for completion
      let statusResp = await jobService.getExtractionStatus(task_id)
      while (statusResp.status !== 'completed') {
        await new Promise((r) => setTimeout(r, 500))
        statusResp = await jobService.getExtractionStatus(task_id)
      }

      const resultResp = await jobService.getExtractionResult(task_id)
      const resultData = resultResp.result || {}
      setExtractedData(resultData)

      // simple confidence heuristic
      setConfidence(0.9)
      setStep('preview')
      toast.success('Job details extracted successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to extract job details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSume = async (data) => {
    setLoading(true)
    try {
      // build payload matching Applications page form
      const payload = {
        job: {
          title: data.job_title || data.title || '',
          company: { name: data.company_name || data.company || '' },
        },
        status: 'saved',
        applied_date: data.applied_date || null,
        deadline: data.deadline || null,
        notes: data.notes || '',
      }
      await create(payload)
      toast.success('Application saved successfully!')
      setExtractedData(null)
      setStep('paste')
    } catch (error) {
      console.error(error)
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
