import apiClient from './api'

const reviewsService = {
  list: async () => {
    return apiClient.get('/reviews/')
  },

  create: async ({ rating, title, body }) => {
    return apiClient.post('/reviews/', { rating, title, body })
  },
}

export default reviewsService
