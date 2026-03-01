import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../store/jobSlice'

// jobSlice provides CRUD actions for jobs
export const useJobs = (filters = {}) => {
  const dispatch = useDispatch()
  const { jobs, loading, error, pagination } = useSelector((state) => state.jobs || {})

  useEffect(() => {
    dispatch(fetchJobs(filters))
  }, [dispatch, JSON.stringify(filters)])

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
    [dispatch, JSON.stringify(filters)]
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
