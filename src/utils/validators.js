import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')

export const phoneSchema = z
  .string()
  .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')

export const urlSchema = z.string().url('Invalid URL')

export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const applicationSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  applied_date: z.string().date('Invalid date format'),
  status: z.enum(['saved', 'applied', 'assessment', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn']),
  contact_person: z.string().optional(),
  contact_email: emailSchema.optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  notes: z.string().optional(),
})

export const profileSchema = z.object({
  profile_type: z.enum(['backend', 'frontend', 'fullstack', 'devops', 'data', 'mobile', 'other']),
  title: z.string().min(3, 'Title is required'),
  bio: z.string().optional(),
  years_experience: z.number().min(0).max(70),
  skills: z.array(z.object({
    name: z.string(),
    proficiency: z.number().min(1).max(4),
  })).optional(),
})

export const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  description: z.string().min(10, 'Job description is required'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  location_type: z.enum(['remote', 'hybrid', 'onsite']),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  salary_min: z.number().optional().nullable(),
  salary_max: z.number().optional().nullable(),
  deadline: z.string().date().optional(),
})

// Validation functions
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.errors[0]?.message }
  }
}

export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.errors[0]?.message }
  }
}

export const validatePhone = (phone) => {
  try {
    phoneSchema.parse(phone)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.errors[0]?.message }
  }
}

export const validateUrl = (url) => {
  try {
    urlSchema.parse(url)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.errors[0]?.message }
  }
}
