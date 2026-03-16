import { createSlice } from '@reduxjs/toolkit'

// Try to load sidebar state from localStorage
const loadSidebarState = () => {
  try {
    const saved = localStorage.getItem('sidebarState')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading sidebar state:', e)
  }
  return null
}

const savedSidebar = loadSidebarState()

const initialState = {
  sidebar: {
    isOpen: true,
    isMobile: false,
    isCollapsed: savedSidebar?.isCollapsed ?? true,
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
      // Save to localStorage
      localStorage.setItem('sidebarState', JSON.stringify(state.sidebar))
    },
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed
      // Save to localStorage
      localStorage.setItem('sidebarState', JSON.stringify(state.sidebar))
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
