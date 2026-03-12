import apiClient from './api'

const interviewPrepService = {
  // Get all interview preps for the current user
  getInterviewPreps: async () => {
    return apiClient.get('/ai/interview-prep/')
  },

  // Get a specific interview prep
  getInterviewPrep: async (prepId) => {
    return apiClient.get(`/ai/interview-prep/${prepId}/`)
  },

  // Create a new interview prep
  createInterviewPrep: async (data) => {
    return apiClient.post('/ai/interview-prep/', data)
  },

  // Delete an interview prep
  deleteInterviewPrep: async (prepId) => {
    return apiClient.delete(`/ai/interview-prep/${prepId}/`)
  },

  // Regenerate interview prep content
  regenerateInterviewPrep: async (prepId) => {
    return apiClient.post(`/ai/interview-prep/${prepId}/regenerate/`)
  },
}

export default interviewPrepService
