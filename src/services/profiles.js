import apiClient from './api'

const profileService = {
  // Profiles
  getProfiles: async () => {
    return apiClient.get('/profiles')
  },

  getProfile: async (id) => {
    return apiClient.get(`/profiles/${id}`)
  },

  createProfile: async (data) => {
    return apiClient.post('/profiles', data)
  },

  updateProfile: async (id, data) => {
    return apiClient.put(`/profiles/${id}`, data)
  },

  deleteProfile: async (id) => {
    return apiClient.delete(`/profiles/${id}`)
  },

  // Skills
  addSkill: async (profileId, skill) => {
    return apiClient.post(`/profiles/${profileId}/skills`, skill)
  },

  updateSkill: async (profileId, skillId, skill) => {
    return apiClient.put(`/profiles/${profileId}/skills/${skillId}`, skill)
  },

  deleteSkill: async (profileId, skillId) => {
    return apiClient.delete(`/profiles/${profileId}/skills/${skillId}`)
  },

  // Experience
  addExperience: async (profileId, data) => {
    return apiClient.post(`/profiles/${profileId}/experiences`, data)
  },

  updateExperience: async (profileId, experienceId, data) => {
    return apiClient.put(`/profiles/${profileId}/experiences/${experienceId}`, data)
  },

  deleteExperience: async (profileId, experienceId) => {
    return apiClient.delete(`/profiles/${profileId}/experiences/${experienceId}`)
  },

  // Education
  addEducation: async (profileId, data) => {
    return apiClient.post(`/profiles/${profileId}/education`, data)
  },

  updateEducation: async (profileId, educationId, data) => {
    return apiClient.put(`/profiles/${profileId}/education/${educationId}`, data)
  },

  deleteEducation: async (profileId, educationId) => {
    return apiClient.delete(`/profiles/${profileId}/education/${educationId}`)
  },

  // Certifications
  addCertification: async (profileId, data) => {
    return apiClient.post(`/profiles/${profileId}/certifications`, data)
  },

  deleteCertification: async (profileId, certificationId) => {
    return apiClient.delete(`/profiles/${profileId}/certifications/${certificationId}`)
  },

  // Resumes
  uploadResume: async (profileId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/profiles/${profileId}/resumes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getResumes: async (profileId) => {
    return apiClient.get(`/profiles/${profileId}/resumes`)
  },

  deleteResume: async (profileId, resumeId) => {
    return apiClient.delete(`/profiles/${profileId}/resumes/${resumeId}`)
  },
}

export default profileService
