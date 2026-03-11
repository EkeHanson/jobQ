import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './components/common/Toast'
import CookieConsent from './components/common/CookieConsent'

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <AppRoutes />
        <CookieConsent />
      </Router>
    </ToastProvider>
  )
}
