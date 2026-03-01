import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile and personal information</p>
        </div>

        {/* Profile Info */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" defaultValue={user?.first_name} />
            <Input label="Last Name" defaultValue={user?.last_name} />
            <Input label="Email" type="email" defaultValue={user?.email} disabled />
            <Input label="Phone Number" defaultValue={user?.phone} />
            <Input label="Location" defaultValue={user?.location} />
          </div>
          <div className="mt-6 flex gap-3">
            <Button>Save Changes</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </Card>

        {/* Developer Profiles */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Developer Profiles</h2>
          <p className="text-gray-600 mb-4">
            Create separate profiles for different roles (Backend, Frontend, DevOps, etc.)
          </p>
          <Button>Add New Profile</Button>
        </Card>

        {/* Skills */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills</h2>
          <p className="text-gray-600 mb-4">
            Manage your technical skills and expertise. Add or update skills to improve recommendations.
          </p>
          <Button>Manage Skills</Button>
        </Card>

        {/* Delete Account */}
        <Card className="border-red-200 bg-red-50">
          <h2 className="text-2xl font-semibold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-red-800 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="danger">Delete Account</Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
