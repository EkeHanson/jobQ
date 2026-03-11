import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { 
  ExclamationTriangleIcon, 
  ArrowLeftIcon,
  HomeIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline'

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoBack = () => {
    window.history.back()
  }

  // Simple inline fallback to avoid dependency issues
  renderSimpleFallback() {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '28rem', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
          padding: '2rem', 
          textAlign: 'center' 
        }}>
          <div style={{ 
            width: '5rem', 
            height: '5rem', 
            margin: '0 auto 1.5rem', 
            borderRadius: '9999px', 
            backgroundColor: '#fef2f2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            We encountered an unexpected error. Please try again.
          </p>
          {this.state.error && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', textAlign: 'left', overflow: 'auto', maxHeight: '8rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#4b5563' }}>
              {this.state.error.toString()}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={this.handleReset}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                padding: '0.625rem 1.25rem', 
                backgroundColor: '#f3f4f6', 
                color: '#374151', 
                borderRadius: '0.5rem', 
                fontWeight: '500', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <a 
              href="/"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                padding: '0.625rem 1.25rem', 
                backgroundColor: '#4f46e5', 
                color: 'white', 
                borderRadius: '0.5rem', 
                fontWeight: '500', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        try {
          return this.props.fallback({
            error: this.state.error,
            errorInfo: this.state.errorInfo,
            resetError: this.handleReset
          })
        } catch (e) {
          // If fallback itself fails, use simple fallback
          console.error('Error in fallback:', e)
          return this.renderSimpleFallback()
        }
      }

      // Use simple fallback to avoid any dependency issues
      return this.renderSimpleFallback()
    }

    return this.props.children
  }
}

export default ErrorBoundary
