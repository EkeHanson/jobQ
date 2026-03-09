import { forwardRef, useState } from 'react'
import { cn } from '../../utils/helpers'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const Input = forwardRef(
  (
    {
      label,
      error,
      required = false,
      type = 'text',
      className = '',
      containerClassName = '',
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            dir="ltr"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={cn(
              'w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200',
              'placeholder:text-gray-400',
              error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
              isPassword && showPasswordToggle && 'pr-12',
              className
            )}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
