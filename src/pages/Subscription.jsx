import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'

export default function Subscription() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      apps: '20 apps/month',
      features: ['Job tracking', 'Basic statistics', 'Email notifications'],
      current: true,
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
            <h2 className="text-2xl font-semibold text-gray-900">Current Plan: Free</h2>
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
          <Button>Upgrade Now</Button>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.current ? 'border-2 border-blue-600' : ''}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  {plan.current && <Badge status="active">Current</Badge>}
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
                <Button className="w-full" variant={plan.current ? 'secondary' : 'primary'}>
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
          <p className="text-gray-600 mb-4">No payment method on file. Add one to upgrade your plan.</p>
          <Button>Add Payment Method</Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
