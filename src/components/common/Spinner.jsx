import { cn } from '../../utils/helpers'

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-4 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

export default Spinner
