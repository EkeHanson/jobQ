import axios from 'axios'

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1') + '/',
  timeout: 30000,
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
  (error) => {
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
