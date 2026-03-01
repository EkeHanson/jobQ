import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import jobService from '../services/jobs'

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (data, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJob(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload.results || action.payload
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload)
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((j) => j.id === action.payload.id)
        if (idx !== -1) state.jobs[idx] = action.payload
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j.id !== action.payload)
      })
  },
})

export const { clearError } = jobSlice.actions
export default jobSlice.reducer
