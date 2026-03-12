import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import interviewPrepService from '../services/interviewPrep'
import { useApplications } from '../hooks/useApplications'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

function QuestionCard({ category, question, tips }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
          {category}
        </span>
      </div>
      <h4 className="font-medium text-gray-900 mb-2">{question}</h4>
      {tips && tips.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Tips:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <CheckCircleIcon className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SkillAssessment({ assessments }) {
  const { matched_skills = [], gap_skills = [], assessment_notes = '' } = assessments || {}
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-3">Skills Assessment</h4>
      
      {matched_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Matched Skills</p>
          <div className="flex flex-wrap gap-1">
            {matched_skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {gap_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Skills Gap</p>
          <div className="flex flex-wrap gap-1">
            {gap_skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {assessment_notes && (
        <p className="text-sm text-gray-600">{assessment_notes}</p>
      )}
    </div>
  )
}

function RecommendationCard({ title, description, priority }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        {priority && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[priority] || priorityColors.low}`}>
            {priority}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default function InterviewPrep() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [preps, setPreps] = useState([])
  const [selectedPrep, setSelectedPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const { applications } = useApplications()
  const [newPrep, setNewPrep] = useState({
    job_title: '',
    company_name: '',
    job_description: '',
    job_requirements: '',
    job_skills: '',
    application_id: null
  })

  useEffect(() => {
    fetchPreps()
  }, [])

  const fetchPreps = async () => {
    try {
      const response = await interviewPrepService.getInterviewPreps()
      setPreps(response.results || response || [])
      
      // If there's an ID in URL, load that prep
      if (id) {
        const prep = (response.results || response || []).find(p => p.prep_id === id || p.id === parseInt(id))
        if (prep) {
          setSelectedPrep(prep)
        }
      }
    } catch (error) {
      console.error('Error fetching preps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePrep = async (e) => {
    e.preventDefault()
    setCreating(true)
    
    // If an application is selected, use its data
    let prepData = { ...newPrep }
    if (selectedApplication) {
      prepData = {
        application_id: selectedApplication.id,
        job_title: selectedApplication.job_title,
        company_name: selectedApplication.company_name,
        job_description: selectedApplication.description || '',
        job_requirements: selectedApplication.requirements || '',
        job_skills: ''
      }
    }
    
    try {
      const response = await interviewPrepService.createInterviewPrep(prepData)
      toast.success('Interview prep created!')
      setShowCreateModal(false)
      setNewPrep({
        job_title: '',
        company_name: '',
        job_description: '',
        job_requirements: '',
        job_skills: '',
        application_id: null
      })
      setSelectedApplication(null)
      await fetchPreps()
      setSelectedPrep(response)
      navigate(`/interview-prep/${response.prep_id}`)
    } catch (error) {
      console.error('Error creating prep:', error)
      toast.error('Failed to create interview prep')
    } finally {
      setCreating(false)
    }
  }

  const handleSelectApplication = (appId) => {
    if (!appId) {
      setSelectedApplication(null)
      return
    }
    const app = applications.find(a => a.id === parseInt(appId))
    setSelectedApplication(app || null)
    if (app) {
      setNewPrep({
        ...newPrep,
        application_id: app.id,
        job_title: app.job_title || '',
        company_name: app.company_name || '',
        job_description: app.description || '',
        job_requirements: app.requirements || '',
        job_skills: ''
      })
    }
  }

  const handleDeletePrep = async (prepId) => {
    if (!confirm('Are you sure you want to delete this interview prep?')) return
    
    try {
      await interviewPrepService.deleteInterviewPrep(prepId)
      toast.success('Interview prep deleted')
      if (selectedPrep?.prep_id === prepId || selectedPrep?.id === prepId) {
        setSelectedPrep(null)
      }
      fetchPreps()
    } catch (error) {
      console.error('Error deleting prep:', error)
      toast.error('Failed to delete interview prep')
    }
  }

  const handleRegenerate = async () => {
    if (!selectedPrep) return
    
    try {
      const response = await interviewPrepService.regenerateInterviewPrep(selectedPrep.prep_id || selectedPrep.id)
      setSelectedPrep(response)
      toast.success('Interview prep regenerated!')
    } catch (error) {
      console.error('Error regenerating prep:', error)
      toast.error('Failed to regenerate interview prep')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Preparation</h1>
            <p className="text-gray-600 mt-1">AI-powered interview preparation based on job postings</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            New Prep
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - List of preps */}
          <div className="lg:w-80 flex-shrink-0">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Interview Preps</h2>
              
              {preps.length === 0 ? (
                <p className="text-gray-500 text-sm">No interview preps yet. Create one to get started!</p>
              ) : (
                <div className="space-y-2">
                  {preps.map((prep) => (
                    <div
                      key={prep.id || prep.prep_id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPrep?.id === prep.id || selectedPrep?.prep_id === prep.prep_id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPrep(prep)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">{prep.job_title}</h3>
                          <p className="text-sm text-gray-500 truncate">{prep.company_name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(prep.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePrep(prep.id || prep.prep_id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {selectedPrep ? (
              <div className="space-y-6">
                {/* Prep Header */}
                <Card>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPrep.job_title}</h2>
                      <p className="text-lg text-gray-600">{selectedPrep.company_name}</p>
                    </div>
                    <Button variant="secondary" onClick={handleRegenerate}>
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </Card>

                {/* Interview Questions */}
                {selectedPrep.interview_questions?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
                      Interview Questions
                    </h3>
                    <div className="grid gap-4">
                      {selectedPrep.interview_questions.map((q, idx) => (
                        <QuestionCard key={idx} {...q} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Assessment */}
                {selectedPrep.skill_assessments && Object.keys(selectedPrep.skill_assessments).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BeakerIcon className="w-5 h-5 text-primary-600" />
                      Skill Assessment
                    </h3>
                    <SkillAssessment assessments={selectedPrep.skill_assessments} />
                  </div>
                )}

                {/* Recommendations */}
                {selectedPrep.recommendations?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <LightBulbIcon className="w-5 h-5 text-primary-600" />
                      Personalized Recommendations
                    </h3>
                    <div className="grid gap-4">
                      {selectedPrep.recommendations.map((rec, idx) => (
                        <RecommendationCard key={idx} {...rec} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Insights */}
                {selectedPrep.company_insights && Object.keys(selectedPrep.company_insights).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                      Company Insights
                    </h3>
                    <Card>
                      {selectedPrep.company_insights.industry && (
                        <p className="mb-2"><span className="font-medium">Industry:</span> {selectedPrep.company_insights.industry}</p>
                      )}
                      {selectedPrep.company_insights.key_values?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-1">Key Values</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedPrep.company_insights.key_values.map((value, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedPrep.company_insights.tips?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tips</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {selectedPrep.company_insights.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <ExclamationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interview prep selected</h3>
                <p className="text-gray-500 mb-4">Select an existing prep or create a new one</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Interview Prep
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedApplication(null)
        }}
        title="Create Interview Prep"
        size="lg"
      >
        <form onSubmit={handleCreatePrep} className="space-y-4">
          {/* Application Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select from your Applications (optional)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedApplication?.id || ''}
              onChange={(e) => handleSelectApplication(e.target.value)}
            >
              <option value="">-- Enter manually instead --</option>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.job_title} at {app.company_name}
                  </option>
                ))
              ) : (
                <option disabled>No applications found</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Or enter job details manually below
            </p>
          </div>
          
          <Input
            label="Job Title"
            placeholder="e.g., Senior Backend Developer"
            value={newPrep.job_title}
            onChange={(e) => setNewPrep({ ...newPrep, job_title: e.target.value })}
            required
          />
          <Input
            label="Company Name"
            placeholder="e.g., Google"
            value={newPrep.company_name}
            onChange={(e) => setNewPrep({ ...newPrep, company_name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Paste the job description here..."
              value={newPrep.job_description}
              onChange={(e) => setNewPrep({ ...newPrep, job_description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Requirements (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="List the job requirements..."
              value={newPrep.job_requirements}
              onChange={(e) => setNewPrep({ ...newPrep, job_requirements: e.target.value })}
            />
          </div>
          <Input
            label="Required Skills (optional)"
            placeholder="e.g., Python, Django, PostgreSQL, AWS"
            value={newPrep.job_skills}
            onChange={(e) => setNewPrep({ ...newPrep, job_skills: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Prep'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
