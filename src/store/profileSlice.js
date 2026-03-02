import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from '../services/profiles'

export const fetchProfiles = createAsyncThunk(
  'profiles/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfiles()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createProfile = createAsyncThunk(
  'profiles/createProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.createProfile(data)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profiles/updateProfile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteProfile = createAsyncThunk(
  'profiles/deleteProfile',
  async (id, { rejectWithValue }) => {
    try {
      await profileService.deleteProfile(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  profiles: [],
  loading: false,
  error: null,
}

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false
        state.profiles = action.payload.results || action.payload
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profiles.unshift(action.payload)
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const idx = state.profiles.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.profiles[idx] = action.payload
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter((p) => p.id !== action.payload)
      })
  },
})

export const { clearError } = profileSlice.actions
export default profileSlice.reducer
