import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../services/api'

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/applications', { params })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchStats = createAsyncThunk(
  'applications/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/applications/stats', { params })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createApplication = createAsyncThunk(
  'applications/create',
  async (data, { rejectWithValue }) => {
    try {
      // Transform frontend data to match backend structure
      const payload = {
        job_title: data.job_title || data.job?.title || '',
        company_name: data.company_name || data.job?.company?.name || '',
        status: data.status || 'saved',
        applied_date: data.applied_date || data.appliedDate || null,
        deadline: data.deadline || null,
        notes: data.notes || '',
      }
      const response = await apiClient.post('/applications', payload)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/applications/${id}`, data)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/applications/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  applications: [],
  stats: null,
  loading: false,
  error: null,
  currentApplication: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false
        state.applications = action.payload.results || action.payload
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Application
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.unshift(action.payload)
      })
      // Update Application
      .addCase(updateApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id)
        if (index !== -1) {
          state.applications[index] = action.payload
        }
        state.currentApplication = action.payload
      })
      // Delete Application
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(app => app.id !== action.payload)
      })
  },
})

export const { setCurrentApplication, clearCurrentApplication, clearError } = applicationSlice.actions
export default applicationSlice.reducer
