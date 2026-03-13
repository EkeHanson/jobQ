import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, useRef, useMemo } from 'react'
import {
  fetchApplications,
  fetchStats,
  createApplication,
  updateApplication,
  deleteApplication,
  archiveApplication,
  unarchiveApplication,
  softDeleteApplication,
  restoreApplication,
  setCurrentApplication,
  clearCurrentApplication,
} from '../store/applicationSlice'

// Custom hook for deep comparison of dependencies
function useDeepCompareEffect(callback, dependencies) {
  const ref = useRef()
  
  if (!ref.current || !dependenciesAreEqual(dependencies, ref.current)) {
    ref.current = dependencies
  }
  
  useEffect(callback, ref.current)
}

function dependenciesAreEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false
  
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  
  if (keysA.length !== keysB.length) return false
  
  return keysA.every(key => dependenciesAreEqual(a[key], b[key]))
}

export const useApplications = (filters = null) => {
  const dispatch = useDispatch()
  const { applications, stats, loading, error, currentApplication } = useSelector(
    (state) => state.applications
  )
  const prevFiltersRef = useRef(null)
  const hasFetchedRef = useRef(false)

  // Create stable filter key - only recalculates when filters actually change
  const filtersKey = useMemo(() => {
    return filters ? JSON.stringify(filters) : 'empty'
  }, [filters])

  useEffect(() => {
    // Skip if we've already fetched with the same filters
    if (hasFetchedRef.current && prevFiltersRef.current === filtersKey) {
      return
    }
    
    prevFiltersRef.current = filtersKey
    hasFetchedRef.current = true
    
    if (filters === null || Object.keys(filters).length === 0) {
      dispatch(fetchApplications({}))
      dispatch(fetchStats({}))
    } else {
      dispatch(fetchApplications(filters))
      dispatch(fetchStats(filters))
    }
  }, [dispatch, filtersKey])

  const create = useCallback(
    async (data) => {
      const result = await dispatch(createApplication(data))
      if (createApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const update = useCallback(
    async (id, data) => {
      const result = await dispatch(updateApplication({ id, data }))
      if (updateApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const remove = useCallback(
    (id) => dispatch(deleteApplication(id)),
    [dispatch]
  )

  const archive = useCallback(
    async (id) => {
      const result = await dispatch(archiveApplication(id))
      if (archiveApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const unarchive = useCallback(
    async (id) => {
      const result = await dispatch(unarchiveApplication(id))
      if (unarchiveApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const softDelete = useCallback(
    async (id) => {
      const result = await dispatch(softDeleteApplication(id))
      if (softDeleteApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const restore = useCallback(
    async (id) => {
      const result = await dispatch(restoreApplication(id))
      if (restoreApplication.rejected.match(result)) {
        throw result.payload
      }
      return result.payload
    },
    [dispatch]
  )

  const setCurrent = useCallback(
    (app) => dispatch(setCurrentApplication(app)),
    [dispatch]
  )

  const clearCurrent = useCallback(
    () => dispatch(clearCurrentApplication()),
    [dispatch]
  )

  const refetch = useCallback(
    () => {
      dispatch(fetchApplications(filters))
      dispatch(fetchStats(filters))
    },
    [dispatch, filters]
  )

  return {
    applications,
    stats,
    loading,
    error,
    currentApplication,
    create,
    update,
    remove,
    archive,
    unarchive,
    softDelete,
    restore,
    setCurrent,
    clearCurrent,
    refetch,
  }
}
