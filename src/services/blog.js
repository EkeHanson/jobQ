import apiClient from './api'

const blogService = {
  // Blog Posts
  getPosts: async (params) => {
    return apiClient.get('/blog/posts/', { params })
  },

  getPost: async (slug) => {
    return apiClient.get(`/blog/posts/${slug}/`)
  },

  getFeaturedPosts: async () => {
    return apiClient.get('/blog/featured/')
  },

  getLatestPosts: async (limit = 10) => {
    return apiClient.get('/blog/latest/', { params: { limit } })
  },

  // Create/Update/Delete posts (admin only)
  createPost: async (data) => {
    return apiClient.post('/blog/posts/', data)
  },

  updatePost: async (slug, data) => {
    return apiClient.put(`/blog/posts/${slug}/`, data)
  },

  deletePost: async (slug) => {
    return apiClient.delete(`/blog/posts/${slug}/`)
  },

  // Subscriptions
  subscribe: async (email, source = 'website') => {
    return apiClient.post('/blog/subscribers/subscribe/', { email, source })
  },

  unsubscribe: async (email) => {
    return apiClient.post('/blog/subscribers/unsubscribe/', { email })
  },

  checkSubscriptionStatus: async (email) => {
    return apiClient.get('/blog/subscribers/status/', { params: { email } })
  },

  // Comments
  getComments: async (postSlug) => {
    return apiClient.get(`/blog/posts/${postSlug}/comments/`)
  },

  addComment: async (postSlug, data) => {
    return apiClient.post(`/blog/posts/${postSlug}/comments/`, data)
  },
}

export default blogService
