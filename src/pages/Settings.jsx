import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import { useToast } from '../components/common/Toast'
import { ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import authService from '../services/auth'
import usersService from '../services/users'
import { useAuth } from '../hooks/useAuth'

export default function Settings() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user } = useAuth()

  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: user?.email_notifications ?? true,
    push: user?.push_notifications ?? true,
    weeklySummary: user?.weekly_summary ?? true,
  })

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    dataCollection: user?.allow_data_collection ?? true,
  })

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)

  // Delete account modal state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Two-Factor Authentication state
  const [twoFactorPassword, setTwoFactorPassword] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  const [saveStatus, setSaveStatus] = useState(null) // 'saving', 'success', 'error'

  // Fetch initial settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setNotifications({
          email: userData.email_notifications ?? true,
          push: userData.push_notifications ?? true,
          weeklySummary: userData.weekly_summary ?? true,
        })
        setPrivacy({
          publicProfile: false, // Not implemented yet - requires PublicProfile model
          dataCollection: userData.allow_data_collection ?? true,
        })
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  // Mock login history data
  const loginHistory = [
    { id: 1, device: 'Chrome on Windows', location: 'San Francisco, CA', date: '2024-01-15 09:30 AM', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'San Francisco, CA', date: '2024-01-14 02:15 PM', current: false },
    { id: 3, device: 'Firefox on MacOS', location: 'Los Angeles, CA', date: '2024-01-12 11:00 AM', current: false },
  ]

  // Mock sessions data
  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'San Francisco, CA', lastActive: 'Now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Mobile App', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]

  // Handlers for notification toggles
  const handleNotificationChange = async (type) => {
    const newValue = !notifications[type]
    setNotifications((prev) => ({
      ...prev,
      [type]: newValue,
    }))
    
    try {
      await authService.updateProfile({
        [type === 'weeklySummary' ? 'weekly_summary' : type + '_notifications']: newValue
      })
      addToast('Settings saved!', 'success')
    } catch (error) {
      // Revert on error
      setNotifications((prev) => ({
        ...prev,
        [type]: !newValue,
      }))
      addToast('Failed to save settings', 'error')
    }
  }

  // Handlers for privacy toggles
  const handlePrivacyChange = async (type) => {
    const newValue = !privacy[type]
    setPrivacy((prev) => ({
      ...prev,
      [type]: newValue,
    }))
    
    try {
      if (type === 'publicProfile') {
        // Handle public profile separately - it needs a PublicProfile object
        await usersService.updatePublicProfile({ is_public: newValue })
      } else {
        await authService.updateProfile({
          allow_data_collection: newValue
        })
      }
      addToast('Settings saved!', 'success')
    } catch (error) {
      // Revert on error
      setPrivacy((prev) => ({
        ...prev,
        [type]: !newValue,
      }))
      addToast('Failed to save settings', 'error')
    }
  }

  // Save all settings
  const handleSave = async () => {
    setSaveStatus('saving')
    
    // Simulate API call
    setTimeout(() => {
      // Here you would typically make an API call to save settings
      console.log('Saving settings:', { notifications, privacy })
      setSaveStatus('success')
      addToast('Settings saved successfully!', 'success')
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000)
    }, 1000)
  }

  // Cancel changes
  const handleCancel = () => {
    // Reset to defaults
    setNotifications({
      email: true,
      push: true,
      weeklySummary: true,
    })
    setPrivacy({
      publicProfile: false,
      dataCollection: true,
    })
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  // Handle 2FA toggle
  const handleTwoFactorToggle = async (enable) => {
    if (!twoFactorPassword) {
      addToast('Please enter your password to enable/disable 2FA', 'error')
      return
    }
    
    setTwoFactorLoading(true)
    try {
      await authService.manageTwoFactor(enable, twoFactorPassword)
      addToast(enable ? 'Two-factor authentication enabled!' : 'Two-factor authentication disabled!', 'success')
      setShowTwoFactorModal(false)
      setTwoFactorPassword('')
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update 2FA settings'
      addToast(message, 'error')
    } finally {
      setTwoFactorLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('Passwords do not match!', 'error')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      addToast('Password must be at least 8 characters!', 'error')
      return
    }

    // Simulate API call
    console.log('Changing password:', passwordForm.currentPassword)
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    addToast('Password changed successfully!', 'success')
  }

  // Handle terminate session
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)

  const handleTerminateSession = (sessionId) => {
    setSessionToDelete(sessionId)
    setShowDeleteSessionModal(true)
  }

  const confirmTerminateSession = () => {
    if (sessionToDelete) {
      console.log('Terminating session:', sessionToDelete)
      addToast('Session terminated successfully!', 'success')
    }
    setShowDeleteSessionModal(false)
    setSessionToDelete(null)
  }

  // Handle delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    
    if (!deletePassword) {
      addToast('Please enter your password to confirm', 'error')
      return
    }

    setDeleteLoading(true)
    try {
      await authService.deleteAccount(deletePassword)
      addToast('Account deleted successfully', 'success')
      
      // Redirect to login (auth cookies are cleared server-side)
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to delete account. Please check your password.'
      addToast(message, 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Notifications */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your applications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Weekly Summary</p>
                <p className="text-sm text-gray-600">Get a weekly summary of your job search progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.weeklySummary}
                  onChange={() => handleNotificationChange('weeklySummary')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Public Profile</p>
                <p className="text-sm text-gray-600">Allow others to view your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.publicProfile}
                  onChange={() => handlePrivacyChange('publicProfile')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Data Collection</p>
                <p className="text-sm text-gray-600">Allow us to collect analytics data for improvements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.dataCollection}
                  onChange={() => handlePrivacyChange('dataCollection')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-2">Change Password</p>
              <Button onClick={() => setShowPasswordModal(true)}>Update Password</Button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">
                      {user?.is_2fa_enabled ? 'Enabled - You will receive a code via email on login' : 'Disabled - Add an extra layer of security to your account'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={user?.is_2fa_enabled || false}
                    onChange={() => setShowTwoFactorModal(true)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium text-gray-900 mb-2">Login History</p>
              <Button variant="secondary" onClick={() => setShowLoginHistoryModal(true)}>View Login History</Button>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium text-gray-900 mb-2">Active Sessions</p>
              <Button variant="secondary" onClick={() => setShowSessionsModal(true)}>View Sessions</Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save All Settings'}
          </Button>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        </div>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-semibold text-red-900">Danger Zone</h2>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h3 className="font-medium text-gray-900 mb-2">Permanently delete your account</h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. All of your data will be permanently deleted, including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
              <li>Your profile and personal information</li>
              <li>All job applications you've submitted</li>
              <li>All saved jobs</li>
              <li>All notifications</li>
              <li>All subscription data</li>
            </ul>
            <p className="text-sm font-medium text-red-600 mb-4">
              Warning: This will permanently remove your account and you will not be able to recover any of your data.
            </p>
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteAccountModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Update Password
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Login History Modal */}
        <Modal
          isOpen={showLoginHistoryModal}
          onClose={() => setShowLoginHistoryModal(false)}
          title="Login History"
          size="lg"
        >
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{login.device}</p>
                  <p className="text-sm text-gray-600">{login.location}</p>
                  <p className="text-xs text-gray-500">{login.date}</p>
                </div>
                {login.current && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={() => setShowLoginHistoryModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </Modal>

        {/* Sessions Modal */}
        <Modal
          isOpen={showSessionsModal}
          onClose={() => setShowSessionsModal(false)}
          title="Active Sessions"
          size="lg"
        >
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{session.device}</p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                  <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                </div>
                <div className="flex items-center gap-2">
                  {session.current && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Current
                    </span>
                  )}
                  {!session.current && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={() => setShowSessionsModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </Modal>

        {/* Delete Session Confirmation Modal */}
        <Modal
          isOpen={showDeleteSessionModal}
          onClose={() => {
            setShowDeleteSessionModal(false)
            setSessionToDelete(null)
          }}
          title="Terminate Session"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to terminate this session? The user will be logged out from this device.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteSessionModal(false)
                  setSessionToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmTerminateSession}>
                Terminate
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Account Confirmation Modal */}
        <Modal
          isOpen={showDeleteAccountModal}
          onClose={() => {
            setShowDeleteAccountModal(false)
            setDeletePassword('')
          }}
          title="Delete Account"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Warning: This action cannot be undone!
              </div>
              <p className="text-sm text-red-700">
                You are about to permanently delete your account and all associated data. This includes:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>Your profile and personal information</li>
                <li>All job applications</li>
                <li>All saved jobs</li>
                <li>All notifications</li>
                <li>All subscription data</li>
              </ul>
            </div>
            
            <form onSubmit={handleDeleteAccount}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm deletion
              </label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Type your password and click "Delete Account" to confirm. You will be logged out immediately.
              </p>
              
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteAccountModal(false)
                    setDeletePassword('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="danger" 
                  disabled={deleteLoading}
                  className="flex-1"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Two-Factor Authentication Modal */}
        <Modal
          isOpen={showTwoFactorModal}
          onClose={() => {
            setShowTwoFactorModal(false)
            setTwoFactorPassword('')
          }}
          title="Two-Factor Authentication"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {user?.is_2fa_enabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.is_2fa_enabled 
                    ? 'You will no longer receive verification codes via email when logging in.'
                    : 'You will receive a 6-digit code via email when logging in for extra security.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm
              </label>
              <Input
                type="password"
                value={twoFactorPassword}
                onChange={(e) => setTwoFactorPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowTwoFactorModal(false)
                  setTwoFactorPassword('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant={user?.is_2fa_enabled ? 'danger' : 'primary'}
                onClick={() => handleTwoFactorToggle(!user?.is_2fa_enabled)}
                disabled={twoFactorLoading}
                className="flex-1"
              >
                {twoFactorLoading ? 'Processing...' : user?.is_2fa_enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
