import api from './api'

// API already returns response.data due to interceptor
// So we just return the result directly

export const subscriptionService = {
  // Get all available subscription plans (public - no auth required)
  getPublicPlans: async () => {
    return api.get('/subscription/plans/')
  },

  // Get all available subscription plans (requires auth)
  getPlans: async () => {
    return api.get('/subscription/')
  },

  // Get current user's subscription
  getMySubscription: async () => {
    return api.get('/subscription/me/')
  },

  // Get subscription limits and usage
  getLimits: async () => {
    return api.get('/subscription/limits/')
  },

  // Check if user can perform a specific action
  checkLimit: async (actionType) => {
    return api.post('/subscription/check_limit/', {
      action_type: actionType,
    })
  },

  // Record AI paste usage
  recordAIPaste: async () => {
    return api.post('/subscription/record_ai_paste/')
  },

  // Upgrade subscription
  upgrade: async (planId) => {
    return api.post('/subscription/upgrade/', {
      plan_id: planId,
    })
  },

  // Cancel subscription
  cancel: async () => {
    return api.post('/subscription/cancel/')
  },

  // Resume subscription
  resume: async () => {
    return api.post('/subscription/resume/')
  },
}

export default subscriptionService
