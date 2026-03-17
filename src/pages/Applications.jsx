import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useApplications } from '../hooks/useApplications'
import { useSelector } from 'react-redux'
import ApplicationTable from '../components/applications/ApplicationTable'
import ApplicationKanbanBoard from '../components/applications/ApplicationKanbanBoard'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import BulkImportModal from '../components/applications/BulkImportModal'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { filterApplications } from '../utils/helpers'
import { 
  PlusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  DocumentIcon, 
  CloudArrowUpIcon, 
  ArchiveBoxIcon, 
  EyeIcon, 
  ClipboardDocumentListIcon, 
  PencilSquareIcon, 
  BookmarkIcon, 
  ExclamationTriangleIcon, 
  TrashIcon, 
  TableCellsIcon, 
  ViewColumnsIcon, 
  ArrowUpTrayIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import useSubscription from '../hooks/useSubscription'
import RichTextEditor from '../components/common/RichTextEditor'

export default function Applications() {
  const {
    applications,
    loading,
    currentApplication,
    setCurrent,
    clearCurrent,
    update,
    create,
    refetch,
    archive,
    unarchive,
    softDelete,
  } = useApplications()
  const { limits, canCreateApplication, refresh } = useSubscription()
  const filters = useSelector((state) => state.ui.filters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editResumeFile, setEditResumeFile] = useState(null)
  const [limitError, setLimitError] = useState(null)
  const [activeView, setActiveView] = useState('active')
  const [viewMode, setViewMode] = useState('table')
  const [archivingId, setArchivingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const filteredApps = useMemo(() => {
    let apps = applications
    if (activeView === 'active') {
      apps = applications.filter(app => !app.archived)
    } else {
      apps = applications.filter(app => app.archived)
    }
    return filterApplications(apps, filters)
  }, [applications, filters, activeView])

  const stats = useMemo(() => {
    const active = applications.filter(app => !app.archived).length
    const archived = applications.filter(app => app.archived).length
    return { active, archived, total: applications.length }
  }, [applications])

  const handleArchive = async (app) => {
    try {
      setArchivingId(app.id)
      await archive(app.id)
      toast.success('Application archived')
      refetch()
    } catch (error) {
      toast.error('Failed to archive application')
    } finally {
      setArchivingId(null)
    }
  }

  const handleUnarchive = async (app) => {
    try {
      setArchivingId(app.id)
      await unarchive(app.id)
      toast.success('Application restored')
      refetch()
    } catch (error) {
      toast.error('Failed to restore application')
    } finally {
      setArchivingId(null)
    }
  }

  const handleDelete = (app) => {
    setApplicationToDelete(app)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!applicationToDelete) return
    try {
      setArchivingId(applicationToDelete.id)
      await softDelete(applicationToDelete.id)
      toast.success('Application deleted')
      refetch()
    } catch (error) {
      toast.error('Failed to delete application')
    } finally {
      setArchivingId(null)
      setIsDeleteModalOpen(false)
      setApplicationToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setApplicationToDelete(null)
  }
  
  const [activeTab, setActiveTab] = useState(0)
  const createTabs = [
    { name: 'Basic Info', icon: ClipboardDocumentListIcon },
    { name: 'Job Details', icon: PencilSquareIcon },
    { name: 'Documents', icon: DocumentIcon },
    { name: 'Notes', icon: BookmarkIcon },
  ]
  
  const [editActiveTab, setEditActiveTab] = useState(0)
  const editTabs = [
    { name: 'Basic Info', icon: ClipboardDocumentListIcon },
    { name: 'Job Details', icon: PencilSquareIcon },
    { name: 'Documents', icon: DocumentIcon },
    { name: 'Notes', icon: BookmarkIcon },
  ]
  
  const [newData, setNewData] = useState({
    jobTitle: '',
    companyName: '',
    status: 'saved',
    source: '',
    appliedDate: '',
    deadline: '',
    followUpDate: '',
    notes: '',
    description: '',
    requirements: '',
    recruiterQuestions: '',
    resumeFile: null,
  })

  const handleEdit = (app) => {
    setIsCreating(false)
    setCurrent(app)
    setEditData({ 
      jobTitle: app.job_title || '',
      companyName: app.company_name || '',
      status: app.status, 
      source: app.source || '',
      followUpDate: app.follow_up_date || '',
      notes: app.notes || '',
      description: app.description || '',
      requirements: app.requirements || '',
      recruiterQuestions: app.recruiter_questions || '',
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (currentApplication && editData) {
      setSaving(true)
      const payload = new FormData()
      payload.append('job_title', editData.jobTitle || '')
      payload.append('company_name', editData.companyName || '')
      payload.append('status', editData.status)
      payload.append('source', editData.source || '')
      payload.append('follow_up_date', editData.followUpDate || '')
      payload.append('notes', editData.notes || '')
      payload.append('description', editData.description || '')
      payload.append('requirements', editData.requirements || '')
      payload.append('recruiter_questions', editData.recruiterQuestions || '')
      
      if (editResumeFile) {
        payload.append('resume_file', editResumeFile)
      }

      try {
        await update(currentApplication.id, payload)
        setIsModalOpen(false)
        clearCurrent()
        setEditResumeFile(null)
        toast.success('Application updated successfully')
      } catch (error) {
        toast.error('Failed to update application')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleView = (app) => {
    setIsCreating(false)
    setCurrent(app)
    setEditData({
      jobTitle: app.job_title || '',
      companyName: app.company_name || '',
      status: app.status,
      source: app.source || '',
      followUpDate: app.follow_up_date || '',
      notes: app.notes || '',
      description: app.description || '',
      requirements: app.requirements || '',
      recruiterQuestions: app.recruiter_questions || '',
    })
    setIsModalOpen(true)
  }

  const handleCreateClick = async () => {
    const check = await canCreateApplication()
    if (!check.allowed) {
      setLimitError(check.reason)
      toast.error(check.reason || 'Application limit reached')
      return
    }
    setLimitError(null)
    setIsCreating(true)
    clearCurrent()
    setNewData({
      jobTitle: '',
      companyName: '',
      status: 'saved',
      source: '',
      followUpDate: '',
      appliedDate: '',
      deadline: '',
      notes: '',
      description: '',
      requirements: '',
      recruiterQuestions: '',
      resumeFile: null,
    })
    setIsModalOpen(true)
  }

  const handleSaveNew = async () => {
    const check = await canCreateApplication()
    if (!check.allowed) {
      setLimitError(check.reason)
      toast.error(check.reason || 'Application limit reached')
      return
    }

    setSaving(true)

    const payload = new FormData()
    payload.append('job_title', newData.jobTitle)
    payload.append('company_name', newData.companyName)
    payload.append('status', newData.status)
    payload.append('source', newData.source || '')
    
    if (newData.appliedDate && newData.appliedDate.trim()) {
      payload.append('applied_date', newData.appliedDate)
    }
    if (newData.deadline && newData.deadline.trim()) {
      payload.append('deadline', newData.deadline)
    }
    if (newData.followUpDate && newData.followUpDate.trim()) {
      payload.append('follow_up_date', newData.followUpDate)
    }
    
    payload.append('notes', newData.notes)
    payload.append('description', newData.description)
    payload.append('requirements', newData.requirements)
    payload.append('recruiter_questions', newData.recruiterQuestions)
    
    if (newData.resumeFile) {
      payload.append('resume_file', newData.resumeFile)
    }

    try {
      await create(payload)
      setIsModalOpen(false)
      setIsCreating(false)
      refetch()
      refresh()
      toast.success('Application created successfully')
    } catch (error) {
      if (error && typeof error === 'object') {
        const errorMessages = []
        Object.keys(error).forEach(field => {
          const messages = error[field]
          if (Array.isArray(messages)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`)
          } else {
            errorMessages.push(`${field}: ${messages}`)
          }
        })
        toast.error(errorMessages.join(' | ') || 'Failed to create application')
      } else {
        toast.error(error?.message || 'Failed to create application')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      {/* Main Container - Responsive padding */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section - Responsive flex column on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Track all your job applications in one place</p>
          </div>
          
          {/* Action Buttons - Stack on mobile */}
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={() => setIsBulkImportOpen(true)}
              className="w-full xs:w-auto justify-center"
              size="sm"
            >
              <ArrowUpTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Import</span>
            </Button>
            <Button 
              onClick={handleCreateClick}
              className="w-full xs:w-auto justify-center"
              size="sm"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">New Application</span>
            </Button>
          </div>
        </div>

        {/* Subscription Banner - Responsive */}
        {limits && (
          <div className={`rounded-xl p-3 sm:p-4 mb-6 ${
            limits.subscription?.active 
              ? 'bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200' 
              : 'bg-gray-100 border border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {limits.subscription?.active ? `Plan: ${limits.subscription?.plan_name || 'Free'}` : 'No active subscription'}
                </p>
                {limits.subscription?.active && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Applications: {limits.usage?.applications || 0} / {limits.limits?.max_applications || 0}
                  </p>
                )}
              </div>
              {!limits.subscription?.active && (
                <Link to="/subscription" className="w-full sm:w-auto">
                  <Button size="sm" className="btn-gradient w-full sm:w-auto justify-center">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Limit Error - Responsive */}
        {limitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-6">
            <p className="text-red-700 font-medium text-sm sm:text-base">{limitError}</p>
            <Link to="/subscription" className="text-xs sm:text-sm text-red-600 hover:underline block mt-1">
              Upgrade your plan to continue
            </Link>
          </div>
        )}

        {/* Filters Section - Mobile friendly */}
        <div className="mb-6">
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden mb-3">
            <Button
              variant="secondary"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full justify-center"
              size="sm"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {/* Filters - Hidden on mobile unless toggled */}
          <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
            <ApplicationFilters />
          </div>
        </div>

        {/* View Tabs and Controls - Responsive grid */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          {/* View Tabs - Full width buttons with proper text */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveView('active')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeView === 'active'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <EyeIcon className="w-5 h-5" />
              <span>Active</span>
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                activeView === 'active' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {stats.active}
              </span>
            </button>
            <button
              onClick={() => setActiveView('archived')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeView === 'archived'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <ArchiveBoxIcon className="w-5 h-5" />
              <span>Archived</span>
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                activeView === 'archived' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {stats.archived}
              </span>
            </button>
          </div>
          
          {/* View Mode Toggle - Right aligned */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TableCellsIcon className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ViewColumnsIcon className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
        </div>

        {/* Main Content Card - Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Results Count - Responsive padding */}
          <div className="px-4 sm:px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              {activeView === 'active' 
                ? `Showing ${filteredApps.length} of ${stats.active} active applications`
                : `Showing ${filteredApps.length} of ${stats.archived} archived applications`
              }
            </p>
          </div>
          
          {/* Content Area - Responsive */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {viewMode === 'kanban' ? (
                  <div className="overflow-x-auto -mx-4 px-4">
                    <div className="min-w-[640px]">
                      <ApplicationKanbanBoard 
                        applications={filteredApps} 
                        update={update} 
                        loading={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4">
                    <div className="min-w-[640px] px-4">
                      <ApplicationTable 
                        applications={filteredApps} 
                        onEdit={handleEdit} 
                        onArchive={handleArchive}
                        onUnarchive={handleUnarchive}
                        onDelete={handleDelete}
                        archivingId={archivingId}
                        showArchived={activeView === 'archived'}
                        loading={loading} 
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal - Fully Responsive */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          clearCurrent(); 
          setIsCreating(false); 
          setLimitError(null); 
          setActiveTab(0);
          setEditActiveTab(0);
        }}
        title={isCreating ? 'New Application' : currentApplication ? 'Update Application' : 'Application Details'}
        size="full sm:xl"
        className="sm:max-w-3xl"
      >
        <div className="px-4 sm:px-6">
          {isCreating ? (
            <>
              {/* Tabs - Horizontal scrollable on mobile */}
              <div className="flex border-b border-gray-200 mb-5 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                {createTabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      activeTab === index
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content - Responsive spacing */}
              <div className="min-h-[300px] sm:min-h-[400px] overflow-y-auto">
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <Input 
                      label="Job Title" 
                      required 
                      value={newData.jobTitle} 
                      onChange={(e) => setNewData({ ...newData, jobTitle: e.target.value })} 
                    />
                    <Input 
                      label="Company" 
                      required 
                      value={newData.companyName} 
                      onChange={(e) => setNewData({ ...newData, companyName: e.target.value })} 
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                      <select
                        value={newData.source}
                        onChange={(e) => setNewData({ ...newData, source: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                      >
                        <option value="">Select source...</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="jobberman">jobberman</option>
                        <option value="glassdoor">Glassdoor</option>
                        <option value="indeed">Indeed</option>
                        <option value="company_website">Company Website</option>
                        <option value="referral">Referral</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={newData.status}
                        onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="assessment">Assessment</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input 
                        type="date" 
                        label="Applied Date" 
                        value={newData.appliedDate} 
                        onChange={(e) => setNewData({ ...newData, appliedDate: e.target.value })} 
                      />
                      <Input 
                        type="date" 
                        label="Deadline" 
                        value={newData.deadline} 
                        onChange={(e) => setNewData({ ...newData, deadline: e.target.value })} 
                      />
                    </div>

                    <Input 
                      type="date" 
                      label="Follow-up Date" 
                      value={newData.followUpDate} 
                      onChange={(e) => setNewData({ ...newData, followUpDate: e.target.value })} 
                      placeholder="When to follow up"
                    />

                    <div className="flex justify-end pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab(1)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                      <RichTextEditor
                        value={newData.description}
                        onChange={(value) => setNewData({ ...newData, description: value })}
                        placeholder="Paste job description here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <RichTextEditor
                        value={newData.requirements}
                        onChange={(value) => setNewData({ ...newData, requirements: value })}
                        placeholder="Job requirements and qualifications..."
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setActiveTab(0)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab(2)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Questions</label>
                      <RichTextEditor
                        value={newData.recruiterQuestions}
                        onChange={(value) => setNewData({ ...newData, recruiterQuestions: value })}
                        placeholder="Questions asked by recruiter..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setNewData({ ...newData, resumeFile: e.target.files[0] })}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer block">
                          {newData.resumeFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary-600">
                              <DocumentIcon className="w-5 h-5" />
                              <span className="text-sm font-medium truncate max-w-[200px]">
                                {newData.resumeFile.name}
                              </span>
                            </div>
                          ) : (
                            <div className="text-gray-500">
                              <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <span className="text-sm">Click to upload resume</span>
                              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setActiveTab(1)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab(3)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <RichTextEditor
                        value={newData.notes}
                        onChange={(value) => setNewData({ ...newData, notes: value })}
                        placeholder="Add your notes here..."
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setActiveTab(2)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => { 
                            setIsModalOpen(false); 
                            setIsCreating(false); 
                            setLimitError(null); 
                            setActiveTab(0); 
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveNew} 
                          loading={saving}
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : currentApplication ? (
            <>
              {/* Edit Tabs - Horizontal scrollable on mobile */}
              <div className="flex border-b border-gray-200 mb-5 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                {editTabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setEditActiveTab(index)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      editActiveTab === index
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              <div className="min-h-[300px] sm:min-h-[400px] overflow-y-auto">
                {editActiveTab === 0 && (
                  <div className="space-y-4">
                    <Input 
                      label="Job Title" 
                      value={editData?.jobTitle || ''} 
                      onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })} 
                    />
                    <Input 
                      label="Company" 
                      value={editData?.companyName || ''} 
                      onChange={(e) => setEditData({ ...editData, companyName: e.target.value })} 
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editData?.status || currentApplication.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="assessment">Assessment</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => setEditActiveTab(1)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {editActiveTab === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                      <RichTextEditor
                        value={editData?.description || ''}
                        onChange={(value) => setEditData({ ...editData, description: value })}
                        placeholder="Paste job description here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <RichTextEditor
                        value={editData?.requirements || ''}
                        onChange={(value) => setEditData({ ...editData, requirements: value })}
                        placeholder="Job requirements and qualifications..."
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setEditActiveTab(0)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => setEditActiveTab(2)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {editActiveTab === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Questions</label>
                      <RichTextEditor
                        value={editData?.recruiterQuestions || ''}
                        onChange={(value) => setEditData({ ...editData, recruiterQuestions: value })}
                        placeholder="Questions asked by recruiter..."
                      />
                    </div>

                    {currentApplication.resume && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Current Resume</p>
                        <a 
                          href={currentApplication.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-medium"
                        >
                          <DocumentIcon className="w-5 h-5" />
                          View Resume
                        </a>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Update Resume</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setEditResumeFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setEditActiveTab(1)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => setEditActiveTab(3)}
                      >
                        Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {editActiveTab === 3 && (
                  <div className="space-y-4">
                    {currentApplication.notes && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Current Notes</p>
                        <div className="prose prose-sm max-w-none text-gray-600" 
                          dangerouslySetInnerHTML={{ __html: currentApplication.notes }} 
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Edit Notes</label>
                      <RichTextEditor
                        value={editData?.notes || currentApplication.notes || ''}
                        onChange={(value) => setEditData({ ...editData, notes: value })}
                        placeholder="Add your notes here..."
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setEditActiveTab(2)}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => { 
                            setIsModalOpen(false); 
                            clearCurrent(); 
                            setEditResumeFile(null); 
                            setEditActiveTab(0); 
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveEdit} 
                          loading={saving}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      {/* Delete Confirmation Modal - Responsive */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Delete Application"
        size="full sm:md"
        className="sm:max-w-md"
      >
        <div className="text-center px-4 sm:px-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Application?
          </h3>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            You're about to delete{' '}
            <span className="font-semibold text-gray-900 block sm:inline">
              {applicationToDelete?.job_title || applicationToDelete?.company_name || 'this application'}
            </span>
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-amber-800 font-medium mb-2">Please note:</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Permanently removed from active list</li>
              <li>• All associated data will be hidden</li>
              <li>• Can be restored later if needed</li>
            </ul>
          </div>
          
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Button 
              variant="secondary" 
              onClick={cancelDelete}
              className="w-full xs:flex-1 justify-center"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              disabled={archivingId !== null}
              className="w-full xs:flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {archivingId === applicationToDelete?.id ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={() => {
          refetch()
          refresh()
        }}
      />
    </DashboardLayout>
  )
}