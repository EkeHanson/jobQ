import { useState } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import toast from 'react-hot-toast'

export default function JobPasteArea({ onExtract, loading = false }) {
  const [jobText, setJobText] = useState('')

  const handleExtract = async () => {
    if (!jobText.trim()) {
      toast.error('Please paste a job description first')
      return
    }

    if (jobText.length < 50) {
      toast.error('Job description seems too short. Please ensure you have the full description.')
      return
    }

    onExtract(jobText)
    setJobText('')
  }

  const handleClear = () => {
    setJobText('')
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Paste Job Description</h2>
      <p className="text-gray-600 mb-4">
        Copy and paste a job description from LinkedIn, Indeed, company websites, or emails. Our AI will automatically extract and structure the information.
      </p>

      <div className="space-y-4">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste job description here..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {jobText.length} characters
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleClear}
              disabled={loading || !jobText}
            >
              Clear
            </Button>
            <Button
              onClick={handleExtract}
              disabled={loading || !jobText.trim()}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2 inline-block" />
                  Extracting...
                </>
              ) : (
                'Extract with AI'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">✨ What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ AI automatically extracts job title, company, requirements, and more</li>
          <li>✓ Information is structured and ready to save</li>
          <li>✓ You can review and edit before saving</li>
          <li>✓ Application is added to your tracker</li>
        </ul>
      </div>
    </Card>
  )
}
