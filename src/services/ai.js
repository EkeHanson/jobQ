import apiClient from './api'

const aiService = {
  // Interview Preparation
  prepareInterview: async (applicationId) => {
    return apiClient.post('/ai/prepare-interview', {
      application_id: applicationId,
    })
  },

  generateQuestions: async (skills) => {
    return apiClient.post('/ai/generate-questions', { skills })
  },

  // Skill Gap Analysis
  analyzeSkillGap: async (applicationId) => {
    return apiClient.post('/ai/analyze-skill-gap', {
      application_id: applicationId,
    })
  },

  // Resume Analysis
  analyzeResume: async (formData) => {
    return apiClient.post('/ai/analyze-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Course Recommendations
  recommendCourses: async (skills) => {
    return apiClient.post('/ai/recommend-courses', { skills })
  },

  // Study Roadmap
  generateStudyRoadmap: async (skills, timeframe) => {
    return apiClient.post('/ai/generate-study-roadmap', {
      skills,
      timeframe,
    })
  },
}

export default aiService
