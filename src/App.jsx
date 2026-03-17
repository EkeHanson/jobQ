import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './components/common/Toast'
import CookieConsent from './components/common/CookieConsent'
import useAnalyticsTracking from './hooks/useAnalytics'

function AnalyticsTracker() {
  useAnalyticsTracking()
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <AnalyticsTracker />
        <AppRoutes />
        <CookieConsent />
      </Router>
    </ToastProvider>
  )
}
