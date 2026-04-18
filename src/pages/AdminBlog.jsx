import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import adminService from "../services/admin";
import { useToast } from "../components/common/Toast";
import { useAuth } from "../hooks/useAuth";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
    external_link: "",
    is_published: false,
    is_featured: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { addToast } = useToast();
  const { user } = useAuth();

  const BLOG_CATEGORIES = [
    { value: 'job_search', label: 'Job Search' },
    { value: 'career_advice', label: 'Career Advice' },
    { value: 'technology', label: 'Technology' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'personal_branding', label: 'Personal Branding' },
    { value: 'salary', label: 'Salary' },
    { value: 'remote_work', label: 'Remote Work' },
    { value: 'industry_news', label: 'Industry News' },
  ];

  const getCategoryLabel = (value) => {
    if (!value) return 'Uncategorized'
    const category = BLOG_CATEGORIES.find((item) => item.value === value)
    return category?.label || value
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminBlogPosts({});
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to load blog posts", err);
      addToast(
        "Unable to load blog posts. Make sure you are logged in as an admin.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewPostChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const payload = {
        ...newPost,
        author: user?.id,
      };
      await adminService.createBlogPost(payload);
      addToast("Blog post created successfully.", "success");
      setFieldErrors({});
      setNewPost({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        featured_image: "",
        external_link: "",
        is_published: false,
        is_featured: false,
      });
      setShowCreateForm(false);
      setFieldErrors({});
      fetchPosts();
    } catch (err) {
      console.error("Failed to create blog post", err);
      const errorData = err.response?.data;
      if (errorData && typeof errorData === "object") {
        setFieldErrors(errorData);
        const fieldErrorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
            return `${fieldLabel}: ${Array.isArray(messages) ? messages.join(", ") : messages}`;
          })
          .join(" | ");
        addToast(
          fieldErrorMessages || "Unable to create the blog post.",
          "error",
        );
      } else {
        addToast(
          "Unable to create the blog post. Check required fields and permissions.",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setNewPost({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      featured_image: post.featured_image || "",
      external_link: post.external_link || "",
      is_published: post.is_published || false,
      is_featured: post.is_featured || false,
    });
    setShowEditForm(true);
  };

  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      await adminService.updateBlogPost(selectedPost.slug, newPost);
      addToast("Blog post updated successfully.", "success");
      setShowEditForm(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to update blog post", err);
      const errorData = err.response?.data;
      if (errorData && typeof errorData === "object") {
        setFieldErrors(errorData);
        const fieldErrorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
            return `${fieldLabel}: ${Array.isArray(messages) ? messages.join(", ") : messages}`;
          })
          .join(" | ");
        addToast(
          fieldErrorMessages || "Unable to update the blog post.",
          "error",
        );
      } else {
        addToast("Unable to update the blog post. Check permissions.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const toggleFeatured = async (slug) => {
    try {
      await adminService.featureBlogPost(slug);
      addToast("Post featured status updated.", "success");
      fetchPosts();
    } catch (err) {
      console.error("Failed to toggle featured", err);
      addToast("Unable to update featured status.", "error");
    }
  };

  const promptDeletePost = (post) => {
    setPostToDelete(post);
    setShowDeletePostModal(true);
  };

  const deletePost = async () => {
    if (!postToDelete) return;

    try {
      setLoading(true);
      await adminService.deleteBlogPost(postToDelete.slug);
      addToast("Post deleted successfully.", "success");
      setShowDeletePostModal(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
      addToast("Unable to delete the post.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Back Navigation */}
        <div className="mb-4 sm:mb-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Admin</span>
          </a>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Blog Management
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl">
              Manage your blog posts and featured content directly from the
              React admin console.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-200 w-full sm:w-auto flex-shrink-0"
          >
            {showCreateForm ? (
              <span className="flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hide create form
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create new post
              </span>
            )}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8 shadow-lg mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
                ✎
              </span>
              Create Blog Post
            </h2>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.category[0]}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Excerpt{" "}
                  <span className="text-gray-500 text-xs">
                    (max 500 characters)
                  </span>
                </label>
                <textarea
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
                {fieldErrors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.excerpt[0]}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  rows={6}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  name="featured_image"
                  value={newPost.featured_image}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  External Link
                </label>
                <input
                  name="external_link"
                  value={newPost.external_link}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={newPost.is_published}
                    onChange={handleNewPostChange}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Publish immediately
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={newPost.is_featured}
                    onChange={handleNewPostChange}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Featured post</span>
                </label>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto px-6 py-2.5"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreatePost}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Save Post
              </Button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedPost && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 lg:p-8 shadow-lg mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">
                ✎
              </span>
              Edit Blog Post: {selectedPost.title}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.category[0]}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  rows={6}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  name="featured_image"
                  value={newPost.featured_image}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  External Link
                </label>
                <input
                  name="external_link"
                  value={newPost.external_link}
                  onChange={handleNewPostChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-2.5 sm:py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={newPost.is_published}
                    onChange={handleNewPostChange}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={newPost.is_featured}
                    onChange={handleNewPostChange}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Featured post</span>
                </label>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto px-6 py-2.5"
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedPost(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdatePost}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700"
              >
                Update Post
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Author
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading blog posts…</span>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    No posts available.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.slug || post.id}
                    className="hover:bg-purple-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getCategoryLabel(post.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.is_featured
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.is_featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {post.author || post.author_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewPost(post)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditPost(post)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(post.slug)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title={post.is_featured ? "Unfeature" : "Feature"}
                        >
                          <svg className="w-4 h-4" fill={post.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDeletePost(post)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View (visible on medium and smaller screens) */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading blog posts…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              No posts available.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.slug || post.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {getCategoryLabel(post.category)}
                    </p>
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
                <p className="text-sm text-gray-600 mb-4">
                  By {post.author || post.author_name || "Unknown"}
                </p>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleViewPost(post)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditPost(post)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(post.slug)}
                    className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title={post.is_featured ? "Unfeature" : "Feature"}
                  >
                    <svg className="w-4 h-4" fill={post.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => promptDeletePost(post)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Post Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                📝
              </span>
              <span className="break-words">Blog Post Details</span>
            </h2>
            {selectedPost && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Title
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 break-words">
                      {selectedPost.title}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Slug
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 break-words">
                      {selectedPost.slug}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {getCategoryLabel(selectedPost.category)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Author
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {selectedPost.author || selectedPost.author_name || "—"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Published
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {selectedPost.is_published ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Featured
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {selectedPost.is_featured ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      View Count
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {selectedPost.view_count || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Published Date
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {selectedPost.published_date
                        ? new Date(selectedPost.published_date).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>
                {selectedPost.excerpt && (
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Excerpt
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 break-words">
                      {selectedPost.excerpt}
                    </p>
                  </div>
                )}
                {selectedPost.content && (
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Content
                    </p>
                    <div className="text-sm sm:text-base text-gray-900 mt-1 max-h-48 overflow-y-auto break-words whitespace-pre-wrap">
                      {selectedPost.content}
                    </div>
                  </div>
                )}
                {selectedPost.featured_image && (
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Featured Image
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 break-words">
                      {selectedPost.featured_image}
                    </p>
                  </div>
                )}
                {selectedPost.external_link && (
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      External Link
                    </p>
                    <a
                      href={selectedPost.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-purple-600 hover:text-purple-800 mt-1 break-words inline-block"
                    >
                      {selectedPost.external_link}
                    </a>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 sm:mt-8 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showDeletePostModal}
          onClose={() => {
            setShowDeletePostModal(false)
            setPostToDelete(null)
          }}
          title="Confirm delete blog post"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will permanently delete the selected blog post and cannot be undone.
            </p>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-900">{postToDelete?.title || 'Untitled post'}</p>
              <p className="text-sm text-gray-700">Category: {postToDelete?.category || 'Uncategorized'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                onClick={() => {
                  setShowDeletePostModal(false)
                  setPostToDelete(null)
                }}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={deletePost}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 w-full sm:w-auto"
              >
                Delete post
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
