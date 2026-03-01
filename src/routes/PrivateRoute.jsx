import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  // allow bypassing authentication during local testing by setting
  // VITE_SKIP_AUTH=true (or for backwards compatibility REACT_APP_SKIP_AUTH) in an env file
  const skipAuth =
    import.meta.env.VITE_SKIP_AUTH === 'true' ||
    import.meta.env.REACT_APP_SKIP_AUTH === 'true'
  const { isAuthenticated, loading } = useAuth()

  if (loading && !skipAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (skipAuth) {
    return <Outlet />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
