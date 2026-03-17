import { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import analyticsService from '../services/analytics'

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

export function useAnalyticsTracking() {
  const location = useLocation()

  const trackPageView = useCallback(async (path, title) => {
    try {
      await analyticsService.trackPageView({
        session_id: getSessionId(),
        path: path,
        title: title || document.title,
        referrer: document.referrer,
      })
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.debug('Analytics tracking failed:', error)
    }
  }, [])

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location, trackPageView])

  return { trackPageView }
}

export default useAnalyticsTracking
