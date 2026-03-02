import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebar: {
    isOpen: true,
    isMobile: false,
    isCollapsed: true,
  },
  modals: {
    isApplicationFormOpen: false,
    isJobFormOpen: false,
    isProfileFormOpen: false,
    isDeleteConfirmOpen: false,
  },
  filters: {
    status: null,
    source: null,
    dateRange: null,
    searchQuery: '',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed
    },
    setSidebarMobile: (state, action) => {
      state.sidebar.isMobile = action.payload
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  toggleSidebar,
  toggleSidebarCollapse,
  setSidebarMobile,
  openModal,
  closeModal,
  setFilter,
  clearFilters,
} = uiSlice.actions

export default uiSlice.reducer
