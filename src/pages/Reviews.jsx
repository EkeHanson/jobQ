import { useEffect, useState } from 'react'
import { useToast } from '../components/common/Toast'
import reviewsService from '../services/reviews'
import { useAuth } from '../hooks/useAuth'

const RATING_OPTIONS = [1, 2, 3, 4, 5]

export default function Reviews() {
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ rating: 5, title: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      try {
        const data = await reviewsService.list()
        // Handle paginated response (DRF format) - apiClient already returns response.data
        const reviewsData = data?.results || (Array.isArray(data) ? data : [])
        setReviews(reviewsData)
      } catch (err) {
        console.error(err)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await reviewsService.create(form)
      addToast('Thank you for your review! It will appear once approved.', 'success')
      setForm({ rating: 5, title: '', body: '' })
    } catch (err) {
      addToast('Failed to submit review. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Reviews</h1>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h2>
            {!isAuthenticated ? (
              <p className="text-sm text-gray-600">
                You must be logged in to leave a review.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  >
                    {RATING_OPTIONS.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} stars
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gradient w-full py-3"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
            {loading ? (
              <p className="text-sm text-gray-600">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-600">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{review.title}</p>
                        <p className="text-sm text-gray-500">
                          {review.user} • {review.rating} / 5
                          {!review.published && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">Pending</span>}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
