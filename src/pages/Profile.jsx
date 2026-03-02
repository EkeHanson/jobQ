import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import { useAuth } from '../hooks/useAuth'
import { useProfiles } from '../hooks/useProfiles'
import { useToast } from '../components/common/Toast'

export default function Profile() {
  const { user } = useAuth()
  const { profiles, loading, error, create, remove } = useProfiles()
  const [showModal, setShowModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState(null)
  const { addToast } = useToast()
  // Legacy form data (kept for backward compatibility)
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    bio: '',
  })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  // Role entries state - each entry has role title and resume file
  const [roleEntries, setRoleEntries] = useState([
    { id: 1, roleTitle: '', resume: null }
  ])

  const handleAddRoleEntry = () => {
    setRoleEntries([...roleEntries, { id: Date.now(), roleTitle: '', resume: null }])
  }

  const handleRemoveRoleEntry = (id) => {
    if (roleEntries.length > 1) {
      setRoleEntries(roleEntries.filter(entry => entry.id !== id))
    }
  }

  const handleRoleTitleChange = (id, value) => {
    setRoleEntries(roleEntries.map(entry => 
      entry.id === id ? { ...entry, roleTitle: value } : entry
    ))
  }

  const handleResumeChange = (id, file) => {
    setRoleEntries(roleEntries.map(entry => 
      entry.id === id ? { ...entry, resume: file } : entry
    ))
  }

  const handleCreateProfiles = async () => {
    // Validate - check if all role entries have role title
    const validEntries = roleEntries.filter(entry => entry.roleTitle.trim() !== '')
    
    if (validEntries.length === 0) {
      addToast('Please add at least one role title', 'error')
      return
    }

    try {
      // Create a profile for each entry
      for (const entry of validEntries) {
        const profileData = {
          title: entry.roleTitle,
          role: entry.roleTitle, // Using role title as the role
          bio: '',
          resume: entry.resume
        }
        await create(profileData)
      }
      
      setRoleEntries([{ id: 1, roleTitle: '', resume: null }])
      setShowModal(false)
      addToast(`${validEntries.length} profile(s) created successfully!`, 'success')
    } catch (err) {
      console.error('Error creating profiles:', err)
      addToast('Failed to create profiles', 'error')
    }
  }

  const handleDeleteProfile = async (id) => {
    setProfileToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDeleteProfile = async () => {
    if (profileToDelete) {
      try {
        await remove(profileToDelete)
        addToast('Profile deleted successfully!', 'success')
      } catch (err) {
        console.error('Error deleting profile:', err)
        addToast('Failed to delete profile', 'error')
      }
    }
    setShowDeleteModal(false)
    setProfileToDelete(null)
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
    addToast('Skills saved successfully!', 'success')
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
          setRoleEntries([{ id: 1, roleTitle: '', resume: null }])
        }}
        title="Create Developer Profile"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Add your target roles. Each role can have its own resume uploaded.
          </p>

          {roleEntries.map((entry, index) => (
            <div key={entry.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Role {index + 1}</h4>
                {roleEntries.length > 1 && (
                  <button
                    onClick={() => handleRemoveRoleEntry(entry.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <Input
                label="Role Title"
                placeholder="e.g., Senior Backend Developer, Frontend Engineer"
                value={entry.roleTitle}
                onChange={(e) => handleRoleTitleChange(entry.id, e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleResumeChange(entry.id, e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {entry.resume && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {entry.resume.name}
                  </p>
                )}
              </div>
            </div>
          ))}

          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleAddRoleEntry}
            className="w-full"
          >
            + Add Another Role
          </Button>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                setRoleEntries([{ id: 1, roleTitle: '', resume: null }])
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProfiles} disabled={loading}>
              {loading ? 'Creating...' : 'Create Profiles'}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setProfileToDelete(null)
        }}
        title="Delete Profile"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this profile? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setProfileToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteProfile}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
