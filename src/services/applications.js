import apiClient from './api'

const applicationService = {
  // Applications
  getApplications: async (params) => {
    return apiClient.get('/applications/', { params })
  },

  getApplication: async (id) => {
    return apiClient.get(`/applications/${id}`)
  },

  createApplication: async (data) => {
    return apiClient.post('/applications/', data)
  },

  updateApplication: async (id, data) => {
    return apiClient.patch(`/applications/${id}/`, data)
  },

  deleteApplication: async (id) => {
    return apiClient.delete(`/applications/${id}`)
  },

  // Statistics
  getStats: async (params) => {
    return apiClient.get('/applications/stats/', { params })
  },

  // Status History
  getStatusHistory: async (applicationId) => {
    return apiClient.get(`/applications/${applicationId}/status-history/`)
  },

  // Archive
  archiveApplication: async (id) => {
    return apiClient.post(`/applications/${id}/archive/`)
  },

  unarchiveApplication: async (id) => {
    return apiClient.post(`/applications/${id}/unarchive/`)
  },

  // Soft Delete
  softDeleteApplication: async (id) => {
    return apiClient.post(`/applications/${id}/soft_delete/`)
  },

  restoreApplication: async (id) => {
    return apiClient.post(`/applications/${id}/restore/`)
  },

  // Follow-ups
  getFollowUps: async () => {
    return apiClient.get('/applications/followups/')
  },

  markFollowUpSent: async (applicationId) => {
    return apiClient.post('/applications/followups/mark_sent/', { application_id: applicationId })
  },

  // Interviews
  getInterviews: async (params) => {
    return apiClient.get('/interviews/', { params })
  },

  getInterview: async (id) => {
    return apiClient.get(`/interviews/${id}`)
  },

  createInterview: async (data) => {
    return apiClient.post('/interviews/', data)
  },

  updateInterview: async (id, data) => {
    return apiClient.patch(`/interviews/${id}/`, data)
  },

  deleteInterview: async (id) => {
    return apiClient.delete(`/interviews/${id}`)
  },

  updateInterviewOutcome: async (id, outcome) => {
    return apiClient.post(`/interviews/${id}/update_outcome/`, { outcome })
  },
}

export default applicationService
