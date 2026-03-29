import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [newPlan, setNewPlan] = useState({
    name: '',
    price_cents: 0,
    max_applications: 0,
    max_profiles: 0,
    max_ai_pastes: 0,
    description: '',
    is_active: true,
  })
  const { addToast } = useToast()

  useEffect(() => {
    fetchPlans()
    fetchSubscriptions()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const data = await adminService.getSubscriptionPlans()
      setPlans(data || [])
    } catch (err) {
      console.error('Failed to load subscription plans', err)
      addToast('Unable to load subscription plans. Check permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true)
      const data = await adminService.getUserSubscriptions()
      setSubscriptions(data.results || data || [])
    } catch (err) {
      console.error('Failed to load subscriptions', err)
      addToast('Unable to load subscriptions. Check permissions.', 'error')
    } finally {
      setLoadingSubscriptions(false)
    }
  }

  const handleNewPlanChange = (event) => {
    const { name, value, type, checked } = event.target
    setNewPlan((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreatePlan = async () => {
    try {
      setLoading(true)
      await adminService.createSubscriptionPlan({
        ...newPlan,
        price_cents: Number(newPlan.price_cents),
        max_applications: Number(newPlan.max_applications),
        max_profiles: Number(newPlan.max_profiles),
        max_ai_pastes: Number(newPlan.max_ai_pastes),
      })
      addToast('Subscription plan created successfully.', 'success')
      setNewPlan({
        name: '',
        price_cents: 0,
        max_applications: 0,
        max_profiles: 0,
        max_ai_pastes: 0,
        description: '',
        is_active: true,
      })
      setShowCreateForm(false)
      fetchPlans()
    } catch (err) {
      console.error('Failed to create subscription plan', err)
      addToast('Unable to create plan. Check required fields and permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan)
    setNewPlan({
      name: plan.name || '',
      price_cents: plan.price_cents || 0,
      max_applications: plan.max_applications || 0,
      max_profiles: plan.max_profiles || 0,
      max_ai_pastes: plan.max_ai_pastes || 0,
      description: plan.description || '',
      is_active: plan.is_active !== false,
    })
    setShowEditForm(true)
  }

  const handleUpdatePlan = async () => {
    try {
      setLoading(true)
      await adminService.updateSubscriptionPlan(selectedPlan.id, {
        ...newPlan,
        price_cents: Number(newPlan.price_cents),
        max_applications: Number(newPlan.max_applications),
        max_profiles: Number(newPlan.max_profiles),
        max_ai_pastes: Number(newPlan.max_ai_pastes),
      })
      addToast('Subscription plan updated successfully.', 'success')
      setShowEditForm(false)
      setSelectedPlan(null)
      fetchPlans()
    } catch (err) {
      console.error('Failed to update subscription plan', err)
      addToast('Unable to update plan. Check permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan)
    setShowViewModal(true)
  }

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this subscription plan permanently?')) return
    try {
      setLoading(true)
      await adminService.deleteSubscriptionPlan(id)
      addToast('Subscription plan deleted successfully.', 'success')
      fetchPlans()
    } catch (err) {
      console.error('Failed to delete plan', err)
      addToast('Unable to delete plan. Check permissions.', 'error')
    } finally {
      setLoading(false)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage subscription plans and pricing tiers.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all duration-200 w-full sm:w-auto"
          >
            {showCreateForm ? 'Hide create form' : '+ Create plan'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">+</span>
              Create Subscription Plan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  name="name"
                  value={newPlan.name}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (cents) *</label>
                <input
                  type="number"
                  name="price_cents"
                  value={newPlan.price_cents}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Applications</label>
                <input
                  type="number"
                  name="max_applications"
                  value={newPlan.max_applications}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Profiles</label>
                <input
                  type="number"
                  name="max_profiles"
                  value={newPlan.max_profiles}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max AI Pastes</label>
                <input
                  type="number"
                  name="max_ai_pastes"
                  value={newPlan.max_ai_pastes}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_active"
                  type="checkbox"
                  name="is_active"
                  checked={newPlan.is_active}
                  onChange={handleNewPlanChange}
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active plan</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newPlan.description}
                  onChange={handleNewPlanChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
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
              <button
                type="button"
                onClick={handleCreatePlan}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 w-full sm:w-auto"
              >
                Save Plan
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedPlan && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">✎</span>
              Edit Subscription Plan: {selectedPlan.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  name="name"
                  value={newPlan.name}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (cents) *</label>
                <input
                  type="number"
                  name="price_cents"
                  value={newPlan.price_cents}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Applications</label>
                <input
                  type="number"
                  name="max_applications"
                  value={newPlan.max_applications}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Profiles</label>
                <input
                  type="number"
                  name="max_profiles"
                  value={newPlan.max_profiles}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max AI Pastes</label>
                <input
                  type="number"
                  name="max_ai_pastes"
                  value={newPlan.max_ai_pastes}
                  onChange={handleNewPlanChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit_is_active"
                  type="checkbox"
                  name="is_active"
                  checked={newPlan.is_active}
                  onChange={handleNewPlanChange}
                  className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="edit_is_active" className="text-sm text-gray-700">Active plan</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newPlan.description}
                  onChange={handleNewPlanChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => {
                  setShowEditForm(false)
                  setSelectedPlan(null)
                }}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleUpdatePlan}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 w-full sm:w-auto"
              >
                Update Plan
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading subscription plans…</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 text-sm text-gray-500">No subscription plans found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="text-green-100 text-2xl font-bold mt-2">₦{plan.price_cents?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 space-y-3">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {plan.max_applications === 0 ? 'Unlimited applications' : `${plan.max_applications} applications`}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {plan.max_profiles === 0 ? 'Unlimited profiles' : `${plan.max_profiles} profiles`}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {plan.max_ai_pastes === 0 ? 'Unlimited AI pastes' : `${plan.max_ai_pastes} AI pastes`}
                    </li>
                    {plan.description && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {plan.description}
                      </li>
                    )}
                  </ul>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 flex-1"
                      onClick={() => handleViewPlan(plan)}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 flex-1"
                      onClick={() => handleEditPlan(plan)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 flex-1"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
              <p className="text-sm text-gray-500">View active subscribers and assigned subscription plans.</p>
            </div>
            <button
              type="button"
              onClick={fetchSubscriptions}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Refresh
            </button>
          </div>

          {loadingSubscriptions ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading subscriptions…</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500">No subscriptions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Started</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Canceled</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">AI Pastes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{subscription.user?.username || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{subscription.user?.email || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{subscription.plan?.name || 'No plan'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${subscription.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {subscription.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{subscription.started_at ? new Date(subscription.started_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{subscription.canceled_at ? new Date(subscription.canceled_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{subscription.ai_pastes_used_this_month}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Plan Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">💳</span>
              Subscription Plan Details
            </h2>
            {selectedPlan && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₦{selectedPlan.price_cents?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max Applications</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.max_applications === 0 ? 'Unlimited' : selectedPlan.max_applications}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max Profiles</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.max_profiles === 0 ? 'Unlimited' : selectedPlan.max_profiles}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max AI Pastes</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.max_ai_pastes === 0 ? 'Unlimited' : selectedPlan.max_ai_pastes}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPlan.is_active ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                {selectedPlan.description && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedPlan.description}</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
