import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App'
import store from './store'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

// Global error handlers for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
        <Toaster position="top-right" />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
