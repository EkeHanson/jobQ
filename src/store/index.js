import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import applicationReducer from './applicationSlice'
import notificationReducer from './notificationSlice'
import uiReducer from './uiSlice'
import jobReducer from './jobSlice'
import profileReducer from './profileSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
    jobs: jobReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    profiles: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
