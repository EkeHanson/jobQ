import axios from 'axios'

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1') + '/',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 60000),
  timeoutErrorMessage: 'Request timed out. Please try again.',
})

// Flag to prevent multiple refresh attempts at the same time
let isRefreshing = false
let failedQueue = []

// Process queue of requests waiting for token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

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
    // For FormData, let the browser set the Content-Type with boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
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

    // Handle 401 - Token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      // Mark as retrying and try to refresh
      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        // No refresh token, must logout
        processQueue(new Error('No refresh token'))
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login?reason=token_expired'
        return Promise.reject(error)
      }

      try {
        // Try to get new token using refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1'}/auth/refresh/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )
        
        const { access, refresh } = response.data
        
        // Store new tokens
        localStorage.setItem('token', access)
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
        }
        
        // Process queued requests with new token
        processQueue(null, access)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return apiClient(originalRequest)
        
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login?reason=token_expired'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
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
