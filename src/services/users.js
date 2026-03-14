import apiClient from './api'

const usersService = {
  getGoal: async () => {
    return apiClient.get('/auth/goal/')
  },

  createGoal: async (data) => {
    return apiClient.post('/auth/goal/', data)
  },

  updateGoal: async (id, data) => {
    return apiClient.patch(`/auth/goal/`, data)
  },

  getProfile: async () => {
    return apiClient.get('/auth/me/')
  },

  updateProfile: async (data) => {
    return apiClient.patch('/auth/me/', data)
  },

  getPublicProfile: async (slug) => {
    return apiClient.get(`/auth/public/${slug}/`)
  },

  getPublicProfileBySlug: async (slug) => {
    return apiClient.get(`/auth/public/${slug}/`)
  },

  getMyPublicProfile: async () => {
    return apiClient.get('/auth/public-profile/')
  },

  updatePublicProfile: async (data) => {
    return apiClient.patch('/auth/public-profile/', data)
  },
}

export default usersService
