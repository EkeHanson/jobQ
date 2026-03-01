import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import { useAuth } from '../hooks/useAuth'
import { useProfiles } from '../hooks/useProfiles'

export default function Profile() {
  const { user } = useAuth()
  const { profiles, loading, error, create, remove } = useProfiles()
  const [showModal, setShowModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    bio: '',
  })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  const profileRoles = ['Backend', 'Frontend', 'DevOps', 'Full Stack', 'Mobile', 'Data Science', 'QA']

  const handleAddProfile = async () => {
    if (!formData.title || !formData.role) {
      alert('Please fill in all required fields')
      return
    }
    try {
      await create(formData)
      setFormData({ title: '', role: '', bio: '' })
      setShowModal(false)
    } catch (err) {
      console.error('Error creating profile:', err)
    }
  }

  const handleDeleteProfile = async (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await remove(id)
      } catch (err) {
        console.error('Error deleting profile:', err)
      }
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSaveSkills = () => {
    // Skills will be saved to localStorage for now
    localStorage.setItem('userSkills', JSON.stringify(skills))
    setShowSkillsModal(false)
    alert('Skills saved successfully!')
  }

  // Load skills from localStorage on mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('userSkills')
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

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

          {/* Existing Profiles */}
          {profiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{profile.title}</h4>
                        <Badge variant="primary">{profile.role}</Badge>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    {profile.bio && <p className="text-gray-600 text-sm mt-2">{profile.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setShowModal(true)}>
            {profiles.length > 0 ? 'Add Another Profile' : 'Add New Profile'}
          </Button>
        </Card>

        {/* Skills */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills</h2>
          <p className="text-gray-600 mb-4">
            Manage your technical skills and expertise. Add or update skills to improve recommendations.
          </p>

          {/* Display Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setShowSkillsModal(true)}>Manage Skills</Button>
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

      {/* Add Profile Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setFormData({ title: '', role: '', bio: '' })
        }}
        title="Create Developer Profile"
      >
        <div className="space-y-4">
          <Input
            label="Profile Title"
            placeholder="e.g., Senior Backend Developer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role</option>
              {profileRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
            <textarea
              placeholder="Tell us about this profile..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                setFormData({ title: '', role: '', bio: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProfile} disabled={loading}>
              {loading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </Modal>

      {/* Manage Skills Modal */}
      <Modal
        isOpen={showSkillsModal}
        onClose={() => {
          setShowSkillsModal(false)
          setSkillInput('')
        }}
        title="Manage Skills"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add a Skill</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Node.js, Python"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill()
                  }
                }}
              />
              <Button onClick={handleAddSkill}>Add</Button>
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSkillsModal(false)
                setSkillInput('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSkills}>Save Skills</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
