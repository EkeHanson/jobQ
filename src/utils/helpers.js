export const getStatusBadgeColor = (status) => {
  const colors = {
    saved: 'bg-gray-100 text-gray-800',
    applied: 'bg-blue-100 text-blue-800',
    assessment: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-purple-100 text-purple-800',
    offer: 'bg-green-100 text-green-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-slate-100 text-slate-800',
  }
  return colors[status] || colors.saved
}

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const getDeadlineStatus = (deadline) => {
  if (!deadline) return 'no-deadline'

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

  if (daysUntil < 0) return 'expired'
  if (daysUntil <= 3) return 'urgent'
  if (daysUntil <= 7) return 'soon'
  return 'ok'
}

export const getResponseRateStatus = (rate) => {
  if (rate >= 50) return 'excellent'
  if (rate >= 30) return 'good'
  if (rate >= 15) return 'fair'
  return 'low'
}

export const getApplicationStats = (applications = []) => {
  const stats = {
    total: applications.length,
    by_status: {},
    by_source: {},
    response_rate: 0,
    interview_rate: 0,
    offer_rate: 0,
  }

  applications.forEach((app) => {
    // Count by status
    const status = app.status || 'unknown'
    stats.by_status[status] = (stats.by_status[status] || 0) + 1

    // Count by source
    const source = app.job?.source || 'unknown'
    stats.by_source[source] = (stats.by_source[source] || 0) + 1
  })

  // Calculate rates
  if (stats.total > 0) {
    stats.interview_rate = ((stats.by_status.interview || 0) / stats.total) * 100
    stats.offer_rate = ((stats.by_status.offer || 0) / stats.total) * 100
    stats.response_rate =
      ((stats.by_status.interview || 0) +
        (stats.by_status.offer || 0) +
        (stats.by_status.rejected || 0)) /
      stats.total *
      100
  }

  return stats
}

export const sortApplications = (applications, field, direction = 'asc') => {
  const sorted = [...applications]

  sorted.sort((a, b) => {
    let aValue = a
    let bValue = b

    // Handle nested fields
    const keys = field.split('.')
    for (const key of keys) {
      aValue = aValue?.[key]
      bValue = bValue?.[key]
    }

    // Handle different types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  return sorted
}

export const filterApplications = (applications, filters) => {
  return applications.filter((app) => {
    if (filters.status && app.status !== filters.status) {
      return false
    }

    if (filters.source && app.job?.source !== filters.source) {
      return false
    }

    if (filters.company && !app.job?.company?.name?.toLowerCase().includes(filters.company.toLowerCase())) {
      return false
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !app.job?.title?.toLowerCase().includes(searchLower) &&
        !app.job?.company?.name?.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }

    if (filters.dateFrom) {
      const appDate = new Date(app.applied_date)
      if (appDate < new Date(filters.dateFrom)) {
        return false
      }
    }

    if (filters.dateTo) {
      const appDate = new Date(app.applied_date)
      if (appDate > new Date(filters.dateTo)) {
        return false
      }
    }

    return true
  })
}

export const getUploadedFileName = (file) => {
  return `${Date.now()}-${file.name}`
}

export const isValidFile = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  if (!file) return false
  if (file.size > maxSize) return { valid: false, error: 'File is too large' }
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }
  return { valid: true }
}

export const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
