import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../services/api'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/notifications', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/read`)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.is_read) {
        state.unreadCount += 1
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.results || action.payload
        state.unreadCount = state.notifications.filter(n => !n.is_read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload)
        if (notification && !notification.is_read) {
          notification.is_read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload)
        if (index !== -1) {
          if (!state.notifications[index].is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
          state.notifications.splice(index, 1)
        }
      })
  },
})

export const { addNotification, clearError } = notificationSlice.actions
export default notificationSlice.reducer
