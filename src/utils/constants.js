const STATUS_COLORS = {
  saved: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  assessment: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
}

const STATUS_LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  assessment: 'Assessment',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const PROFILE_TYPES = {
  backend: 'Backend Developer',
  frontend: 'Frontend Developer',
  fullstack: 'Fullstack Developer',
  devops: 'DevOps Engineer',
  data: 'Data Scientist',
  mobile: 'Mobile Developer',
  other: 'Other',
}

const JOB_TYPES = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

const EMPLOYMENT_TYPES = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
}

const EXPERIENCE_LEVELS = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead / Manager',
  executive: 'Executive',
}

const PROFICIENCY_LEVELS = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
}

const DEGREE_TYPES = {
  high_school: 'High School',
  associate: 'Associate Degree',
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  phd: 'PhD',
  certificate: 'Certificate',
  bootcamp: 'Bootcamp',
}

const NOTIFICATION_TYPES = {
  deadline: 'Deadline Reminder',
  interview: 'Interview Reminder',
  follow_up: 'Follow-up Reminder',
  status_change: 'Status Change',
  job_alert: 'Job Alert',
  prep_suggestion: 'Preparation Suggestion',
  weekly_summary: 'Weekly Summary',
  system: 'System Notification',
}

const PLAN_TYPES = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const SUBSCRIPTION_STATUS = {
  active: 'Active',
  past_due: 'Past Due',
  canceled: 'Canceled',
  expired: 'Expired',
  trial: 'Trial',
}

export {
  STATUS_COLORS,
  STATUS_LABELS,
  PROFILE_TYPES,
  JOB_TYPES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  PROFICIENCY_LEVELS,
  DEGREE_TYPES,
  NOTIFICATION_TYPES,
  PLAN_TYPES,
  SUBSCRIPTION_STATUS,
}
