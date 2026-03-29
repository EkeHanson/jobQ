import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import adminService from '../services/admin'
import { useToast } from '../components/common/Toast'
import { useAuth } from '../hooks/useAuth'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    featured_image: '',
    external_link: '',
    is_published: false,
    is_featured: false,
  })
  const { addToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAdminBlogPosts({})
      setPosts(data || [])
    } catch (err) {
      console.error('Failed to load blog posts', err)
      addToast('Unable to load blog posts. Make sure you are logged in as an admin.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPostChange = (event) => {
    const { name, value, type, checked } = event.target
    setNewPost((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreatePost = async () => {
    try {
      setLoading(true)
      const payload = {
        ...newPost,
        author: user?.id,
      }
      await adminService.createBlogPost(payload)
      addToast('Blog post created successfully.', 'success')
      setNewPost({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        featured_image: '',
        external_link: '',
        is_published: false,
        is_featured: false,
      })
      setShowCreateForm(false)
      fetchPosts()
    } catch (err) {
      console.error('Failed to create blog post', err)
      addToast('Unable to create the blog post. Check required fields and permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPost = (post) => {
    setSelectedPost(post)
    setNewPost({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || '',
      featured_image: post.featured_image || '',
      external_link: post.external_link || '',
      is_published: post.is_published || false,
      is_featured: post.is_featured || false,
    })
    setShowEditForm(true)
  }

  const handleUpdatePost = async () => {
    try {
      setLoading(true)
      await adminService.updateBlogPost(selectedPost.slug, newPost)
      addToast('Blog post updated successfully.', 'success')
      setShowEditForm(false)
      setSelectedPost(null)
      fetchPosts()
    } catch (err) {
      console.error('Failed to update blog post', err)
      addToast('Unable to update the blog post. Check permissions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPost = (post) => {
    setSelectedPost(post)
    setShowViewModal(true)
  }

  const toggleFeatured = async (slug) => {
    try {
      await adminService.featureBlogPost(slug)
      addToast('Post featured status updated.', 'success')
      fetchPosts()
    } catch (err) {
      console.error('Failed to toggle featured', err)
      addToast('Unable to update featured status.', 'error')
    }
  }

  const deletePost = async (slug) => {
    if (!window.confirm('Delete this post permanently?')) return

    try {
      await adminService.deleteBlogPost(slug)
      addToast('Post deleted successfully.', 'success')
      fetchPosts()
    } catch (err) {
      console.error('Failed to delete post', err)
      addToast('Unable to delete the post.', 'error')
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your blog posts and featured content directly from the React admin console.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-200 w-full sm:w-auto"
          >
            {showCreateForm ? 'Hide create form' : '+ Create new post'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">✎</span>
              Create Blog Post
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  rows={6}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  name="featured_image"
                  value={newPost.featured_image}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">External Link</label>
                <input
                  name="external_link"
                  value={newPost.external_link}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_published"
                  type="checkbox"
                  name="is_published"
                  checked={newPost.is_published}
                  onChange={handleNewPostChange}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700">Publish immediately</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_featured"
                  type="checkbox"
                  name="is_featured"
                  checked={newPost.is_featured}
                  onChange={handleNewPostChange}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_featured" className="text-sm text-gray-700">Featured post</label>
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
              <Button type="button" onClick={handleCreatePost} className="w-full sm:w-auto">
                Save Post
              </Button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedPost && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">✎</span>
              Edit Blog Post: {selectedPost.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  rows={6}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  name="featured_image"
                  value={newPost.featured_image}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">External Link</label>
                <input
                  name="external_link"
                  value={newPost.external_link}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit_is_published"
                  type="checkbox"
                  name="is_published"
                  checked={newPost.is_published}
                  onChange={handleNewPostChange}
                  className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="edit_is_published" className="text-sm text-gray-700">Published</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="edit_is_featured"
                  type="checkbox"
                  name="is_featured"
                  checked={newPost.is_featured}
                  onChange={handleNewPostChange}
                  className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="edit_is_featured" className="text-sm text-gray-700">Featured post</label>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => {
                  setShowEditForm(false)
                  setSelectedPost(null)
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdatePost} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                Update Post
              </Button>
            </div>
          </div>
        )}

        {/* Posts Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Published</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Featured</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Author</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading blog posts…
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">No posts available.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.slug || post.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{post.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {post.is_published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.is_featured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                        {post.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{post.author || post.author_name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 shadow-sm"
                          onClick={() => handleViewPost(post)}
                        >
                          View
                        </Button>
                        <Button
                          type="button"
                          className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 shadow-sm"
                          onClick={() => handleEditPost(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          className={`px-3 py-1.5 text-xs shadow-sm ${post.is_featured ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                          onClick={() => toggleFeatured(post.slug)}
                        >
                          {post.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button
                          type="button"
                          className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 shadow-sm"
                          onClick={() => deletePost(post.slug)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Posts Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading blog posts…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No posts available.</div>
          ) : (
            posts.map((post) => (
              <div key={post.slug || post.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.category || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    {post.is_published && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                    {post.is_featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">By {post.author || post.author_name || 'Unknown'}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 flex-1"
                    onClick={() => handleViewPost(post)}
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 flex-1"
                    onClick={() => handleEditPost(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className={`px-3 py-1.5 text-xs flex-1 ${post.is_featured ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    onClick={() => toggleFeatured(post.slug)}
                  >
                    {post.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 flex-1"
                    onClick={() => deletePost(post.slug)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Post Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">📝</span>
              Blog Post Details
            </h2>
            {selectedPost && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.title}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slug</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.slug}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.category || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Author</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.author || selectedPost.author_name || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.is_published ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Featured</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.is_featured ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">View Count</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.view_count || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPost.published_date ? new Date(selectedPost.published_date).toLocaleString() : '—'}</p>
                  </div>
                </div>
                {selectedPost.excerpt && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Excerpt</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedPost.excerpt}</p>
                  </div>
                )}
                {selectedPost.content && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Content</p>
                    <p className="text-sm text-gray-900 mt-1 max-h-40 overflow-y-auto">{selectedPost.content}</p>
                  </div>
                )}
                {selectedPost.featured_image && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Featured Image</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedPost.featured_image}</p>
                  </div>
                )}
                {selectedPost.external_link && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">External Link</p>
                    <p className="text-sm text-primary-600 mt-1">{selectedPost.external_link}</p>
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
