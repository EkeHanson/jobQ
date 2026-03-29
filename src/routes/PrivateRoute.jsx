import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  // allow bypassing authentication during local testing by setting
  // VITE_SKIP_AUTH=true (or for backwards compatibility REACT_APP_SKIP_AUTH) in an env file
  const skipAuth =
    import.meta.env.VITE_SKIP_AUTH === 'true' ||
    import.meta.env.REACT_APP_SKIP_AUTH === 'true'
  const { isAuthenticated, loading, user } = useAuth()
  const isAdmin = user?.is_staff || user?.is_superuser

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect admin users to admin panel instead of regular user dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
