import { format } from 'date-fns'
import { 
  DocumentTextIcon, 
  PaperAirplaneIcon, 
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

// Define the application status flow for timeline
const STATUS_FLOW = [
  { status: 'Saved', color: 'gray', icon: DocumentTextIcon },
  { status: 'Applied', color: 'blue', icon: PaperAirplaneIcon },
  { status: 'Assessment', color: 'yellow', icon: ClipboardDocumentListIcon },
  { status: 'Interview', color: 'purple', icon: ChatBubbleLeftRightIcon },
  { status: 'Offer', color: 'green', icon: TrophyIcon },
  { status: 'Accepted', color: 'emerald', icon: CheckCircleIcon },
  { status: 'Rejected', color: 'red', icon: XCircleIcon },
  { status: 'Withdrawn', color: 'orange', icon: ArrowUturnLeftIcon },
]

const STATUS_COLORS = {
  gray: 'bg-gray-100 border-gray-300 text-gray-600',
  blue: 'bg-blue-100 border-blue-300 text-blue-600',
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-600',
  purple: 'bg-purple-100 border-purple-300 text-purple-600',
  green: 'bg-green-100 border-green-300 text-green-600',
  emerald: 'bg-emerald-100 border-emerald-300 text-emerald-600',
  red: 'bg-red-100 border-red-300 text-red-600',
  orange: 'bg-orange-100 border-orange-300 text-orange-600',
}

export default function ApplicationTimeline({ application, statusHistory = [] }) {
  // Get the current status info
  const currentStatusInfo = STATUS_FLOW.find(
    s => s.status.toLowerCase() === application?.status?.toLowerCase()
  ) || { status: application?.status || 'Unknown', color: 'gray', icon: QuestionMarkCircleIcon }

  // Sort status history by date
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  // Get the current position in the timeline
  const currentIndex = STATUS_FLOW.findIndex(
    s => s.status.toLowerCase() === application?.status?.toLowerCase()
  )

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
        <p className="text-sm text-gray-500">Track your progress through the hiring process</p>
      </div>

      {/* Visual Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {STATUS_FLOW.map((statusInfo, index) => {
            const isPast = index < currentIndex
            const isCurrent = index === currentIndex
            const isFuture = index > currentIndex
            const historyItem = sortedHistory.find(
              h => h.new_status?.toLowerCase() === statusInfo.status.toLowerCase()
            )

            return (
              <div key={statusInfo.status} className="relative flex items-start gap-4">
                {/* Status Icon */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
                    ${isPast ? 'bg-green-100 border-green-500 text-green-600' : ''}
                    ${isCurrent ? `${STATUS_COLORS[statusInfo.color]} border-${statusInfo.color}-500 ring-2 ring-${statusInfo.color}-200` : ''}
                    ${isFuture ? 'bg-gray-50 border-gray-200 text-gray-400' : ''}
                  `}
                >
                  <statusInfo.icon className="w-6 h-6" />
                </div>

                {/* Status Details */}
                <div className={`flex-1 pt-2 ${isFuture ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                      {statusInfo.status}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {historyItem && (
                    <div className="mt-1 text-sm text-gray-500">
                      {historyItem.created_at && (
                        <span>{format(new Date(historyItem.created_at), 'MMM d, yyyy h:mm a')}</span>
                      )}
                      {historyItem.notes && (
                        <p className="mt-1 text-gray-600">{historyItem.notes}</p>
                      )}
                    </div>
                  )}

                  {isCurrent && !historyItem && (
                    <div className="mt-1 text-sm text-gray-500">
                      Applied on {application?.applied_date ? format(new Date(application.applied_date), 'MMM d, yyyy') : 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status History List */}
      {sortedHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Status Change History</h4>
          <div className="space-y-3">
            {sortedHistory.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {item.old_status} → {item.new_status}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                  )}
                  <span className="text-xs text-gray-500">
                    {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
