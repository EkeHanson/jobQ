// App configuration - loaded from environment variables
// In Vite, use import.meta.env.VITE_* to access environment variables

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'JobTrack AI'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Helper to get the short name (without "AI" suffix if needed)
export const APP_SHORT_NAME = APP_NAME.replace(/\s*AI\s*$/i, '').trim()

export const SOCIAL_GITHUB = import.meta.env.VITE_SOCIAL_GITHUB || 'https://github.com/EkeHanson'
export const SOCIAL_LINKEDIN = import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://www.linkedin.com/in/ekene-onwon-abraham-4370a0228/'

// Export for use in JSX
export default {
  APP_NAME,
  APP_VERSION,
  APP_SHORT_NAME,
  SOCIAL_GITHUB,
  SOCIAL_LINKEDIN,
}
