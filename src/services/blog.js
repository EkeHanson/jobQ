import apiClient from './api'

const blogService = {
  // Insights Posts
  getPosts: async (params) => {
    return apiClient.get('/insights/posts/', { params })
  },

  getPost: async (slug) => {
    return apiClient.get(`/insights/posts/${slug}/`)
  },

  getFeaturedPosts: async () => {
    return apiClient.get('/insights/featured/')
  },

  getLatestPosts: async (limit = 10) => {
    return apiClient.get('/insights/latest/', { params: { limit } })
  },

  // Create/Update/Delete posts (admin only)
  createPost: async (data) => {
    return apiClient.post('/insights/posts/', data)
  },

  updatePost: async (slug, data) => {
    return apiClient.put(`/insights/posts/${slug}/`, data)
  },

  deletePost: async (slug) => {
    return apiClient.delete(`/insights/posts/${slug}/`)
  },

  // Subscriptions
  subscribe: async (email, source = 'website') => {
    return apiClient.post('/insights/subscribers/subscribe/', { email, source })
  },

  unsubscribe: async (email) => {
    return apiClient.post('/insights/subscribers/unsubscribe/', { email })
  },

  checkSubscriptionStatus: async (email) => {
    return apiClient.get('/insights/subscribers/status/', { params: { email } })
  },

  // Comments
  getComments: async (postSlug) => {
    return apiClient.get(`/insights/posts/${postSlug}/comments/`)
  },

  addComment: async (postSlug, data) => {
    return apiClient.post(`/insights/posts/${postSlug}/comments/`, data)
  },
}

export default blogService
