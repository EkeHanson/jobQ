import apiClient from './api'

const subscriptionService = {
  // Plans (list)
  getPlans: async () => {
    return apiClient.get('/subscription/')
  },

  // Current Subscription
  getCurrentSubscription: async () => {
    return apiClient.get('/subscription/me/')
  },

  // Upgrade
  upgradePlan: async (data) => {
    return apiClient.post('/subscription/upgrade/', data)
  },

  // Cancel
  cancelSubscription: async () => {
    return apiClient.post('/subscription/cancel/')
  },

  // Resume
  resumeSubscription: async () => {
    return apiClient.post('/subscription/resume/')
  },

  // Payment Methods
  getPaymentMethods: async () => {
    return apiClient.get('/subscription/payment-methods/')
  },

  addPaymentMethod: async (data) => {
    return apiClient.post('/subscription/payment-methods/', data)
  },

  // Invoice
  getInvoices: async () => {
    return apiClient.get('/subscription/invoices/')
  },

  downloadInvoice: async (invoiceId) => {
    return apiClient.get(`/subscription/invoices/${invoiceId}/download/`, {
      responseType: 'blob',
    })
  },
}

export default subscriptionService
