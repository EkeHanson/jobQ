import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import applicationReducer from './applicationSlice'
import notificationReducer from './notificationSlice'
import uiReducer from './uiSlice'
import jobReducer from './jobSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
    jobs: jobReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
