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
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function AICareerTools() {
  const { addToast } = useToast()
  
  // Main state
  const [step, setStep] = useState('analyze')
  const [jobDescription, setJobDescription] = useState('')
  const [jobSkills, setJobSkills] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [matchResult, setMatchResult] = useState(null)
  const [optimizeResult, setOptimizeResult] = useState(null)
  
  // Resume source options
  const [resumeSource, setResumeSource] = useState('paste')
  const [profileResumes, setProfileResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Responsive step indicator component
  const StepIndicator = () => (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center justify-between min-w-[300px] sm:min-w-0 sm:justify-center gap-2 sm:gap-4">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            step === 'analyze' ? 'bg-blue-600 text-white' : 
            step === 'results' || step === 'optimize' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step === 'analyze' ? '1' : step === 'results' || step === 'optimize' ? <CheckCircleIcon className="w-5 h-5" /> : '1'}
          </div>
          <span className={`text-sm font-medium ${
            step === 'analyze' ? 'text-blue-600' : 
            step === 'results' || step === 'optimize' ? 'text-green-600' : 'text-gray-500'
          }`}>
            Analyze
          </span>
        </div>

        {/* Connector 1 */}
        <div className={`w-8 sm:w-12 h-0.5 rounded-full ${
          step === 'results' || step === 'optimize' ? 'bg-green-600' : 'bg-gray-300'
        }`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            step === 'results' ? 'bg-blue-600 text-white' : 
            step === 'optimize' ? 'bg-green-600 text-white' : 
            step === 'analyze' ? 'bg-gray-200 text-gray-600' : 'bg-gray-200 text-gray-600'
          }`}>
            {step === 'results' ? '2' : step === 'optimize' ? <CheckCircleIcon className="w-5 h-5" /> : '2'}
          </div>
          <span className={`text-sm font-medium ${
            step === 'results' ? 'text-blue-600' : 
            step === 'optimize' ? 'text-green-600' : 'text-gray-500'
          }`}>
            Results
          </span>
        </div>

        {/* Connector 2 (only show when in optimize step) */}
        {step === 'optimize' && (
          <>
            <div className="w-8 sm:w-12 h-0.5 bg-green-600 rounded-full" />
            
            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-green-600">
                Optimize
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section - Responsive */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            AI Career Tools
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Analyze your resume against job descriptions and get personalized optimization tips powered by artificial intelligence
          </p>
        </div>

        {/* Step Indicator - Only show when not in analyze step */}
        {step !== 'analyze' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <StepIndicator />
          </div>
        )}

        {/* Step 1: Analysis Form */}
        {step === 'analyze' && (
          <Card className="overflow-hidden">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Job Description Section */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Job Description <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="w-full min-h-[120px] sm:min-h-[150px] px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  rows={6}
                />
              </div>

              {/* Job Skills Alternative */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Or Job Skills
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-gray-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js, Python, AWS..."
                  className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Resume Source Selection */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Your Resume <span className="text-red-500">*</span>
                  </span>
                </label>
                
                {/* Source Tabs - Mobile Responsive */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'paste', label: 'Paste', icon: ClipboardDocumentIcon },
                    { id: 'upload', label: 'Upload', icon: ArrowUpTrayIcon },
                    { id: 'profile', label: 'Profile', icon: DocumentIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { 
                        setResumeSource(tab.id)
                        resetForm()
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        resumeSource === tab.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content - Responsive */}
                <div className="border-2 border-gray-100 rounded-xl p-4 sm:p-6 bg-gray-50 min-h-[200px]">
                  {/* Paste Tab */}
                  {resumeSource === 'paste' && (
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your current resume text here..."
                      className="w-full min-h-[150px] sm:min-h-[200px] px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={8}
                    />
                  )}

                  {/* Upload Tab */}
                  {resumeSource === 'upload' && (
                    <div className="space-y-4">
                      {!uploadedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-blue-400 transition-colors bg-white">
                          <input
                            type="file"
                            id="resume-upload-career"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label htmlFor="resume-upload-career" className="cursor-pointer block">
                            <ArrowUpTrayIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">
                              Click to upload your resume
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              PDF, DOC, DOCX, or TXT (max 5MB)
                            </p>
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                            <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setUploadedFile(null); setResumeText(''); }}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-auto justify-center"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profile Tab */}
                  {resumeSource === 'profile' && (
                    <div className="space-y-4">
                      {profileResumes.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 bg-white rounded-xl">
                          <DocumentIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3" />
                          <p className="text-sm sm:text-base text-gray-600">No resumes in your profile yet.</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Upload one first to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {profileResumes.map((resume) => (
                            <button
                              key={resume.id}
                              type="button"
                              onClick={() => handleSelectProfileResume(resume)}
                              className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedResumeId === resume.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0">
                                <DocumentIcon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                                  selectedResumeId === resume.id ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                <div className="text-left">
                                  <p className={`font-medium text-sm sm:text-base ${
                                    selectedResumeId === resume.id ? 'text-blue-900' : 'text-gray-900'
                                  }`}>
                                    {resume.original_filename || `Resume #${resume.id}`}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {new Date(resume.uploaded_at).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              {selectedResumeId === resume.id && (
                                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 ml-auto sm:ml-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                loading={analyzing}
                disabled={analyzing}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                icon={<MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Job Match'}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Results */}
        {step === 'results' && matchResult && (
          <div className="space-y-4 sm:space-y-6">
            {/* Overall Match Score Card */}
            <Card className={`text-white overflow-hidden ${
              isSatisfactory 
                ? 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700' 
                : 'bg-gradient-to-br from-orange-500 via-red-600 to-red-700'
            }`}>
              <div className="p-6 sm:p-8 text-center">
                <div className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-2 sm:mb-4">
                  {getMatchScore()}%
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl opacity-90 font-medium">
                  {isSatisfactory ? 'Great Match! 🎉' : 'Needs Improvement'}
                </div>
                <p className="text-xs sm:text-sm opacity-75 mt-2">
                  {isSatisfactory 
                    ? 'Your resume aligns well with this position' 
                    : 'Consider optimizing your resume for better results'}
                </p>
              </div>
            </Card>

            {/* Detailed Scores Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Skills Match', value: matchResult.skills_match || matchResult.skillsMatch || 0, color: 'blue' },
                { label: 'Experience Match', value: matchResult.experience_match || matchResult.experienceMatch || 0, color: 'green' },
                { label: 'ATS Score', value: matchResult.ats_score || matchResult.atsScore || 0, color: 'purple' }
              ].map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    <div className={`text-3xl sm:text-4xl font-bold text-${item.color}-600 mb-1`}>
                      {item.value}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{item.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Missing Skills */}
            {matchResult.missing_skills && matchResult.missing_skills.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-red-700 mb-3">
                    Missing Skills to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missing_skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Matching Skills */}
            {matchResult.matching_skills && matchResult.matching_skills.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-3">
                    Your Matching Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matching_skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Recommendations */}
            {matchResult.recommendations && matchResult.recommendations.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Personalized Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {matchResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span className="flex-1">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Action Buttons - Responsive Stack */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {!isSatisfactory && (
                <Button
                  onClick={handleOptimize}
                  loading={optimizing}
                  disabled={optimizing}
                  className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  icon={<SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                >
                  {optimizing ? 'Optimizing...' : 'Optimize My Resume'}
                </Button>
              )}
              <Button
                onClick={startNewAnalysis}
                variant="outline"
                className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                icon={<ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              >
                New Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Optimization Results */}
        {step === 'optimize' && optimizeResult && (
          <div className="space-y-4 sm:space-y-6">
            {/* Back Button */}
            <button
              onClick={goBackToResults}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors"
            >
              <span className="text-lg">←</span>
              <span>Back to Results</span>
            </button>

            {/* Scores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                    {optimizeResult.resume_score || optimizeResult.resumeScore || 0}%
                  </div>
                  <div className="text-base sm:text-lg opacity-90">Resume Score</div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                    {optimizeResult.ats_friendly_score || optimizeResult.atsFriendlyScore || 0}%
                  </div>
                  <div className="text-base sm:text-lg opacity-90">ATS Friendly</div>
                </div>
              </Card>
            </div>

            {/* Missing Keywords */}
            {optimizeResult.missing_keywords && optimizeResult.missing_keywords.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-red-700 mb-3">
                    Missing Keywords to Include
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {optimizeResult.missing_keywords.map((keyword, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Improvement Suggestions */}
            {optimizeResult.improvement_suggestions && optimizeResult.improvement_suggestions.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Improvement Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {optimizeResult.improvement_suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span className="flex-1">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Action Items */}
            {optimizeResult.action_items && optimizeResult.action_items.length > 0 && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-3">
                    Action Items Checklist
                  </h3>
                  <ul className="space-y-3">
                    {optimizeResult.action_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                        <input 
                          type="checkbox" 
                          className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                        />
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Optimized Resume */}
            {optimizeResult.optimized_resume && (
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Optimized Resume
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 whitespace-pre-wrap text-xs sm:text-sm text-gray-700 max-h-96 overflow-y-auto font-mono border border-gray-200">
                    {optimizeResult.optimized_resume}
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(optimizeResult.optimized_resume)
                      addToast('Optimized resume copied to clipboard!', 'success')
                    }}
                    className="mt-4 w-full sm:w-auto py-3 px-6 text-sm sm:text-base font-medium rounded-xl"
                    icon={<ClipboardDocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </Card>
            )}

            {/* New Analysis Button */}
            <Button
              onClick={startNewAnalysis}
              variant="outline"
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              icon={<ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            >
              Start New Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}