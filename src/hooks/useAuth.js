import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { login, register, logout, clearError, loginWithGoogle } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, loading, error } = useSelector((state) => state.auth)

  const handleLogin = useCallback(
    ({ email, password }) => {
      return dispatch(login({ email, password }))
    },
    [dispatch]
  )

  const handleRegister = useCallback(
    (data) => {
      return dispatch(register(data))
    },
    [dispatch]
  )

  const handleLoginWithGoogle = useCallback(
    (token) => {
      return dispatch(loginWithGoogle(token))
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // allow bypass for testing convenience (Vite injects vars prefixed with VITE_)
  const skipAuth =
    import.meta.env.VITE_SKIP_AUTH === 'true' ||
    import.meta.env.REACT_APP_SKIP_AUTH === 'true'
  const isAuthenticated = skipAuth || (!!token && !!user)

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    loginWithGoogle: handleLoginWithGoogle,
    logout: handleLogout,
    clearError: handleClearError,
  }
}
