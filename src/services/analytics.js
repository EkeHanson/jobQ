import apiClient from './api'

const analyticsService = {
  // Track a page view
  trackPageView: async (data) => {
    return apiClient.post('/analytics/track/', data)
  },

  // Get analytics summary
  getSummary: async (days = 30) => {
    return apiClient.get('/analytics/summary/', { params: { days } })
  },

  // Get daily analytics
  getOverview: async (days = 30) => {
    return apiClient.get('/analytics/overview/', { params: { days } })
  },
}

export default analyticsService
