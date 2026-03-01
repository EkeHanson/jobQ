import { cn } from '../../utils/helpers'

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
