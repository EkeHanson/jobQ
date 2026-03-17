import { useState } from 'react'
import { formatDate } from '../../utils/formatters'
import { ArrowsUpDownIcon, PencilSquareIcon, ArchiveBoxIcon, ArrowUturnDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import StatusBadge from './StatusBadge'
import Button from '../common/Button'

export default function ApplicationTable({ 
  applications, 
  onEdit, 
  onArchive, 
  onUnarchive,
  onDelete,
  archivingId,
  showArchived = false,
  loading = false 
}) {
  const [sortField, setSortField] = useState('applied_date')
  const [sortDirection, setSortDirection] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedApplications = [...applications].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    // Handle direct fields
    if (sortField === 'job_title') {
      aVal = a.job_title
      bVal = b.job_title
    } else if (sortField === 'company_name') {
      aVal = a.company_name
      bVal = b.company_name
    }

    if (!aVal) return 1
    if (!bVal) return -1

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        {showArchived ? (
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <ArchiveBoxIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No archived applications yet.</p>
            <p className="text-xs text-gray-400 mt-1">Archive applications to hide them from your main list.</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No applications yet. Start by adding your first application!</p>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-2 py-2 sm:px-3 text-left">
              <button
                onClick={() => handleSort('job_title')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Job Title
                <ArrowsUpDownIcon className="w-3 h-3" />
              </button>
            </th>
            <th className="px-2 py-2 sm:px-3 text-left hidden md:table-cell">
              <button
                onClick={() => handleSort('company_name')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Company
                <ArrowsUpDownIcon className="w-3 h-3" />
              </button>
            </th>
            <th className="px-2 py-2 sm:px-3 text-left">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Status
                <ArrowsUpDownIcon className="w-3 h-3" />
              </button>
            </th>
            <th className="px-2 py-2 sm:px-3 text-left hidden lg:table-cell">
              <button
                onClick={() => handleSort('applied_date')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Applied
                <ArrowsUpDownIcon className="w-3 h-3" />
              </button>
            </th>
            <th className="px-2 py-2 sm:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
              Deadline
            </th>
            <th className="px-2 py-2 sm:px-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedApplications.map((app) => (
            <tr key={app.id} className={`hover:bg-gray-50 transition-colors ${app.archived ? 'bg-gray-50/50' : ''}`}>
              <td className="px-2 py-2 sm:px-3">
                <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{app.job_title || 'N/A'}</div>
              </td>
              <td className="px-2 py-2 sm:px-3 hidden md:table-cell">
                <div className="text-sm text-gray-600 truncate max-w-[100px]">{app.company_name || 'N/A'}</div>
              </td>
              <td className="px-2 py-2 sm:px-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-2 py-2 sm:px-3 text-sm text-gray-600 hidden lg:table-cell">
                {formatDate(app.applied_date)}
              </td>
              <td className="px-2 py-2 sm:px-3 text-sm text-gray-600 hidden lg:table-cell">
                {app.deadline ? formatDate(app.deadline) : '—'}
              </td>
              <td className="px-2 py-2 sm:px-3 text-right">
                <div className="flex justify-end gap-1">
                  {!showArchived && (
                    <button
                      onClick={() => onEdit(app)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  {showArchived ? (
                    <>
                      <button
                        onClick={() => onUnarchive(app)}
                        disabled={archivingId === app.id}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                        title="Unarchive"
                      >
                        <ArrowUturnDownIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        disabled={archivingId === app.id}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onArchive(app)}
                      disabled={archivingId === app.id}
                      className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors disabled:opacity-50"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
