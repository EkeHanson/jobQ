import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const RichTextEditor = forwardRef(
  ({ value = '', onChange, placeholder, className = '' }, ref) => {
    return (
      <div className={cn('border border-gray-200 rounded-xl overflow-hidden bg-white', className)}>
        <textarea
          ref={ref}
          value={value.replace(/<[^>]*>/g, '')} // Strip HTML tags for plain text
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          className="w-full min-h-[120px] p-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white resize-y font-inherit text-base"
          style={{ fontFamily: 'inherit' }}
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor
