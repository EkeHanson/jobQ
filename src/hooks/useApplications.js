import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import {
  fetchApplications,
  fetchStats,
  createApplication,
  updateApplication,
  deleteApplication,
  setCurrentApplication,
  clearCurrentApplication,
} from '../store/applicationSlice'

export const useApplications = (filters = {}) => {
  const dispatch = useDispatch()
  const { applications, stats, loading, error, currentApplication } = useSelector(
    (state) => state.applications
  )

  useEffect(() => {
    dispatch(fetchApplications(filters))
    dispatch(fetchStats(filters))
  }, [dispatch, JSON.stringify(filters)])

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
    [dispatch, JSON.stringify(filters)]
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
    setCurrent,
    clearCurrent,
    refetch,
  }
}
