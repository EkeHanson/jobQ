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
}

export default applicationService
