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
    return apiClient.get('/users/me/')
  },

  updateProfile: async (data) => {
    return apiClient.patch('/users/me/', data)
  },

  getPublicProfile: async (slug) => {
    return apiClient.get(`/users/public/${slug}/`)
  },

  updatePublicProfile: async (data) => {
    return apiClient.patch('/users/public-profile/', data)
  },
}

export default usersService
