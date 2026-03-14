import apiClient from './api'

const aiService = {
  // Job Match Score - Calculate match between your skills and job requirements
  getJobMatchScore: async (jobDescription, jobSkills) => {
    return apiClient.post('/ai/job-match/', {
      job_description: jobDescription,
      job_skills: jobSkills,
    })
  },

  // Resume Optimization - Get recommendations to optimize your resume for a job
  optimizeResume: async (jobDescription, resumeText) => {
    return apiClient.post('/ai/resume-optimizer/', {
      job_description: jobDescription,
      resume_text: resumeText,
    })
  },

  // Interview Preparation
  prepareInterview: async (applicationId) => {
    return apiClient.post('/ai/interview-prep/', {
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
