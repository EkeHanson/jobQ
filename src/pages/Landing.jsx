import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState, useRef } from 'react'
import Button from '../components/common/Button'
import { subscriptionService } from '../services/subscription'
import { APP_NAME } from '../utils/config'
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
  ArrowLeftStartOnRectangleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'
import { 
  ChevronRightIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/solid'

export default function Landing() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)

  const userMenuRef = useRef(null)

  const isCurrentPlan = (planName) => {
    if (!currentSubscription?.plan) return false
    return currentSubscription.plan.name.toLowerCase() === planName.toLowerCase() ||
           (currentSubscription.plan.name.toLowerCase().includes('free') && planName.toLowerCase().includes('free'))
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleWatchDemo = () => {
    navigate('/demo')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await subscriptionService.getPublicPlans()
        setPlans(plansData)
        
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'AI job extraction',
      description: 'Paste any job description—our AI structures it instantly. No more manual data entry.',
      stat: '2,341 hrs saved',
      statLabel: 'by users this month'
    },
    {
      icon: ChartPieIcon,
      title: 'Search analytics',
      description: 'See what works. Track response rates, interview conversions, and time-to-offer metrics.',
      stat: '73% avg. uplift',
      statLabel: 'in application quality'
    },
    {
      icon: CalendarIcon,
      title: 'Smart reminders',
      description: 'Never miss a follow-up or deadline. Automated reminders that actually help.',
      stat: '94% on-time',
      statLabel: 'application follow-through'
    }
  ]

  const workflowSteps = [
    { 
      number: '01',
      title: 'Paste any job link',
      description: 'Our AI extracts all requirements, responsibilities, and company details automatically.',
      image: '/api/placeholder/480/320'
    },
    { 
      number: '02',
      title: 'Track with context',
      description: 'See your pipeline, customize statuses, and add interview notes in one place.',
      image: '/api/placeholder/480/320'
    },
    { 
      number: '03',
      title: 'Learn & improve',
      description: 'Get personalized insights on your search patterns and where to focus next.',
      image: '/api/placeholder/480/320'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'Stripe',
      image: '/api/placeholder/64/64',
      content: 'What used to take me 4 hours a week now takes 20 minutes. The AI extraction is eerily accurate.',
      metric: '15 interviews',
      metricLabel: 'in 6 weeks'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Lead',
      company: 'Notion',
      image: '/api/placeholder/64/64',
      content: 'Finally, a job search tool that respects my time. Clean, fast, and genuinely useful.',
      metric: '3 offers',
      metricLabel: 'from 47 applications'
    },
    {
      name: 'Emily Watson',
      role: 'Data Scientist',
      company: 'OpenAI',
      image: '/api/placeholder/64/64',
      content: 'The analytics alone are worth it. I could see exactly which types of roles got responses.',
      metric: '86% response',
      metricLabel: 'rate increase'
    }
  ]

  const stats = [
    { value: '47,283', label: 'applications tracked', detail: 'this month' },
    { value: '892', label: 'offers landed', detail: 'using our platform' },
    { value: '31 min', label: 'daily time saved', detail: 'per active user' }
  ]

  return (
    <div className="bg-white">
      {/* Navigation - clean, minimal, intentional */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                JT
              </div>
              <span className="font-medium text-gray-900 tracking-tight">{APP_NAME}</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link to="/customers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Customers</Link>
              <Link to="/insights" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Insights</Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium">
                      {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">{user?.first_name || user?.email?.split('@')[0]}</span>
                  </button>

                  {showUserMenu && (
                    <div ref={userMenuRef} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                        {currentSubscription?.plan && (
                          <p className="text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-gray-50">
                            {currentSubscription.plan.name} plan
                          </p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ChartBarIcon className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircleIcon className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/subscription"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <CreditCardIcon className="w-4 h-4" />
                          Subscription
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            handleLogout()
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - asymmetrical, editorial layout */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column - content */}
            <div className="pt-8 lg:pt-12">
              {/* Trust badge - subtle, not animated */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-8">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Trusted by 50,000+ job seekers</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.2]">
                The operating system for{' '}
                <span className="border-b-2 border-gray-300">job seekers</span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
                Track every application, extract job details with AI, and prepare for interviews. All in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                    Start free
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </Link>
                {!isAuthenticated && (
                  <button 
                    onClick={handleWatchDemo}
                    className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors"
                  >
                    Watch demo
                  </button>
                )}
              </div>

              {/* Stats row - clean, no gradients */}
              <div className="flex flex-wrap gap-8 border-t border-gray-100 pt-8">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                    <div className="text-xs text-gray-300">{stat.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - product preview (realistic, not flashy) */}
            <div className="relative lg:mt-8">
              <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="text-xs text-gray-400 ml-4">Applications / Product Designer</div>
                </div>
                <div className="p-5">
                  {/* Application list mockup */}
                  <div className="space-y-3">
                    {[
                      { company: 'Linear', role: 'Product Designer', stage: 'Interview', date: 'May 15' },
                      { company: 'Stripe', role: 'Senior Product Designer', stage: 'Applied', date: 'May 12' },
                      { company: 'Notion', role: 'Design Systems Lead', stage: 'Phone Screen', date: 'May 10' }
                    ].map((app, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{app.company}</div>
                          <div className="text-xs text-gray-400">{app.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-500">{app.stage}</div>
                          <div className="text-xs text-gray-300">{app.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total applications</span>
                      <span className="font-medium text-gray-900">24</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Interview rate</span>
                      <span className="font-medium text-gray-900">42%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating element - minimal, static */}
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 rounded-lg shadow-sm px-4 py-2 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">AI extracted: Senior Product Designer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section - 3 columns, editorial feel */}
      <section className="py-20 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Built for the modern job search
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Everything you need to stay organized and move faster. No fluff, no distractions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{feature.description}</p>
                <div className="pt-3 border-t border-gray-50">
                  <div className="text-sm font-medium text-gray-900">{feature.stat}</div>
                  <div className="text-xs text-gray-400">{feature.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow section - asymmetrical, alternating */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {workflowSteps.map((step, index) => (
            <div key={index} className={`grid md:grid-cols-2 gap-12 items-center mb-20 last:mb-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="text-sm font-mono text-gray-400 mb-3">{step.number}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
                <div className="mt-6">
                  <button 
                    onClick={handleWatchDemo}
                    className="text-sm font-medium text-gray-900 inline-flex items-center gap-1 group hover:text-gray-600 transition-colors"
                  >
                    Learn more 
                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
              <div className={`bg-gray-50 rounded-xl border border-gray-100 aspect-video flex items-center justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <span className="text-gray-300 text-sm">Product screenshot</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - minimal, metric-focused */}
      <section className="py-20 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Used by job seekers at
            </h2>
            <p className="text-gray-500">From startups to Fortune 500 companies.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role} · {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">"{testimonial.content}"</p>
                <div className="pt-3 border-t border-gray-50">
                  <div className="text-base font-semibold text-gray-900">{testimonial.metric}</div>
                  <div className="text-xs text-gray-400">{testimonial.metricLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - clean, transparent */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500">No hidden fees. Upgrade or cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {loadingPlans ? (
              <div className="col-span-3 text-center py-12">
                <div className="inline-block w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-400">Loading plans...</p>
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan, index) => {
                const priceInNaira = plan.price_cents === 0 ? 0 : (plan.price_cents)
                const price = plan.price_cents === 0 ? 'Free' : `₦${priceInNaira.toLocaleString('en-NG')}`
                
                const featuresList = []
                if (plan.max_applications > 0) featuresList.push(`${plan.max_applications} applications/month`)
                else featuresList.push('Unlimited applications')
                if (plan.max_ai_pastes > 0) featuresList.push(`${plan.max_ai_pastes} AI extractions/month`)
                else featuresList.push('Unlimited AI extractions')
                if (plan.description) {
                  plan.description.split('\n').forEach(line => {
                    if (line.trim()) featuresList.push(line.trim())
                  })
                }
                
                const isPopular = index === 1
                const isCurrent = isCurrentPlan(plan.name)
                
                return (
                  <div
                    key={plan.id || index}
                    className={`bg-white border rounded-xl p-6 relative ${
                      isPopular ? 'border-gray-300 shadow-sm' : 'border-gray-100'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-gray-900 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Most popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">{price}</span>
                      {plan.price_cents > 0 && <span className="text-gray-400 text-sm">/month</span>}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {featuresList.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={isCurrent ? '/dashboard' : (isAuthenticated ? '/subscription' : '/register')}>
                      <button 
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isCurrent 
                            ? 'bg-gray-100 text-gray-400 cursor-default' 
                            : (isPopular 
                                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                                : 'border border-gray-200 text-gray-700 hover:bg-gray-50')
                        }`}
                        disabled={isCurrent}
                      >
                        {isCurrent ? 'Current plan' : (isAuthenticated ? 'Subscribe' : 'Get started')}
                      </button>
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400 text-sm">
                No plans available. Please check back later.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA - minimal, direct */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            Ready to take control of your job search?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of job seekers who have transformed their job search.
          </p>
          <Link to={isAuthenticated && !currentSubscription?.active ? "/subscription" : "/register"}>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors">
              Start your free trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - minimal, structured */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                  JT
                </div>
                <span className="font-medium text-gray-900 text-sm">{APP_NAME}</span>
              </Link>
              <p className="text-xs text-gray-400 max-w-xs">
                The intelligent job search companion that helps you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-xs text-gray-400 hover:text-gray-600">Features</Link></li>
                <li><Link to="/pricing" className="text-xs text-gray-400 hover:text-gray-600">Pricing</Link></li>
                <li><Link to="/security" className="text-xs text-gray-400 hover:text-gray-600">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-xs text-gray-400 hover:text-gray-600">About</Link></li>
                <li><Link to="/insights" className="text-xs text-gray-400 hover:text-gray-600">Insights</Link></li>
                <li><Link to="/contact" className="text-xs text-gray-400 hover:text-gray-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link></li>
                <li><Link to="/terms" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
            <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}