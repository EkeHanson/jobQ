import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    is_staff: false,
    is_active: true,
  })
  const { addToast } = useToast()

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const data = await adminService.getUsers(page)
      setUsers(data.results || [])
      setTotalPages(data.total_pages || 1)
      setCurrentPage(Number(data.current_page) || 1)
    } catch (err) {
      console.error('Failed to load users', err)
      addToast('Unable to load users. Make sure you are logged in as an admin.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNewUserChange = (event) => {
    const { name, value, type, checked } = event.target
    setNewUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreateUser = async () => {
    try {
      setLoading(true)
      await adminService.createUser(newUser)
      addToast('User created successfully.', 'success')
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        location: '',
        is_staff: false,
        is_active: true,
      })
      setShowCreateForm(false)
      fetchUsers(currentPage)
    } catch (err) {
      console.error('Failed to create user', err)
      addToast('Unable to create user. Check required fields and permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setNewUser({
      username: user.username || '',
      email: user.email || '',
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      location: user.location || '',
      is_staff: user.is_staff || false,
      is_active: user.is_active !== false,
    })
    setShowEditForm(true)
  }

  const handleUpdateUser = async () => {
    try {
      setLoading(true)
      const payload = { ...newUser }
      if (!payload.password) {
        delete payload.password
      }
      await adminService.updateUser(selectedUser.id, payload)
      addToast('User updated successfully.', 'success')
      setShowEditForm(false)
      setSelectedUser(null)
      fetchUsers(currentPage)
    } catch (err) {
      console.error('Failed to update user', err)
      addToast('Unable to update user. Check permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.username}" permanently?`)) return
    try {
      await adminService.deleteUser(user.id)
      addToast('User deleted successfully.', 'success')
      fetchUsers(currentPage)
    } catch (err) {
      console.error('Failed to delete user', err)
      addToast('Unable to delete user. Check permissions.', 'error')
    }
  }

  const handleToggleSuspension = async (user) => {
    try {
      const action = user.is_suspended ? 'unsuspend' : 'suspend'
      const response = user.is_suspended
        ? await adminService.unsuspendUser(user.id)
        : await adminService.suspendUser(user.id)

      addToast(response.detail || `User ${action}ed successfully`, 'success')
      fetchUsers(currentPage)
    } catch (err) {
      console.error('Failed to update user status', err)
      addToast('Unable to update user status. Check permissions.', 'error')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-2">
          <a href="/admin" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </a>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage registered users, create new accounts, and control user permissions.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 w-full sm:w-auto"
          >
            {showCreateForm ? 'Hide create form' : '+ Create new user'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">+</span>
              Create User
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  name="location"
                  value={newUser.location}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_staff"
                  type="checkbox"
                  name="is_staff"
                  checked={newUser.is_staff}
                  onChange={handleNewUserChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_staff" className="text-sm text-gray-700">Staff status</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_active"
                  type="checkbox"
                  name="is_active"
                  checked={newUser.is_active}
                  onChange={handleNewUserChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateUser} className="w-full sm:w-auto">
                Create User
              </Button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedUser && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">✎</span>
              Edit User: {selectedUser.username}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  name="location"
                  value={newUser.location}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit_is_staff"
                  type="checkbox"
                  name="is_staff"
                  checked={newUser.is_staff}
                  onChange={handleNewUserChange}
                  className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="edit_is_staff" className="text-sm text-gray-700">Staff status</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit_is_active"
                  type="checkbox"
                  name="is_active"
                  checked={newUser.is_active}
                  onChange={handleNewUserChange}
                  className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="edit_is_active" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => {
                  setShowEditForm(false)
                  setSelectedUser(null)
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateUser} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                Update User
              </Button>
            </div>
          </div>
        )}

        {/* Users Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Username</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Suspended</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_staff ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.is_staff ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(user)}
                          className={`p-1.5 rounded-lg transition-colors ${user.is_suspended ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                          title={user.is_suspended ? 'Unsuspend' : 'Suspend'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {user.is_suspended ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            )}
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Users Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading users…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.is_suspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.is_staff && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Staff
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    ID: {user.id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 flex-1"
                    onClick={() => handleViewUser(user)}
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 flex-1"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className={`px-3 py-1.5 text-xs flex-1 ${user.is_suspended ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    onClick={() => handleToggleSuspension(user)}
                  >
                    {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                  </Button>
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 flex-1"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600">Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              className="flex-1 sm:flex-none"
            >
              ← Previous
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              className="flex-1 sm:flex-none"
            >
              Next →
            </Button>
          </div>
        </div>

        {/* View User Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} size="full" className="max-w-full sm:max-w-2xl">
          <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xl ring-1 ring-black/5 w-full">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">User details</h2>
                <p className="mt-1 text-sm text-slate-500">Compact summary of account status, permissions, and activity metadata.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {selectedUser && (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Username</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedUser.username}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Email</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Name</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{`${selectedUser.first_name || '-'} ${selectedUser.last_name || '-'}`}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedUser.phone || selectedUser.location || '—'}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Role</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.is_staff ? 'Staff' : 'User'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Suspension</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.is_suspended ? 'Suspended' : 'Clear'}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">2FA</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.is_2fa_enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Joined</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.date_joined ? new Date(selectedUser.date_joined).toLocaleDateString() : '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Last login</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : '—'}</p>
                  </div>
                </div>

                {selectedUser.is_suspended && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">Suspension details</p>
                    <p className="mt-2 text-sm text-red-700">{selectedUser.suspension_reason || 'No reason provided'}</p>
                    <p className="mt-2 text-xs text-red-500">Suspended at: {selectedUser.suspended_at ? new Date(selectedUser.suspended_at).toLocaleString() : '—'}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <Button type="button" onClick={() => setShowViewModal(false)} className="w-full sm:w-auto">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
