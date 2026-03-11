import apiClient from './api'

const authService = {
  register: async (data) => {
    return apiClient.post('/auth/register/', data)
  },

  login: async (identifier, password, rememberMe = false) => {
    // identifier can be either email or username
    // Check if it looks like an email
    const isEmail = identifier.includes('@')
    const payload = isEmail 
      ? { email: identifier, password, remember_me: rememberMe }
      : { username: identifier, password, remember_me: rememberMe }
    return apiClient.post('/auth/login/', payload)
  },

  loginWithGoogle: async (token) => {
    return apiClient.post('/auth/google/', { token })
  },

  loginWithLinkedIn: async (token) => {
    return apiClient.post('/auth/linkedin/', { token })
  },

  logout: async () => {
    return apiClient.post('/auth/logout/')
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me')
  },

  updateProfile: async (data) => {
    return apiClient.patch('/auth/me/', data)
  },

  deleteAccount: async (password) => {
    return apiClient.post('/auth/delete/', { password })
  },

  requestPasswordReset: async (email) => {
    return apiClient.post('/auth/password-reset/request/', { email })
  },

  verifyResetToken: async (email, token) => {
    return apiClient.post('/auth/password-reset/verify/', { email, token })
  },

  resetPassword: async (email, token, newPassword) => {
    return apiClient.post('/auth/password-reset/', {
      email,
      token,
      new_password: newPassword,
    })
  },

  verifyTwoFactor: async (email, token, rememberMe = false) => {
    return apiClient.post('/auth/two-factor/verify/', {
      email,
      token,
      remember_me: rememberMe,
    })
  },

  manageTwoFactor: async (enable, password) => {
    return apiClient.post('/auth/two-factor/manage/', {
      enable,
      password,
    })
  },
}

export default authService
