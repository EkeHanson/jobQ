import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { format } from 'date-fns'

const COLUMNS = [
  { id: 'saved', title: 'Saved', color: 'bg-gray-100' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-100' },
  { id: 'assessment', title: 'Assessment', color: 'bg-purple-100' },
  { id: 'interview', title: 'Interview', color: 'bg-yellow-100' },
  { id: 'offer', title: 'Offer', color: 'bg-green-100' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100' },
  { id: 'accepted', title: 'Accepted', color: 'bg-emerald-100' },
  { id: 'withdrawn', title: 'Withdrawn', color: 'bg-gray-200' },
]

export default function ApplicationKanbanBoard({ applications = [], update, loading }) {
  const [columns, setColumns] = useState({})
  const [selectedApp, setSelectedApp] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Group applications by status
    const grouped = {}
    COLUMNS.forEach(col => {
      grouped[col.id] = applications.filter(app => app.status === col.id)
    })
    setColumns(grouped)
  }, [applications])

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const appId = parseInt(draggableId)
    const newStatus = destination.droppableId

    // Optimistic update
    const newColumns = { ...columns }
    const sourceApps = [...newColumns[source.droppableId]]
    const [removed] = sourceApps.splice(source.index, 1)
    newColumns[destination.droppableId].splice(destination.index, 0, removed)
    setColumns(newColumns)

    // Update in backend
    try {
      await update(appId, { status: newStatus })
    } catch (error) {
      console.error('Failed to update status:', error)
      // Revert on error
      setColumns(columns)
    }
  }

  const handleCardClick = (app) => {
    setSelectedApp(app)
    setShowModal(true)
  }

  const getColumnCount = (columnId) => {
    return columns[columnId]?.length || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-48 sm:w-56">
              <div className={`rounded-t px-2 py-1.5 sm:px-3 sm:py-2 ${column.color}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">{column.title}</h3>
                  <span className="text-xs text-gray-600 bg-white px-1.5 py-0.5 rounded-full">
                    {getColumnCount(column.id)}
                  </span>
                </div>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-50 rounded-b min-h-[150px] sm:min-h-[200px] p-1.5 space-y-1.5 ${
                      snapshot.isDraggingOver ? 'bg-primary-50' : ''
                    }`}
                  >
                    {columns[column.id]?.map((app, index) => (
                      <Draggable key={app.id} draggableId={String(app.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleCardClick(app)}
                            className={`bg-white rounded shadow-sm p-2 sm:p-3 cursor-pointer hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                              {app.job_title || 'Untitled'}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">{app.company_name}</p>
                            {app.follow_up_date && (
                              <div className="mt-1 text-[10px] sm:text-xs text-orange-600">
                                Follow up: {format(new Date(app.follow_up_date), 'MMM d')}
                              </div>
                            )}
                            {app.interviews?.length > 0 && (
                              <div className="mt-1 text-[10px] sm:text-xs text-blue-600">
                                {app.interviews.length} interview(s)
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Application Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedApp?.job_title || 'Application Details'}
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Company</label>
                <p className="font-medium">{selectedApp.company_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className="font-medium capitalize">{selectedApp.status}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Source</label>
                <p className="font-medium capitalize">{selectedApp.source || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Applied Date</label>
                <p className="font-medium">
                  {selectedApp.applied_date ? format(new Date(selectedApp.applied_date), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Follow-up Date</label>
                <p className="font-medium">
                  {selectedApp.follow_up_date ? format(new Date(selectedApp.follow_up_date), 'MMM d, yyyy') : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Deadline</label>
                <p className="font-medium">
                  {selectedApp.deadline ? format(new Date(selectedApp.deadline), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            
            {selectedApp.notes && (
              <div>
                <label className="text-sm text-gray-500">Notes</label>
                <p className="text-sm mt-1">{selectedApp.notes}</p>
              </div>
            )}

            {selectedApp.interviews?.length > 0 && (
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Interviews</label>
                <div className="space-y-2">
                  {selectedApp.interviews.map((interview) => (
                    <div key={interview.id} className="bg-gray-50 rounded p-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{interview.interview_type}</span>
                        <span className="text-gray-500">
                          {interview.interview_date ? format(new Date(interview.interview_date), 'MMM d') : 'TBD'}
                        </span>
                      </div>
                      {interview.interviewer && (
                        <p className="text-gray-500 text-xs">{interview.interviewer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
