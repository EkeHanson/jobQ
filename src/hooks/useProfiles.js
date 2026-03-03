import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../store/profileSlice'
import profileService from '../services/profiles'

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

  // Skill management
  const getSkills = useCallback(
    async (profileId) => {
      try {
        const response = await profileService.getSkills(profileId)
        return response
      } catch (error) {
        console.error('Error getting skills:', error)
        throw error
      }
    },
    []
  )

  const addSkill = useCallback(
    async (profileId, skillName) => {
      try {
        const response = await profileService.addSkill(profileId, { name: skillName })
        return response
      } catch (error) {
        console.error('Error adding skill:', error)
        throw error
      }
    },
    []
  )

  const removeSkill = useCallback(
    async (profileId, skillId) => {
      try {
        await profileService.deleteSkill(profileId, skillId)
      } catch (error) {
        console.error('Error removing skill:', error)
        throw error
      }
    },
    []
  )

  return {
    profiles: profiles || [],
    loading,
    error,
    create,
    update,
    remove,
    refetch,
    addSkill,
    removeSkill,
    getSkills,
  }
}
