import axios from 'axios'

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1') + '/',
  timeout: 10000,
})

// Add trailing slash to all request URLs
apiClient.interceptors.request.use((config) => {
  // Ensure the URL ends with a slash
  if (config.url && !config.url.endsWith('/')) {
    config.url = config.url + '/'
  }
  return config
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh: refreshToken }
        )

        localStorage.setItem('token', response.data.access)
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Clear auth and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden - Subscription limit reached
    if (error.response?.status === 403) {
      const errorData = error.response.data
      if (errorData.error === 'subscription_limit') {
        window.location.href = `/subscription?reason=limit_reached`
      }
    }

    return Promise.reject(error.response?.data || error)
  }
)

export default apiClient
