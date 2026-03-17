import { useDispatch, useSelector } from 'react-redux'
import { setFilter, clearFilters } from '../../store/uiSlice'
import Input from '../common/Input'
import Button from '../common/Button'
import { STATUS_LABELS } from '../../utils/constants'

export default function ApplicationFilters() {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.ui.filters)

  const handleStatusChange = (status) => {
    dispatch(setFilter({ status: status || null }))
  }

  const handleSearchChange = (query) => {
    dispatch(setFilter({ searchQuery: query }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-3">
      <div className="flex flex-wrap items-end gap-2 sm:gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[150px]">
          <Input
            placeholder="Search..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="min-w-[140px]">
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-2 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs sm:text-sm"
          >
            <option value="">All Status</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.status || filters.searchQuery) && (
          <Button variant="secondary" size="sm" onClick={handleClearFilters} className="text-xs">
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
