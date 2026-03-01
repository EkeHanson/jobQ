import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (date, dateFormat = 'MMM dd, yyyy') => {
  if (!date) return 'N/A'
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, dateFormat)
  } catch {
    return 'Invalid date'
  }
}

export const formatDateTime = (date, dateFormat = 'MMM dd, yyyy HH:mm') => {
  if (!date) return 'N/A'
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, dateFormat)
  } catch {
    return 'Invalid date'
  }
}

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, {
      addSuffix: true,
    })
  } catch {
    return 'Invalid date'
  }
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return 'N/A'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

export const formatNumber = (number) => {
  if (!number) return '0'
  try {
    return new Intl.NumberFormat('en-US').format(number)
  } catch {
    return number
  }
}

export const formatPercentage = (value, decimals = 1) => {
  if (!value) return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const capitalizeFirstLetter = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return phone
  }

  if (cleaned.length === 11 && cleaned[0] !== '1') {
    return phone
  }

  const areaCode = cleaned.slice(-10, -7)
  const firstPart = cleaned.slice(-7, -4)
  const secondPart = cleaned.slice(-4)

  return `(${areaCode}) ${firstPart}-${secondPart}`
}

export const formatSalaryRange = (min, max, currency = 'USD') => {
  if (!min && !max) return 'Not specified'
  if (min && !max) return `${formatCurrency(min, currency)}+`
  if (!min && max) return `Up to ${formatCurrency(max, currency)}`
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`
}
