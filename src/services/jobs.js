import apiClient from './api'

const jobService = {
  // Jobs
  getJobs: async (params) => {
    return apiClient.get('/jobs/', { params })
  },

  getJob: async (id) => {
    return apiClient.get(`/jobs/${id}`)
  },

  createJob: async (data) => {
    return apiClient.post('/jobs/', data)
  },

  updateJob: async (id, data) => {
    return apiClient.put(`/jobs/${id}`, data)
  },

  deleteJob: async (id) => {
    return apiClient.delete(`/jobs/${id}/`)
  },

  // AI Extraction
  extractJobFromText: async (jobText) => {
    return apiClient.post('/jobs/extract/', { job_text: jobText })
  },

  getExtractionStatus: async (taskId) => {
    return apiClient.get(`/jobs/extract/status/${taskId}`)
  },

  getExtractionResult: async (taskId) => {
    return apiClient.get(`/jobs/extract/result/${taskId}/`)
  },

  // Companies
  getCompanies: async (params) => {
    return apiClient.get('/companies/', { params })
  },

  getCompany: async (id) => {
    return apiClient.get(`/companies/${id}/`)
  },

  createCompany: async (data) => {
    return apiClient.post('/companies/', data)
  },
}

export default jobService
