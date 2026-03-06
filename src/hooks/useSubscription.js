import { useState, useEffect, useCallback } from 'react'
import subscriptionService from '../services/subscription'

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null)
  const [limits, setLimits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true)
      const [subData, limitsData] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getLimits(),
      ])
      setSubscription(subData)
      setLimits(limitsData)
      setError(null)
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError(err.response?.data?.message || 'Failed to fetch subscription')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const checkLimit = async (actionType) => {
    try {
      const response = await subscriptionService.checkLimit(actionType)
      return response
    } catch (err) {
      console.error('Error checking limit:', err)
      return {
        allowed: false,
        reason: err.response?.data?.message || 'Failed to check limit',
      }
    }
  }

  const recordAIPaste = async () => {
    try {
      const response = await subscriptionService.recordAIPaste()
      // Refresh limits after recording
      await fetchSubscription()
      return response
    } catch (err) {
      console.error('Error recording AI paste:', err)
      throw err
    }
  }

  const canCreateApplication = async () => {
    return checkLimit('create_application')
  }

  const canCreateProfile = async () => {
    return checkLimit('create_profile')
  }

  const canUseAIPaste = async () => {
    return checkLimit('use_ai_paste')
  }

  return {
    subscription,
    limits,
    loading,
    error,
    checkLimit,
    recordAIPaste,
    canCreateApplication,
    canCreateProfile,
    canUseAIPaste,
    refresh: fetchSubscription,
  }
}

export default useSubscription
