import { useState } from 'react'
import { formatDate } from '../../utils/formatters'
import { ArrowsUpDownIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import StatusBadge from './StatusBadge'
import Button from '../common/Button'

export default function ApplicationTable({ applications, onEdit, onView, loading = false }) {
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

    // Handle nested fields
    if (sortField === 'job.title') {
      aVal = a.job?.title
      bVal = b.job?.title
    } else if (sortField === 'job.company.name') {
      aVal = a.job?.company?.name
      bVal = b.job?.company?.name
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No applications yet. Start by adding your first application!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('job.title')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Job Title
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('job.company.name')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Company
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Status
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('applied_date')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
              >
                Applied Date
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedApplications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{app.job?.title || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{app.job?.company?.name || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(app.applied_date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {app.job?.deadline ? formatDate(app.job.deadline) : 'N/A'}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(app)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
