import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import { CheckIcon, LinkIcon, GlobeAltIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { useProfiles } from '../hooks/useProfiles'
import { useToast } from '../components/common/Toast'
import authService from '../services/auth'
import usersService from '../services/users'
import { setUser } from '../store/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { profiles, loading, error, create, remove, addSkill, removeSkill, getSkills } = useProfiles()
  const [showModal, setShowModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState(null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const { addToast } = useToast()
  
  // Personal information form state
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: ''
  })
  // Legacy form data (kept for backward compatibility)
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    bio: '',
  })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  // Public profile state
  const [publicProfile, setPublicProfile] = useState(null)
  const [publicFormData, setPublicFormData] = useState({
    public_slug: '',
    is_public: false,
    display_name: '',
    show_applications_count: true,
    show_interviews_count: true,
    show_offers_count: true,
    show_success_rate: true,
  })
  const [isSavingPublic, setIsSavingPublic] = useState(false)
  const [isLoadingPublic, setIsLoadingPublic] = useState(true)

  // Fetch public profile on mount
  useEffect(() => {
    fetchPublicProfile()
  }, [])

  const fetchPublicProfile = async () => {
    try {
      const data = await usersService.getMyPublicProfile()
      if (data) {
        setPublicProfile(data)
        setPublicFormData({
          public_slug: data.public_slug || '',
          is_public: data.is_public || false,
          display_name: data.display_name || '',
          show_applications_count: data.show_applications_count ?? true,
          show_interviews_count: data.show_interviews_count ?? true,
          show_offers_count: data.show_offers_count ?? true,
          show_success_rate: data.show_success_rate ?? true,
        })
      }
    } catch (error) {
      console.error('Failed to fetch public profile:', error)
    } finally {
      setIsLoadingPublic(false)
    }
  }

  const handleSavePublicProfile = async () => {
    setIsSavingPublic(true)
    try {
      await usersService.updatePublicProfile(publicFormData)
      addToast('Public profile updated!', 'success')
      fetchPublicProfile()
    } catch (error) {
      addToast('Failed to update public profile', 'error')
    } finally {
      setIsSavingPublic(false)
    }
  }

  const copyShareLink = () => {
    const link = `${window.location.origin}/public/${publicFormData.public_slug}`
    navigator.clipboard.writeText(link)
    addToast('Link copied to clipboard!', 'success')
  }

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

  const handleAddSkill = async () => {
    if (skillInput.trim()) {
      const skillName = skillInput.trim()
      
      // Check if skill already exists in local list
      const skillExists = skills.some(s => s.name === skillName || s === skillName)
      if (skillExists) {
        addToast('Skill already exists', 'error')
        setSkillInput('')
        return
      }

      // If profile exists, save to backend
      if (profiles.length > 0) {
        try {
          const profileId = profiles[0].id
          const newSkill = await addSkill(profileId, skillName)
          setSkills([...skills, newSkill])
          addToast('Skill added successfully!', 'success')
        } catch (err) {
          console.error('Error adding skill to backend:', err)
          // Fall back to localStorage
          const newSkillsList = [...skills.map(s => s.name || s), skillName]
          setSkills(newSkillsList)
          localStorage.setItem('userSkills', JSON.stringify(newSkillsList))
          addToast('Skill added (offline mode)', 'success')
        }
      } else {
        // No profile exists, save to localStorage
        const newSkillsList = [...skills.map(s => s.name || s), skillName]
        setSkills(newSkillsList)
        localStorage.setItem('userSkills', JSON.stringify(newSkillsList))
        addToast('Skill added! Create a profile to save skills to your account.', 'success')
      }
      
      setSkillInput('')
    }
  }

  const handleRemoveSkill = async (skill) => {
    const skillId = skill.id
    const skillName = skill.name || skill
    
    // If profile exists, delete from backend
    if (profiles.length > 0 && skillId) {
      try {
        const profileId = profiles[0].id
        await removeSkill(profileId, skillId)
        setSkills(skills.filter(s => s.id !== skillId))
        addToast('Skill removed!', 'success')
      } catch (err) {
        console.error('Error removing skill from backend:', err)
        // Fall back to localStorage
        setSkills(skills.filter(s => (s.name || s) !== skillName))
        const newSkillsList = skills.map(s => s.name || s).filter(s => s !== skillName)
        localStorage.setItem('userSkills', JSON.stringify(newSkillsList))
        addToast('Skill removed!', 'success')
      }
    } else {
      // No profile or no skill ID, remove from local list
      setSkills(skills.filter(s => (s.name || s) !== skillName))
      const newSkillsList = skills.map(s => s.name || s).filter(s => s !== skillName)
      localStorage.setItem('userSkills', JSON.stringify(newSkillsList))
      addToast('Skill removed!', 'success')
    }
  }

  const handleSaveSkills = () => {
    // Skills will be saved to localStorage for now
    localStorage.setItem('userSkills', JSON.stringify(skills))
    setShowSkillsModal(false)
    addToast('Skills saved successfully!', 'success')
  }

  // Load user data into form when user data is available
  // Load skills from backend
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        location: user.location || ''
      })
      
      // Load skills from backend
      const loadSkills = async () => {
        if (profiles.length > 0) {
          try {
            const profileId = profiles[0].id
            const skillsData = await getSkills(profileId)
            setSkills(skillsData)
          } catch (err) {
            console.error('Error loading skills:', err)
            // Fall back to localStorage
            const savedSkills = localStorage.getItem('userSkills')
            if (savedSkills) {
              setSkills(JSON.parse(savedSkills))
            }
          }
        } else {
          // If no profile exists, fall back to localStorage
          const savedSkills = localStorage.getItem('userSkills')
          if (savedSkills) {
            setSkills(JSON.parse(savedSkills))
          }
        }
      }
      loadSkills()
    }
  }, [user, profiles, getSkills])

  // Handle personal info input change
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  // Save personal information
  const handleSavePersonalInfo = async () => {
    setIsUpdatingProfile(true)
    try {
      // Update profile on server
      await authService.updateProfile(personalInfo)
      // Fetch the latest user data to ensure Redux store is updated
      const response = await authService.getCurrentUser()
      dispatch(setUser(response))
      addToast('Profile updated successfully!', 'success')
    } catch (err) {
      console.error('Error updating profile:', err)
      addToast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Reset personal information to original values
  const handleCancelPersonalInfo = () => {
    if (user) {
      setPersonalInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        location: user.location || ''
      })
    }
  }

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
            <Input 
              label="First Name" 
              name="first_name"
              value={personalInfo.first_name} 
              onChange={handlePersonalInfoChange}
            />
            <Input 
              label="Last Name" 
              name="last_name"
              value={personalInfo.last_name} 
              onChange={handlePersonalInfoChange}
            />
            <Input label="Email" type="email" defaultValue={user?.email} disabled />
            <Input 
              label="Phone Number" 
              name="phone"
              value={personalInfo.phone} 
              onChange={handlePersonalInfoChange}
            />
            <Input 
              label="Location" 
              name="location"
              value={personalInfo.location} 
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleSavePersonalInfo} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="secondary" onClick={handleCancelPersonalInfo}>Cancel</Button>
          </div>
        </Card>

        {/* Developer Profiles */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Developer Profiles</h2>
          <p className="text-gray-600 mb-4">
            Create separate profiles for different roles (Backend, Frontend, DevOps, etc.)
          </p>

          {/* Existing Profiles with Skills */}
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
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // Set the profile as active for editing
                            setSelectedProfile(profile.id)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {profile.bio && <p className="text-gray-600 text-sm mt-2">{profile.bio}</p>}
                    
                    {/* Skills for this profile */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill) => (
                            <span 
                              key={skill.id || skill}
                              className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full"
                            >
                              {skill.name || skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No skills added</span>
                        )}
                      </div>
                    </div>
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
                  <Badge key={skill.id || skill} variant="primary">
                    {skill.name || skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setShowSkillsModal(true)}>Manage Skills</Button>
        </Card>

        {/* Delete Account */}
        {/* <Card className="border-red-200 bg-red-50">
          <h2 className="text-2xl font-semibold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-red-800 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="danger">Delete Account</Button>
        </Card> */}
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
                  <p className="flex items-center gap-2 text-sm text-green-600 mt-1">
                    <CheckIcon className="w-4 h-4" />
                    {entry.resume.name}
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
                    key={skill.id || skill}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{skill.name || skill}</span>
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

      {/* Public Profile Section */}
      {!isLoadingPublic && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Public Profile</h2>
          <p className="text-gray-600 mb-6">
            Share your job search progress with the world
          </p>
          
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                {publicFormData.display_name ? publicFormData.display_name[0].toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {publicFormData.display_name || 'Your Name'}
                </h3>
                <p className="text-gray-500">Job Seeker</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {publicFormData.show_applications_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {publicProfile?.stats?.total_applications || 0}
                  </p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
              )}
              {publicFormData.show_interviews_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {publicProfile?.stats?.interviews || 0}
                  </p>
                  <p className="text-sm text-gray-600">Interviews</p>
                </div>
              )}
              {publicFormData.show_offers_count && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {publicProfile?.stats?.offers || 0}
                  </p>
                  <p className="text-sm text-gray-600">Offers</p>
                </div>
              )}
              {publicFormData.show_success_rate && (
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {publicProfile?.stats?.success_rate || 0}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              )}
            </div>
          </div>

          {publicFormData.is_public && publicFormData.public_slug ? (
            <div className="mb-6 flex items-center gap-2">
              <Button onClick={copyShareLink} variant="secondary" size="sm">
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Share Link
              </Button>
              <span className="text-sm text-gray-500">
                {window.location.origin}/public/{publicFormData.public_slug}
              </span>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                Your profile is not visible. Enable public sharing below to share your progress.
              </p>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-6">
            <Input
              label="Display Name"
              value={publicFormData.display_name}
              onChange={(e) => setPublicFormData({ ...publicFormData, display_name: e.target.value })}
              placeholder="Your name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">jobq.app/public/</span>
                <input
                  type="text"
                  value={publicFormData.public_slug}
                  onChange={(e) => setPublicFormData({ ...publicFormData, public_slug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, '') })}
                  placeholder="your-name"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, hyphens, and underscores allowed
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {publicFormData.is_public ? (
                  <GlobeAltIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {publicFormData.is_public ? 'Profile is Public' : 'Profile is Private'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {publicFormData.is_public ? 'Anyone can view your job search progress' : 'Only you can see your profile'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPublicFormData({ ...publicFormData, is_public: !publicFormData.is_public })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  publicFormData.is_public ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    publicFormData.is_public ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

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
                      checked={publicFormData[item.key]}
                      onChange={(e) => setPublicFormData({ ...publicFormData, [item.key]: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSavePublicProfile} 
              disabled={isSavingPublic}
              className="w-full"
            >
              {isSavingPublic ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
