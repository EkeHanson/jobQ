import { cn } from '../../utils/helpers'
import { getStatusBadgeColor } from '../../utils/helpers'
import { STATUS_LABELS } from '../../utils/constants'

const Badge = ({ status, label, variant = 'default', className = '' }) => {
  const colorClass = getStatusBadgeColor(status)
  const displayLabel = label || STATUS_LABELS[status] || status

  const variantClasses = {
    default: colorClass,
    subtle: 'bg-gray-100 text-gray-700',
    solid: 'bg-blue-600 text-white',
    outline: 'border border-gray-300 text-gray-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant !== 'default' ? variantClasses[variant] : colorClass,
        className
      )}
    >
      {displayLabel}
    </span>
  )
}

export default Badge
