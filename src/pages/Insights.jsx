import { useState, useEffect, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import blogService from '../services/blog'
import toast from 'react-hot-toast'
import { APP_NAME } from '../utils/config'
import { 
  DocumentTextIcon, 
  ChevronRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'job_search', label: 'Job Search' },
  { value: 'career_advice', label: 'Career Advice' },
  { value: 'technology', label: 'Technology' },
  { value: 'interviews', label: 'Interviews' },
  { value: 'personal_branding', label: 'Personal Branding' },
  { value: 'salary', label: 'Salary & Compensation' },
  { value: 'remote_work', label: 'Remote Work' },
  { value: 'industry_news', label: 'Industry News' },
]

export default function Insights() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [post, setPost] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(null)
  
  // Subscription form
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchSinglePost()
    } else {
      fetchPosts()
      fetchFeaturedPosts()
    }
  }, [slug])

  const fetchSinglePost = async () => {
    try {
      setPostLoading(true)
      const res = await blogService.getPost(slug)
      setPost(res.data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setPostError('Post not found or could not be loaded.')
    } finally {
      setPostLoading(false)
    }
  }

  const fetchPosts = async (category = 'all') => {
    try {
      setLoading(true)
      const params = category !== 'all' ? { category } : {}
      const res = await blogService.getPosts(params)
      setPosts(res.data.results || res.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Use fallback data if API fails
      setPosts(getFallbackPosts())
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const res = await blogService.getFeaturedPosts()
      setFeaturedPosts(res.data || [])
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    fetchPosts(category)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    try {
      setSubscribing(true)
      await blogService.subscribe(email, 'insights_page')
      setSubscribed(true)
      toast.success('Successfully subscribed to insights updates!')
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Fallback posts if API is not available
  const getFallbackPosts = () => [
    {
      id: 1,
      title: '10 Tips for a Successful Job Search in 2024',
      slug: '10-tips-successful-job-search-2024',
      excerpt: 'Discover the top strategies that will help you stand out and land your dream job in the current market.',
      date: 'March 5, 2024',
      category: 'job_search',
      category_display: 'Job Search'
    },
    {
      id: 2,
      title: 'How AI is Revolutionizing the Job Search Process',
      slug: 'ai-revolutionizing-job-search',
      excerpt: 'Learn how artificial intelligence is changing the way we find and apply for jobs.',
      date: 'February 28, 2024',
      category: 'technology',
      category_display: 'Technology'
    },
    {
      id: 3,
      title: 'Mastering the Art of the Follow-Up Email',
      slug: 'mastering-follow-up-email',
      excerpt: 'Expert tips on crafting the perfect follow-up email that gets results.',
      date: 'February 20, 2024',
      category: 'career_advice',
      category_display: 'Career Advice'
    },
    {
      id: 4,
      title: 'How to Prepare for Virtual Interviews',
      slug: 'prepare-virtual-interviews',
      excerpt: 'Everything you need to know to ace your next video interview.',
      date: 'February 15, 2024',
      category: 'interviews',
      category_display: 'Interviews'
    },
    {
      id: 5,
      title: 'Building Your Personal Brand as a Job Seeker',
      slug: 'building-personal-brand',
      excerpt: 'Learn how to create a strong personal brand that attracts recruiters.',
      date: 'February 10, 2024',
      category: 'personal_branding',
      category_display: 'Personal Branding'
    },
    {
      id: 6,
      title: 'Negotiating Your Salary: A Complete Guide',
      slug: 'negotiating-salary-complete-guide',
      excerpt: 'Expert advice on how to negotiate the best salary package.',
      date: 'February 5, 2024',
      category: 'salary',
      category_display: 'Salary & Compensation'
    }
  ]

  // Render author display picture or fallback icon
  const renderAuthorPicture = (post) => {
    if (post.author_display_picture) {
      return (
        <img 
          src={post.author_display_picture} 
          alt={post.author_name || 'Author'}
          className="w-8 h-8 rounded-full object-cover"
        />
      )
    }
    return <UserCircleIcon className="w-8 h-8 text-gray-400" />
  }

  return (
    <>
      {/* Single Post View - Only show when slug is present */}
      {slug && postLoading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      )}

      {slug && postError && (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-8">{postError}</p>
          <Link to="/insights" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Insights
          </Link>
        </div>
      )}

      {slug && !postLoading && !postError && post && (
        <article className="min-h-screen bg-white">
            {/* Post Header */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link 
                  to="/insights" 
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-6"
                >
                  <ChevronRightIcon className="w-4 h-4 rotate-180" />
                  Back to Insights
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                    {post.category_display || post.category}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(post.published_date)}
                  </span>
                  {post.external_link && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-medium text-accent-600 uppercase tracking-wide flex items-center gap-1">
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        External
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>
                {post.author_name && (
                  <div className="flex items-center gap-3">
                    {renderAuthorPicture(post)}
                    <div>
                      <p className="font-medium text-gray-900">{post.author_name}</p>
                      <p className="text-sm text-gray-500">{post.view_count} views</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post Image */}
            {post.featured_image && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {post.external_link ? (
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-8">
                    This article is available on an external website.
                  </p>
                  <a 
                    href={post.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-gradient px-6 py-3"
                  >
                    Read Full Article
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}
            </div>

            {/* Post Footer */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(cat => cat.value !== 'all').map((cat) => (
                  <Link
                    key={cat.value}
                    to={`/insights?category=${cat.value}`}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        )}

      {!slug && (
        <Fragment>
          {/* Header */}
          <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
            </Link>
            <Link to="/register">
              <Button className="btn-gradient px-5 py-2.5 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Insights & <span className="text-gradient">Resources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, tips, and insights to help you land your dream job.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {post.external_link ? (
                    <a 
                      href={post.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {post.featured_image && (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      )}
                    </a>
                  ) : (
                    <Link to={`/insights/${post.slug}`}>
                      {post.featured_image && (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      )}
                    </Link>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                      {post.category_display || post.category}
                    </span>
                    {post.external_link && (
                      <span className="text-xs font-medium text-accent-600 uppercase tracking-wide flex items-center gap-1">
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        External
                      </span>
                    )}
                  </div>
                  {post.external_link ? (
                    <a 
                      href={post.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors flex items-center gap-2">
                        {post.title}
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
                      </h3>
                    </a>
                  ) : (
                    <Link to={`/insights/${post.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  )}
                  <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  {/* Author Display Picture */}
                  {post.author_name && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      {renderAuthorPicture(post)}
                      <span className="text-sm text-gray-600">{post.author_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {post.external_link ? (
                    <a 
                      href={post.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center relative">
                        {post.featured_image ? (
                          <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <DocumentTextIcon className="w-16 h-16 text-primary-300" />
                        )}
                        <div className="absolute top-3 right-3 bg-accent-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                          External
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to={`/insights/${post.slug}`}>
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        {post.featured_image ? (
                          <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <DocumentTextIcon className="w-16 h-16 text-primary-300" />
                        )}
                      </div>
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {post.category_display || post.category}
                      </span>
                      {post.external_link && (
                        <span className="text-xs font-medium text-accent-600 uppercase tracking-wide">
                          External
                        </span>
                      )}
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(post.published_date) || post.date}
                      </span>
                    </div>
                    {post.external_link ? (
                      <a 
                        href={post.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors flex items-center gap-2">
                          {post.title}
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
                        </h3>
                      </a>
                    ) : (
                      <Link to={`/insights/${post.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                    )}
                    <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    {/* Author Display Picture */}
                    {post.author_name && (
                      <div className="flex items-center gap-2 mt-4">
                        {renderAuthorPicture(post)}
                        <span className="text-sm text-gray-600">{post.author_name}</span>
                      </div>
                    )}
                    {post.external_link ? (
                      <a 
                        href={post.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 font-medium mt-4 hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link 
                        to={`/insights/${post.slug}`}
                        className="inline-flex items-center gap-1 text-primary-600 font-medium mt-4 hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with {APP_NAME}
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Get the latest job search tips, career advice, and industry insights delivered straight to your inbox.
            </p>
            
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-white">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <Button 
                  type="submit"
                  disabled={subscribing}
                  className="btn-gradient px-6 py-3"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
            
            <p className="text-white/60 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <span className="font-bold text-xl">{APP_NAME}</span>
              </Link>
              <p className="text-gray-400 text-sm">
                The intelligent job search companion that helps you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/subscription" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/insights" className="hover:text-white transition-colors">Insights</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="divider-gradient mb-8" />
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
        </Fragment>
      )}
    </>
  )
}
