import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import usersService from '../services/users'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { LinkIcon, GlobeAltIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function PublicProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    public_slug: '',
    is_public: false,
    display_name: '',
    show_applications_count: true,
    show_interviews_count: true,
    show_offers_count: true,
    show_success_rate: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await usersService.getPublicProfile()
      setProfile(response.data)
      setFormData({
        public_slug: response.data.public_slug || '',
        is_public: response.data.is_public || false,
        display_name: response.data.display_name || '',
        show_applications_count: response.data.show_applications_count ?? true,
        show_interviews_count: response.data.show_interviews_count ?? true,
        show_offers_count: response.data.show_offers_count ?? true,
        show_success_rate: response.data.show_success_rate ?? true,
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await usersService.updatePublicProfile(formData)
      toast.success('Public profile updated!')
      fetchProfile()
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyShareLink = () => {
    const link = `${window.location.origin}/public/${formData.public_slug}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Profile</h1>
          <p className="text-gray-600 mt-1">
            Share your job search progress with the world
          </p>
        </div>

        {/* Preview Card */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Public Page</h2>
          
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                {formData.display_name ? formData.display_name[0].toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formData.display_name || 'Your Name'}
                </h3>
                <p className="text-gray-500">Job Seeker</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.show_applications_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {profile?.stats?.total_applications || 0}
                  </p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
              )}
              {formData.show_interviews_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {profile?.stats?.interviews || 0}
                  </p>
                  <p className="text-sm text-gray-600">Interviews</p>
                </div>
              )}
              {formData.show_offers_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {profile?.stats?.offers || 0}
                  </p>
                  <p className="text-sm text-gray-600">Offers</p>
                </div>
              )}
              {formData.show_success_rate && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {profile?.stats?.success_rate || 0}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              )}
            </div>
          </div>

          {formData.is_public && formData.public_slug ? (
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={copyShareLink} variant="secondary" size="sm">
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Share Link
              </Button>
              <span className="text-sm text-gray-500">
                {window.location.origin}/public/{formData.public_slug}
              </span>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                Your profile is not visible. Enable public sharing below to share your progress.
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Profile Settings</h2>
          
          <div className="space-y-6">
            {/* Display Name */}
            <Input
              label="Display Name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Your name"
            />

            {/* Public Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">jobq.app/public/</span>
                <input
                  type="text"
                  value={formData.public_slug}
                  onChange={(e) => setFormData({ ...formData, public_slug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, '') })}
                  placeholder="your-name"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, hyphens, and underscores allowed
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {formData.is_public ? (
                  <GlobeAltIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {formData.is_public ? 'Profile is Public' : 'Profile is Private'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.is_public 
                      ? 'Anyone can view your job search progress' 
                      : 'Only you can see your profile'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  const newValue = !formData.is_public
                  setFormData({ ...formData, is_public: newValue })
                  setSaving(true)
                  try {
                    await usersService.updatePublicProfile({ ...formData, is_public: newValue })
                    toast.success(newValue ? 'Profile is now public!' : 'Profile is now private')
                    fetchProfile()
                  } catch (error) {
                    toast.error('Failed to update profile')
                    setFormData({ ...formData, is_public: !newValue })
                  } finally {
                    setSaving(false)
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_public ? 'bg-green-600' : 'bg-gray-200'
                }`}
                disabled={saving}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_public ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Stats to Show */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Statistics to Show
              </label>
              <div className="space-y-3">
                {[
                  { key: 'show_applications_count', label: 'Total Applications' },
                  { key: 'show_interviews_count', label: 'Interview Count' },
                  { key: 'show_offers_count', label: 'Offers Received' },
                  { key: 'show_success_rate', label: 'Success Rate' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[item.key]}
                      onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
