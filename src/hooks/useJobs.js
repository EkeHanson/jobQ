import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs } from '../store/jobSlice'

// jobSlice yet to be created; will create shortly.
export const useJobs = (filters = {}) => {
  const dispatch = useDispatch()
  const { jobs, loading, error, pagination } = useSelector((state) => state.jobs || {})

  useEffect(() => {
    dispatch(fetchJobs(filters))
  }, [dispatch, JSON.stringify(filters)])

  return {
    jobs: jobs || [],
    loading,
    error,
    pagination,
  }
}
