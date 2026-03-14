import { useState, useEffect } from 'react'
import { useToast } from '../common/Toast'
import aiService from '../../services/ai'
import profileService from '../../services/profiles'
import Card from '../common/Card'
import Button from '../common/Button'
import { 
  DocumentIcon, 
  ArrowUpTrayIcon, 
  ClipboardDocumentIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function AICareerTools() {
  const { addToast } = useToast()
  
  // Main state
  const [step, setStep] = useState('analyze') // 'analyze' | 'results' | 'optimize'
  const [jobDescription, setJobDescription] = useState('')
  const [jobSkills, setJobSkills] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [matchResult, setMatchResult] = useState(null)
  const [optimizeResult, setOptimizeResult] = useState(null)
  
  // Resume source options
  const [resumeSource, setResumeSource] = useState('paste') // 'paste', 'upload', 'profile'
  const [profileResumes, setProfileResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  // Fetch profile resumes when switching to profile tab
  useEffect(() => {
    if (resumeSource === 'profile') {
      fetchProfileResumes()
    }
  }, [resumeSource])

  const fetchProfileResumes = async () => {
    try {
      const response = await profileService.getProfiles()
      const profiles = response.data
      if (profiles && profiles.length > 0) {
        const profileId = profiles[0].id
        const resumesResponse = await profileService.getResumes(profileId)
        setProfileResumes(resumesResponse.data || [])
      }
    } catch (error) {
      console.error('Error fetching profile resumes:', error)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain']
    
    if (!allowedTypes.includes(file.type)) {
      addToast('Please upload a PDF, DOC, DOCX, or TXT file', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be less than 5MB', 'error')
      return
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    if (file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setResumeText(e.target.result)
      }
      reader.readAsText(file)
    } else {
      setResumeText(`[File: ${file.name}]`)
    }
    
    addToast('File uploaded successfully', 'success')
  }

  const handleSelectProfileResume = (resume) => {
    setSelectedResumeId(resume.id)
    setResumeText(`[Resume URL: ${resume.file}]`)
    addToast('Resume selected from profile', 'success')
  }

  const handleAnalyze = async () => {
    if (!jobDescription && !jobSkills) {
      addToast('Please provide a job description or job skills', 'error')
      return
    }

    if (!resumeText && resumeSource !== 'profile') {
      addToast('Please provide your resume', 'error')
      return
    }

    if (resumeSource === 'profile' && !selectedResumeId) {
      addToast('Please select a resume from your profile', 'error')
      return
    }

    setAnalyzing(true)
    try {
      const response = await aiService.analyzeJobMatch(jobDescription, jobSkills, resumeText)
      setMatchResult(response.data)
      setStep('results')
      addToast('Job match analysis complete!', 'success')
    } catch (error) {
      console.error('Job match analysis failed:', error)
      addToast('Failed to analyze job match', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleOptimize = async () => {
    setOptimizing(true)
    try {
      const response = await aiService.optimizeResume(jobDescription, resumeText)
      setOptimizeResult(response.data)
      setStep('optimize')
      addToast('Resume optimization complete!', 'success')
    } catch (error) {
      console.error('Resume optimization failed:', error)
      addToast('Failed to optimize resume', 'error')
    } finally {
      setOptimizing(false)
    }
  }

  const resetForm = () => {
    setResumeText('')
    setSelectedResumeId(null)
    setUploadedFile(null)
    setMatchResult(null)
    setOptimizeResult(null)
    setStep('analyze')
  }

  const startNewAnalysis = () => {
    resetForm()
  }

  const goBackToResults = () => {
    setStep('results')
    setOptimizeResult(null)
  }

  const getMatchScore = () => {
    return matchResult?.match_score || matchResult?.matchScore || 0
  }

  const isSatisfactory = getMatchScore() >= 70

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Career Tools</h2>
        <p className="text-gray-600 mt-1">
          Analyze your resume against job descriptions and get personalized optimization tips
        </p>
      </div>

      {/* Step Indicator */}
      {step !== 'analyze' && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${step === 'analyze' ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'analyze' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {step === 'analyze' ? '1' : <CheckCircleIcon className="w-5 h-5" />}
            </div>
            <span className="font-medium">Analyze</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step === 'results' ? 'text-blue-600' : step === 'optimize' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'results' ? 'bg-blue-100' : step === 'optimize' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {step === 'results' ? '2' : step === 'optimize' ? <CheckCircleIcon className="w-5 h-5" /> : '2'}
            </div>
            <span className="font-medium">Results</span>
          </div>
          {step === 'optimize' && (
            <>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">Optimize</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 1: Analysis Form */}
      {step === 'analyze' && (
        <Card>
          <div className="space-y-4">
            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>

            {/* Job Skills (Alternative) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Job Skills (comma-separated)
              </label>
              <input
                type="text"
                value={jobSkills}
                onChange={(e) => setJobSkills(e.target.value)}
                placeholder="e.g., JavaScript, React, Node.js, Python..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resume Source Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Resume *
              </label>
              
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setResumeSource('paste'); resetForm(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    resumeSource === 'paste'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ClipboardDocumentIcon className="w-5 h-5" />
                  Paste Resume
                </button>
                
                <button
                  type="button"
                  onClick={() => { setResumeSource('upload'); resetForm(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    resumeSource === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  Upload File
                </button>
                
                <button
                  type="button"
                  onClick={() => { setResumeSource('profile'); resetForm(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    resumeSource === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <DocumentIcon className="w-5 h-5" />
                  From Profile
                </button>
              </div>

              {/* Tab Content */}
              <div className="border border-gray-200 rounded-lg p-4 min-h-[150px]">
                {resumeSource === 'paste' && (
                  <div>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your current resume text here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                    />
                  </div>
                )}

                {resumeSource === 'upload' && (
                  <div className="space-y-4">
                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="resume-upload-career"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="resume-upload-career" className="cursor-pointer">
                          <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-700 font-medium">Click to upload your resume</p>
                          <p className="text-gray-500 text-sm mt-1">PDF, DOC, DOCX, or TXT (max 5MB)</p>
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setUploadedFile(null); setResumeText(''); }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {resumeSource === 'profile' && (
                  <div className="space-y-4">
                    {profileResumes.length === 0 ? (
                      <div className="text-center py-8">
                        <DocumentIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-600">No resumes in your profile yet.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {profileResumes.map((resume) => (
                          <button
                            key={resume.id}
                            type="button"
                            onClick={() => handleSelectProfileResume(resume)}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                              selectedResumeId === resume.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <DocumentIcon className={`w-6 h-6 ${selectedResumeId === resume.id ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">
                                  {resume.original_filename || `Resume #${resume.id}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {selectedResumeId === resume.id && (
                              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              loading={analyzing}
              disabled={analyzing}
              className="w-full"
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
            >
              Analyze Job Match
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Results */}
      {step === 'results' && matchResult && (
        <div className="space-y-4">
          {/* Overall Match Score */}
          <Card className={`text-white ${isSatisfactory ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{getMatchScore()}%</div>
              <div className="text-xl opacity-90">
                {isSatisfactory ? 'Great Match! 🎉' : 'Needs Improvement'}
              </div>
            </div>
          </Card>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {matchResult.skills_match || matchResult.skillsMatch || 0}%
                </div>
                <div className="text-gray-600">Skills Match</div>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {matchResult.experience_match || matchResult.experienceMatch || 0}%
                </div>
                <div className="text-gray-600">Experience Match</div>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {matchResult.ats_score || matchResult.atsScore || 0}%
                </div>
                <div className="text-gray-600">ATS Score</div>
              </div>
            </Card>
          </div>

          {/* Missing Skills */}
          {matchResult.missing_skills && matchResult.missing_skills.length > 0 && (
            <Card>
              <h3 className="font-semibold text-red-700 mb-3">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Matching Skills */}
          {matchResult.matching_skills && matchResult.matching_skills.length > 0 && (
            <Card>
              <h3 className="font-semibold text-green-700 mb-3">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matching_skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {matchResult.recommendations && matchResult.recommendations.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {matchResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-500 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!isSatisfactory && (
              <Button
                onClick={handleOptimize}
                loading={optimizing}
                disabled={optimizing}
                className="flex-1"
                icon={<SparklesIcon className="w-5 h-5" />}
              >
                Optimize My Resume
              </Button>
            )}
            <Button
              onClick={startNewAnalysis}
              variant="outline"
              className="flex-1"
              icon={<ArrowPathIcon className="w-5 h-5" />}
            >
              New Analysis
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Optimization Results */}
      {step === 'optimize' && optimizeResult && (
        <div className="space-y-4">
          {/* Back button */}
          <button
            onClick={goBackToResults}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Results
          </button>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">
                  {optimizeResult.resume_score || optimizeResult.resumeScore || 0}%
                </div>
                <div className="text-lg opacity-90">Resume Score</div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">
                  {optimizeResult.ats_friendly_score || optimizeResult.atsFriendlyScore || 0}%
                </div>
                <div className="text-lg opacity-90">ATS Friendly Score</div>
              </div>
            </Card>
          </div>

          {/* Missing Keywords */}
          {optimizeResult.missing_keywords && optimizeResult.missing_keywords.length > 0 && (
            <Card>
              <h3 className="font-semibold text-red-700 mb-3">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {optimizeResult.missing_keywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Improvement Suggestions */}
          {optimizeResult.improvement_suggestions && optimizeResult.improvement_suggestions.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {optimizeResult.improvement_suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-500 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Action Items */}
          {optimizeResult.action_items && optimizeResult.action_items.length > 0 && (
            <Card>
              <h3 className="font-semibold text-green-700 mb-3">Action Items</h3>
              <ul className="space-y-2">
                {optimizeResult.action_items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Optimized Resume */}
          {optimizeResult.optimized_resume && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Optimized Resume</h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 max-h-96 overflow-y-auto">
                {optimizeResult.optimized_resume}
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(optimizeResult.optimized_resume)
                  addToast('Optimized resume copied to clipboard!', 'success')
                }}
                className="mt-4"
              >
                Copy to Clipboard
              </Button>
            </Card>
          )}

          {/* New Analysis Button */}
          <Button
            onClick={startNewAnalysis}
            variant="outline"
            className="w-full"
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Start New Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
