import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { useToast } from '../components/common/Toast'

export default function Subscription() {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('Free') // Track current plan
  const [paymentMethod, setPaymentMethod] = useState(null) // Will hold payment method info when added
  const { addToast } = useToast()
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  })

  const plans = [
    {
      name: 'Free',
      price: '$0',
      apps: '20 apps/month',
      features: ['Job tracking', 'Basic statistics', 'Email notifications'],
    },
    {
      name: 'Basic',
      price: '$8',
      apps: '100 apps/month',
      features: ['Everything in Free', 'AI job extraction', 'Interview prep guide'],
    },
    {
      name: 'Pro',
      price: '$25',
      apps: 'Unlimited',
      features: ['Everything in Basic', 'Priority support', 'Advanced analytics', 'Skill recommendations'],
    },
  ]

  // Mock payment methods
  const savedPaymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  ]

  const handleAddPaymentMethod = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.nameOnCard) {
      addToast('Please fill in all fields', 'error')
      return
    }

    // Mock - in real app, this would call payment API
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

  const handleRemovePaymentMethod = (id) => {
    setPaymentMethod(null)
    addToast('Payment method removed', 'success')
  }

  const handleUpgrade = (plan) => {
    if (!paymentMethod) {
      addToast('Please add a payment method first', 'warning')
      setShowAddPaymentModal(true)
      return
    }
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const confirmUpgrade = () => {
    // Mock upgrade - in real app would call API
    setCurrentPlan(selectedPlan.name)
    setShowUpgradeModal(false)
    addToast(`Successfully upgraded to ${selectedPlan.name} plan!`, 'success')
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your plan and billing</p>
        </div>

        {/* Current Plan */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Current Plan: {currentPlan}</h2>
            <Badge status="active">Active</Badge>
          </div>
          <p className="text-gray-600 mb-4">Your free trial expires on March 15, 2024</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <strong>20 of 20</strong> applications used this month
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Upgrade to get more applications and premium features</p>
          <Button onClick={() => handleUpgrade(plans[1])}>Upgrade Now</Button>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.name === currentPlan ? 'border-2 border-blue-600' : ''}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  {plan.name === currentPlan && <Badge status="active">Current</Badge>}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</p>
                <p className="text-sm text-gray-600 mb-4">{plan.apps}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-600">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.current ? 'secondary' : 'primary'}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-900">Feb 1, 2024</td>
                  <td className="px-4 py-3 text-sm text-gray-900">$0.00</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="subtle">Trial</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment Method */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          
          {paymentMethod ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                    {paymentMethod.type}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">•••• •••• •••• {paymentMethod.last4}</p>
                    <p className="text-sm text-gray-600">Expires {paymentMethod.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {paymentMethod.isDefault && (
                    <Badge status="active">Default</Badge>
                  )}
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(paymentMethod.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setShowAddPaymentModal(true)}>
                Add Another Card
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">No payment method on file. Add one to upgrade your plan.</p>
              <Button onClick={() => setShowAddPaymentModal(true)}>Add Payment Method</Button>
            </div>
          )}
        </Card>

        {/* Add Payment Method Modal */}
        <Modal
          isOpen={showAddPaymentModal}
          onClose={() => setShowAddPaymentModal(false)}
          title="Add Payment Method"
          size="md"
        >
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <Input
                type="text"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: formatExpiryDate(e.target.value) })}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <Input
                  type="text"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <Input
                type="text"
                value={paymentForm.nameOnCard}
                onChange={(e) => setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">
                🔒 Your payment information is secure and encrypted. We never store your full card details.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Card
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Upgrade Confirmation Modal */}
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title="Confirm Upgrade"
          size="md"
        >
          {selectedPlan && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">You are about to upgrade to</p>
                <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name} Plan</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{selectedPlan.price}<span className="text-sm text-gray-500">/month</span></p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Payment will be charged to:</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">•••• {paymentMethod?.last4}</span>
                  <span className="text-gray-500">({paymentMethod?.type})</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={confirmUpgrade} className="flex-1">
                  Confirm Upgrade
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
