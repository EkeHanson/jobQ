import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState, useRef } from 'react'
import Button from '../components/common/Button'
import { subscriptionService } from '../services/subscription'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  BoltIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)

  const userMenuRef = useRef(null)

  // Check if plan is current subscription
  const isCurrentPlan = (planName) => {
    if (!currentSubscription?.plan) return false
    return currentSubscription.plan.name.toLowerCase() === planName.toLowerCase() ||
           (currentSubscription.plan.name.toLowerCase().includes('free') && planName.toLowerCase().includes('free'))
  }

  // Get plan tier for badge display
  const getPlanTier = (planName) => {
    const name = planName.toLowerCase()
    if (name.includes('free')) return 1
    if (name.includes('basic')) return 2
    if (name.includes('pro')) return 3
    return 0
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    // Don't redirect - allow authenticated users to view landing page
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansData = await subscriptionService.getPublicPlans()
        setPlans(plansData)
        
        // Fetch user's subscription if authenticated
        if (isAuthenticated) {
          const subData = await subscriptionService.getMySubscription()
          setCurrentSubscription(subData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchData()
  }, [isAuthenticated])

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI Job Extraction',
      description: 'Copy-paste any job description. Our AI automatically extracts and structures the data.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Application Analytics',
      description: 'Track your response rate, interview rate, and application success metrics in real-time.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: BoltIcon,
      title: 'Smart Reminders',
      description: 'Never miss a deadline. Get reminders for application deadlines and follow-ups.',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: LockClosedIcon,
      title: 'Secure & Private',
      description: 'Your application data is encrypted and stored securely. We never share your information.',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      content: 'JobTrack AI saved me hours of manual tracking. The AI extraction is incredibly accurate!',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Meta',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      content: 'Landed 3 interviews in my first week. The analytics helped me understand what works.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Data Scientist at Netflix',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      content: 'The clean interface and smart reminders keep me organized throughout my job search.',
      rating: 5,
    },
  ]

  const stats = [
    { value: '50K+', label: 'Applications Tracked' },
    { value: '92%', label: 'User Satisfaction' },
    { value: '3.2x', label: 'Interview Rate' },
    { value: 'Free', label: 'To Get Started' },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 hero-gradient -z-10" />
      <div className="fixed inset-0 floating-shapes -z-10" />
      
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
                J
              </div>
              <span className="font-bold text-xl text-gray-900">JobTrack<span className="text-gradient">AI</span></span>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium text-sm">
                      {user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user?.first_name}</span>
                  </button>

                  {showUserMenu && (
                    <div ref={userMenuRef} className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {currentSubscription?.plan && (
                          <p className="text-xs text-primary-600 mt-1">
                            {currentSubscription.plan.name} Plan {currentSubscription.active ? '(Active)' : ''}
                          </p>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ChartBarIcon className="w-5 h-5" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircleIcon className="w-5 h-5" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Cog6ToothIcon className="w-5 h-5" />
                          Settings
                        </Link>
                        <Link
                          to="/subscription"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <CreditCardIcon className="w-5 h-5" />
                          Subscription
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            handleLogout()
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="nav-link hidden sm:block">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="btn-gradient px-5 py-2.5 text-sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm mb-8 animate-fade-in-down">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600">Over 50,000+ job seekers trust JobTrack AI</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-100">
              The Operating System for
              <span className="block text-gradient"> Job Seekers</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto text-balance animate-fade-in-up animation-delay-200">
              Track every application, extract job details with AI, and prepare for interviews. All in one beautiful platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <button className="btn-gradient px-8 py-4 text-lg rounded-xl shadow-xl shadow-primary-500/25 group">
                  <span className="flex items-center gap-2">
                    {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              {!isAuthenticated && (
                <Link to="/demo">
                  <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50/50">
                    Watch Demo
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in-up animation-delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative animate-fade-in-up animation-delay-500">
            <div className="relative mx-auto max-w-5xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-brand-500/20 to-accent-500/20 blur-3xl rounded-full" />
              
              {/* Dashboard Preview Card */}
              <div className="relative glass-card p-2 md:p-4">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop" 
                  alt="Dashboard Preview" 
                  className="rounded-xl shadow-2xl w-full"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 glass-card px-4 py-3 animate-float hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Application Sent!</div>
                      <div className="text-xs text-gray-500">Just now</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass-card px-4 py-3 animate-float animation-delay-300 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-primary-500 flex items-center justify-center">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">AI Extracted</div>
                      <div className="text-xs text-gray-500">Job details saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to <span className="text-gradient">land your dream job</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed by experts who understand the job search journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group glass-card p-6 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-gradient">thousands of job seekers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="glass-card p-8 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, <span className="text-gradient">transparent</span> pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {loadingPlans ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading plans...</p>
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan, index) => {
                // Convert price from USD cents to Naira (rate: 1500 NGN per 1 USD)
                const priceInNaira = plan.price_cents === 0 ? 0 : (plan.price_cents)
                const price = plan.price_cents === 0 ? 'Free' : `₦${priceInNaira.toLocaleString('en-NG')}`
                
                // Build features array based on plan limits
                const features = []
                if (plan.max_applications > 0) {
                  features.push(`${plan.max_applications} applications/month`)
                } else {
                  features.push('Unlimited applications')
                }
                if (plan.max_ai_pastes > 0) {
                  features.push(`${plan.max_ai_pastes} AI extractions/month`)
                } else {
                  features.push('Unlimited AI extractions')
                }
                if (plan.max_profiles > 1) {
                  features.push(`${plan.max_profiles} profiles`)
                } else if (plan.max_profiles === 0) {
                  features.push('Unlimited profiles')
                }
                if (plan.description) {
                  plan.description.split('\n').forEach(line => {
                    if (line.trim()) features.push(line.trim())
                  })
                }
                
                return (
                  <div
                    key={plan.id || index}
                    className={`relative glass-card p-8 card-hover ${
                      isCurrentPlan(plan.name) ? 'ring-2 ring-primary-500' : (index === 1 ? 'ring-2 ring-primary-500 scale-105 z-10' : '')
                    }`}
                  >
                    {isCurrentPlan(plan.name) ? (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="badge-gradient px-4 py-1">Current</span>
                      </div>
                    ) : index === 1 ? (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="badge-gradient px-4 py-1">Most Popular</span>
                      </div>
                    ) : null}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{price}</span>
                      {plan.price_cents > 0 && <span className="text-gray-500">/month</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      {plan.max_applications > 0 ? `${plan.max_applications} applications/month` : 'Unlimited applications'}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <CheckCircleIcon className={`w-5 h-5 ${index === 1 ? 'text-primary-500' : 'text-gray-400'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={isCurrentPlan(plan.name) ? '/dashboard' : (isAuthenticated ? '/subscription' : '/register')}>
                      <button 
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          isCurrentPlan(plan.name) 
                            ? 'bg-gray-100 text-gray-500 cursor-default' 
                            : (index === 1 
                                ? 'btn-gradient shadow-lg shadow-primary-500/25' 
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200')
                        }`}
                        disabled={isCurrentPlan(plan.name)}
                      >
                        {isCurrentPlan(plan.name) ? 'Current Plan' : (isAuthenticated ? 'Subscribe' : 'Get Started')}
                      </button>
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No plans available at the moment. Please check back later.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 -z-10" />
        <div className="absolute inset-0 floating-shapes -z-10 opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isAuthenticated && currentSubscription?.plan && currentSubscription?.active ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                You're on the {currentSubscription.plan.name} Plan
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Your subscription is active. Enjoy all the benefits!
              </p>
              <Link to="/dashboard">
                <button className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
                  Go to Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to land your dream job?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Join thousands of job seekers who have transformed their job search with JobTrack AI
              </p>
              <Link to={isAuthenticated ? "/subscription" : "/register"}>
                <button className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
                  {isAuthenticated ? 'Subscribe Now' : 'Get Started for Free'}
                </button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Footer Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold">
                  J
                </div>
                <span className="font-bold text-lg">JobTrack AI</span>
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
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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
            <p>&copy; 2024 JobTrack AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
