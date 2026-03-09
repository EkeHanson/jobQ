import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
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
    archive,
    unarchive,
    softDelete,
    restore,
    setCurrent,
    clearCurrent,
    refetch,
  }
}
