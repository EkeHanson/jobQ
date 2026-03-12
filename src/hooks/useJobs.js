import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../store/jobSlice'

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

// jobSlice provides CRUD actions for jobs
export const useJobs = (filters = {}) => {
  const dispatch = useDispatch()
  const { jobs, loading, error, pagination } = useSelector((state) => state.jobs || {})

  useDeepCompareEffect(() => {
    dispatch(fetchJobs(filters))
  }, [dispatch, filters])

  const create = useCallback(
    (data) => dispatch(createJob(data)),
    [dispatch]
  )

  const update = useCallback(
    (id, data) => dispatch(updateJob({ id, data })),
    [dispatch]
  )

  const remove = useCallback(
    (id) => dispatch(deleteJob(id)),
    [dispatch]
  )

  const refetch = useCallback(
    () => {
      dispatch(fetchJobs(filters))
    },
    [dispatch, filters]
  )

  return {
    jobs: jobs || [],
    loading,
    error,
    pagination,
    create,
    update,
    remove,
    refetch,
  }
}
