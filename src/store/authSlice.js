import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../services/auth'

export const login = createAsyncThunk(
  'auth/login',
  async ({ identifier, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await authService.login(identifier, password, rememberMe)
      
      // Check if 2FA is required - return special response instead of storing tokens
      if (response?.require_2fa) {
        return response  // Will have require_2fa: true
      }
      
      return response
    } catch (error) {
      // Handle API error response
      if (error?.detail) {
        return rejectWithValue(error.detail)
      }
      if (error?.response?.data?.detail) {
        return rejectWithValue(error.response.data.detail)
      }
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithGoogle(token)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        
        // Check if 2FA is required - don't store tokens yet
        if (action.payload?.require_2fa) {
          return  // Just return, don't set tokens
        }
        
        state.user = action.payload.user
        state.token = action.payload.access
        state.refreshToken = action.payload.refresh
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.access)
        localStorage.setItem('refreshToken', action.payload.refresh)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

  },
})

export const { logout, clearError, setUser } = authSlice.actions
export default authSlice.reducer
