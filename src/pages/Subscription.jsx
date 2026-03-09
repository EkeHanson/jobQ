import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useToast } from '../components/common/Toast'
import { CheckIcon, InboxIcon } from '@heroicons/react/24/outline'
import subscriptionService from '../services/subscription'

export default function Subscription() {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const { addToast } = useToast()
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  })

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getMySubscription(),
      ])
      // Only use plans from API - user manually creates them in Django admin
      setPlans(plansData || [])
      setCurrentSubscription(subscriptionData)
    } catch (err) {
      console.error('Error fetching subscription:', err)
      // Keep plans empty if API fails - user will create them manually
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan) => {
    // Free plan can be subscribed without payment method
    if (plan.price_cents === 0) {
      try {
        await subscriptionService.upgrade(plan.id)
        addToast(`Successfully subscribed to ${plan.name} plan!`, 'success')
        fetchSubscriptionData()
      } catch (err) {
        console.error('Error subscribing:', err)
        addToast('Failed to subscribe to plan', 'error')
      }
      return
    }
    
    // Paid plans require payment method
    if (!paymentMethod) {
      addToast('Please add a payment method first', 'warning')
      setShowAddPaymentModal(true)
      return
    }
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const confirmUpgrade = async () => {
    try {
      await subscriptionService.upgrade(selectedPlan.id)
      addToast(`Successfully upgraded to ${selectedPlan.name} plan!`, 'success')
      setShowUpgradeModal(false)
      fetchSubscriptionData()
    } catch (err) {
      console.error('Error upgrading:', err)
      addToast('Failed to upgrade plan', 'error')
    }
  }

  const handleAddPaymentMethod = (e) => {
    e.preventDefault()
    
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.nameOnCard) {
      addToast('Please fill in all fields', 'error')
      return
    }

    const newPaymentMethod = {
      id: Date.now(),
      type: paymentForm.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: paymentForm.cardNumber.slice(-4),
      expiry: paymentForm.expiryDate,
      isDefault: true,
    }

    setPaymentMethod(newPaymentMethod)
    setShowAddPaymentModal(false)
    setPaymentForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    })
    addToast('Payment method added successfully!', 'success')
  }

  const handleRemovePaymentMethod = () => {
    setPaymentMethod(null)
    addToast('Payment method removed', 'success')
  }

  const formatPrice = (cents) => {
    // Convert from USD cents to Naira (rate: 1500 NGN per 1 USD)
    const nairaAmount = (cents )
    return `₦${nairaAmount.toLocaleString('en-NG')}`
  }

  const getPlanFeatures = (plan) => {
    const features = []
    if (plan.max_applications > 0) {
      features.push(`${plan.max_applications} applications/month`)
    } else {
      features.push('Unlimited applications')
    }
    if (plan.max_ai_pastes > 0) {
      features.push(`${plan.max_ai_pastes} AI extractions/month`)
    } else {
      features.push('Unlimited AI extractions')
    }
    if (plan.max_profiles > 1) {
      features.push(`${plan.max_profiles} profiles`)
    } else if (plan.max_profiles === 0) {
      features.push('Unlimited profiles')
    }
    if (plan.description) {
      plan.description.split('\n').forEach(line => {
        if (line.trim()) features.push(line.trim())
      })
    }
    return features
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  const currentPlanName = currentSubscription?.plan?.name || (currentSubscription?.active ? 'Free Plan' : 'No Plan')
  const isActive = currentSubscription?.active

  // Check if current plan (handles both 'Free' and 'Free Plan')
  const isCurrentPlan = (planName) => {
    if (!currentPlanName) return false
    return currentPlanName.toLowerCase() === planName.toLowerCase() ||
           (currentPlanName.toLowerCase().includes('free') && planName.toLowerCase().includes('free'))
  }

  // Get plan tier level for sequential upgrades (Free=1, Basic=2, Pro=3)
  const getPlanTier = (planName) => {
    const name = planName.toLowerCase()
    if (name.includes('free')) return 1
    if (name.includes('basic')) return 2
    if (name.includes('pro')) return 3
    return 0
  }

  // Check if user can upgrade to a specific plan
  const canUpgrade = (plan) => {
    // If no current plan (not subscribed), can subscribe to any plan
    if (!currentPlanName || currentPlanName === 'No Plan') return true
    
    // Get current plan tier
    const currentTier = getPlanTier(currentPlanName)
    const targetTier = getPlanTier(plan.name)
    
    // Can only upgrade to higher tier (sequential)
    return targetTier > currentTier
  }

  // Get button text based on subscription state
  const getButtonText = (plan) => {
    // If no current plan or no active subscription, show "Subscribe"
    if (!currentPlanName || currentPlanName === 'No Plan' || !isActive) {
      return 'Subscribe'
    }
    
    // If already on this plan
    if (isCurrentPlan(plan.name)) {
      return 'Current Plan'
    }
    
    // Otherwise show "Upgrade"
    return 'Upgrade'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="text-gray-600 mt-1">
            Manage your subscription and billing
          </p>
        </div>

        {/* Current Plan Banner */}
        <div className={`rounded-2xl p-6 ${isActive ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' : 'bg-gray-100 border border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">Current Plan</p>
              <h2 className="text-2xl font-bold">{currentPlanName}</h2>
              {isActive && (
                <p className="text-sm opacity-80">Your subscription is active</p>
              )}
              {!isActive && (
                <p className="text-sm">Upgrade to unlock more features</p>
              )}
            </div>
            {!isActive && (
              <Link to="/subscription">
                <Button className="bg-white text-primary-600 hover:bg-gray-100">
                  Upgrade Now
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="py-12 bg-white/50 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose Your Plan</h3>
            {plans.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <InboxIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No subscription plans available</p>
                <p className="text-gray-500 text-sm">Please contact the administrator to set up subscription plans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {(plans || []).map((plan, index) => {
                const isCurrentPlanFlag = isCurrentPlan(plan.name)
                return (
                  <div 
                    key={plan.id} 
                    className={`relative glass-card p-8 card-hover ${
                      index === 1 ? 'ring-2 ring-primary-500 scale-105 z-10' : ''
                    }`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="badge-gradient px-4 py-1">Most Popular</span>
                      </div>
                    )}
                    {isCurrentPlanFlag && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="badge-gradient px-4 py-1">Current</span>
                      </div>
                    )}
                   
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-900">{plan.name}</h4>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(plan.price_cents)}
                        </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {getPlanFeatures(plan).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlanFlag ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full btn-gradient"
                      onClick={() => handleUpgrade(plan)}
                      disabled={!canUpgrade(plan)}
                    >
                      {getButtonText(plan)}
                    </Button>
                  )}
                </div>
              )
            })}
            </div>
          )}
        </div>
      </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>
          <Card>
            {paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{paymentMethod.type}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">•••• {paymentMethod.last4}</p>
                    <p className="text-sm text-gray-500">Expires {paymentMethod.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleRemovePaymentMethod}>
                  Remove
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No payment method added</p>
                <Button onClick={() => setShowAddPaymentModal(true)}>
                  Add Payment Method
                </Button>
              </div>
            )}
          </Card>
        </div>

      {/* Add Payment Modal */}
      <Modal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        title="Add Payment Method"
      >
        <form onSubmit={handleAddPaymentMethod} className="space-y-4">
          <Input
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            value={paymentForm.cardNumber}
            onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={paymentForm.expiryDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={paymentForm.cvv}
              onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
            />
          </div>
          <Input
            label="Name on Card"
            placeholder="John Doe"
            value={paymentForm.nameOnCard}
            onChange={(e) => setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })}
          />
          <div className="flex gap-2 pt-4">
            <Button type="submit">Add Card</Button>
            <Button variant="secondary" onClick={() => setShowAddPaymentModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Confirm Upgrade"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to upgrade to the <strong>{selectedPlan?.name}</strong> plan?
          </p>
          <p className="text-gray-600">
            You will be charged <strong>{selectedPlan && formatPrice(selectedPlan.price_cents)}</strong> per month.
          </p>
          <div className="flex gap-2 pt-4">
            <Button onClick={confirmUpgrade}>Confirm Upgrade</Button>
            <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </DashboardLayout>
  )
}
