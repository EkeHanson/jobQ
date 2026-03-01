import apiClient from './api'

const authService = {
  register: async (data) => {
    return apiClient.post('/auth/register', data)
  },

  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password })
  },

  loginWithGoogle: async (token) => {
    return apiClient.post('/auth/google', { token })
  },

  loginWithLinkedIn: async (token) => {
    return apiClient.post('/auth/linkedin', { token })
  },

  logout: async () => {
    return apiClient.post('/auth/logout')
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    return apiClient.post('/auth/refresh', { refresh: refreshToken })
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me')
  },

  updateProfile: async (data) => {
    return apiClient.put('/auth/me', data)
  },
}

export default authService
