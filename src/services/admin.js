import apiClient from './api'

const adminService = {
  getUsers: async (page = 1) => {
    return apiClient.get('/auth/users/', { params: { page } })
  },

  createUser: async (payload) => {
    return apiClient.post('/auth/users/', payload)
  },

  updateUser: async (userId, payload) => {
    return apiClient.put(`/auth/users/${userId}/`, payload)
  },

  deleteUser: async (userId) => {
    return apiClient.delete(`/auth/users/${userId}/`)
  },

  suspendUser: async (userId, reason = 'Suspended by admin') => {
    return apiClient.post('/auth/users/', {
      user_id: userId,
      action: 'suspend',
      reason,
    })
  },

  unsuspendUser: async (userId) => {
    return apiClient.post('/auth/users/', {
      user_id: userId,
      action: 'unsuspend',
    })
  },

  getContactMessages: async (page = 1) => {
    return apiClient.get('/contact/', { params: { page } })
  },

  updateContactMessage: async (id, payload) => {
    return apiClient.put(`/contact/${id}/`, payload)
  },

  deleteContactMessage: async (id) => {
    return apiClient.delete(`/contact/${id}/`)
  },

  getApplications: async (params = {}) => {
    return apiClient.get('/applications/', { params })
  },

  archiveApplication: async (id) => {
    return apiClient.post(`/applications/${id}/archive/`)
  },

  unarchiveApplication: async (id) => {
    return apiClient.post(`/applications/${id}/unarchive/`)
  },

  softDeleteApplication: async (id) => {
    return apiClient.post(`/applications/${id}/soft_delete/`)
  },

  restoreApplication: async (id) => {
    return apiClient.post(`/applications/${id}/restore/`)
  },

  getJobs: async (params = {}) => {
    return apiClient.get('/jobs/', { params })
  },

  createJob: async (payload) => {
    return apiClient.post('/jobs/', payload)
  },

  updateJob: async (id, payload) => {
    return apiClient.put(`/jobs/${id}/`, payload)
  },

  deleteJob: async (id) => {
    return apiClient.delete(`/jobs/${id}/`)
  },

  getProfiles: async () => {
    return apiClient.get('/profiles/')
  },

  deleteProfile: async (id) => {
    return apiClient.delete(`/profiles/${id}/`)
  },

  getSubscriptionPlans: async () => {
    return apiClient.get('/subscription/')
  },

  getUserSubscriptions: async () => {
    return apiClient.get('/subscription/admin-subscriptions/')
  },

  createSubscriptionPlan: async (payload) => {
    return apiClient.post('/subscription/', payload)
  },

  updateSubscriptionPlan: async (id, payload) => {
    return apiClient.put(`/subscription/${id}/`, payload)
  },

  deleteSubscriptionPlan: async (id) => {
    return apiClient.delete(`/subscription/${id}/`)
  },

  subscribeUserToPlan: async (userId, planId) => {
    return apiClient.post('/subscription/admin-subscribe-user/', {
      user_id: userId,
      plan_id: planId,
    })
  },

  changeUserPlan: async (userId, planId) => {
    return apiClient.post('/subscription/admin-change-plan/', {
      user_id: userId,
      plan_id: planId,
    })
  },

  cancelUserSubscription: async (userId) => {
    return apiClient.post('/subscription/admin-cancel-subscription/', {
      user_id: userId,
    })
  },

  getAdminBlogPosts: async (params = {}) => {
    return apiClient.get('/insights/posts/all/', { params })
  },

  createBlogPost: async (payload) => {
    return apiClient.post('/insights/posts/', payload)
  },

  updateBlogPost: async (slug, payload) => {
    return apiClient.put(`/insights/posts/${slug}/`, payload)
  },

  featureBlogPost: async (slug) => {
    return apiClient.post(`/insights/posts/${slug}/feature/`)
  },

  deleteBlogPost: async (slug) => {
    return apiClient.delete(`/insights/posts/${slug}/`)
  },

  getBlogSubscribers: async (params = {}) => {
    return apiClient.get('/insights/subscribers/', { params })
  },

  updateBlogSubscriber: async (id, payload) => {
    return apiClient.put(`/insights/subscribers/${id}/`, payload)
  },

  deleteBlogSubscriber: async (id) => {
    return apiClient.delete(`/insights/subscribers/${id}/`)
  },

  getNotifications: async (params = {}) => {
    return apiClient.get('/notifications/', { params })
  },

  deleteNotification: async (id) => {
    return apiClient.delete(`/notifications/${id}/`)
  },
}

export default adminService
