import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../store/profileSlice'

export const useProfiles = () => {
  const dispatch = useDispatch()
  const { profiles, loading, error } = useSelector((state) => state.profiles || {})

  useEffect(() => {
    dispatch(fetchProfiles())
  }, [dispatch])

  const create = useCallback(
    (data) => dispatch(createProfile(data)),
    [dispatch]
  )

  const update = useCallback(
    (id, data) => dispatch(updateProfile({ id, data })),
    [dispatch]
  )

  const remove = useCallback(
    (id) => dispatch(deleteProfile(id)),
    [dispatch]
  )

  const refetch = useCallback(
    () => {
      dispatch(fetchProfiles())
    },
    [dispatch]
  )

  return {
    profiles: profiles || [],
    loading,
    error,
    create,
    update,
    remove,
    refetch,
  }
}
