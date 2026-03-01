import { useDispatch, useSelector } from 'react-redux'
import { setFilter, clearFilters } from '../../store/uiSlice'
import Input from '../common/Input'
import Button from '../common/Button'
import { STATUS_LABELS } from '../../utils/constants'

export default function ApplicationFilters() {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.ui.filters)

  const handleStatusChange = (status) => {
    dispatch(setFilter({ status: filters.status === status ? null : status }))
  }

  const handleSearchChange = (query) => {
    dispatch(setFilter({ searchQuery: query }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      <div className="space-y-4">
        {/* Search */}
        <Input
          placeholder="Search by job title or company..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        {/* Status Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.status === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.status || filters.searchQuery) && (
          <Button variant="secondary" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
