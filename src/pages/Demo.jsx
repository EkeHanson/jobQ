import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../components/common/Button'
import { APP_NAME } from '../utils/config'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  ChartBarIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { 
  CheckBadgeIcon,
  PlayCircleIcon
} from '@heroicons/react/24/solid'

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const steps = [
    {
      title: 'Paste. Extract. Organize.',
      description: 'Copy any job description from LinkedIn, Greenhouse, or any job board. Our AI extracts requirements, skills, and company details in seconds.',
      icon: ClipboardDocumentListIcon,
      detail: 'No manual data entry. No spreadsheets.'
    },
    {
      title: 'AI-powered analysis',
      description: 'Our engine identifies skill gaps, generates tailored interview questions, and highlights what makes you a strong fit for each role.',
      icon: BoltIcon,
      detail: 'Get personalized preparation for every application.'
    },
    {
      title: 'Track your pipeline',
      description: 'See every application in one view. Update statuses, add notes, and never miss a follow-up or deadline again.',
      icon: ChartBarIcon,
      detail: 'Know exactly where you stand with every role.'
    },
    {
      title: 'Interview preparation',
      description: 'Practice with AI-generated questions specific to each job. Review sample answers and build confidence before the real conversation.',
      icon: BriefcaseIcon,
      detail: 'Walk into every interview prepared.'
    },
    {
      title: 'Performance analytics',
      description: 'See what\'s working. Track response rates, interview conversion, and time-to-offer across different job types and industries.',
      icon: ChartBarIcon,
      detail: 'Optimize your search with real data.'
    }
  ]

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, steps.length])

  const nextStep = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const goToStep = (index) => {
    setIsPlaying(false)
    setCurrentStep(index)
  }

  const ActiveStepIcon = steps[currentStep].icon

  return (
    <div className="bg-white">
      {/* Navigation - consistent with landing page */}
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
              <Link to="/demo" className="text-sm text-gray-900 font-medium">Demo</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link to="/register">
                <Button className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Header - minimal, editorial */}
      <section className="pt-16 pb-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-6">
            <PlayCircleIcon className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Interactive demo</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            See how it works
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Watch the demo or click through to see how {APP_NAME} transforms your job search from chaos to clarity.
          </p>
        </div>
      </section>

      {/* Main Demo Section - redesigned, clean, intentional */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Demo Card - no gradients, no animations, just clean UI */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Mock browser chrome */}
            <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
              <div className="text-xs text-gray-400 ml-4">
                app.{APP_NAME.toLowerCase()}.com/dashboard
              </div>
            </div>

            {/* Demo content */}
            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                {/* Icon - clean, no animations */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm border border-gray-100">
                  <ActiveStepIcon className="w-8 h-8 text-gray-700" />
                </div>

                {/* Step content */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {steps[currentStep].description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                    <CheckBadgeIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-600">{steps[currentStep].detail}</span>
                  </div>
                </div>

                {/* Progress indicators - minimal */}
                <div className="mt-10 flex items-center gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`h-1 rounded-full transition-all duration-200 ${
                        index === currentStep
                          ? 'bg-gray-900 w-6'
                          : 'bg-gray-200 w-4 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation controls - clean, no gradients */}
            <div className="bg-gray-50 border-t border-gray-100 px-8 py-5 flex items-center justify-center gap-4">
              <button
                onClick={prevStep}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {isPlaying ? 'Pause' : 'Play'} demo
              </button>

              <button
                onClick={nextStep}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Step indicator text */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </section>

      {/* Feature highlights - clean, editorial */}
      <section className="py-16 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Everything you need, nothing you don't
            </h2>
            <p className="text-gray-500 text-sm">
              Built for serious job seekers who value their time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Smart extraction',
                description: 'Paste any job link — we handle the rest. No more copying and pasting bullet points.',
                icon: DocumentDuplicateIcon
              },
              {
                title: 'Visual pipeline',
                description: 'See your entire job search in one view. Know exactly where you stand with every application.',
                icon: EyeIcon
              },
              {
                title: 'Tailored prep',
                description: 'Get interview questions and talking points specific to each role and company.',
                icon: UserGroupIcon
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side-by-side comparison - showing value */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 mb-5">
                <span className="text-xs font-medium text-gray-600">Before → After</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                From scattered spreadsheets to a single source of truth
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Stop juggling notes, bookmarks, and email threads. Everything you need to manage your job search lives here.
              </p>
              <div className="space-y-3">
                {[
                  'Auto-extracted job details',
                  'Centralized application tracking',
                  'Interview prep per role',
                  'Performance analytics'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-gray-400 mb-1">Typical job seeker setup</div>
                <div className="text-2xl font-bold text-gray-900">7+ tabs</div>
                <div className="text-xs text-gray-300">spreadsheets, notes, bookmarks</div>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-1">With {APP_NAME}</div>
                <div className="text-2xl font-bold text-gray-900">1 platform</div>
                <div className="text-xs text-gray-300">everything in one place</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section - social proof */}
      <section className="py-16 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-gray-300 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              "This tool cut my job search time in half. The AI extraction alone is worth it — I'm never going back to manual tracking."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                JD
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 text-sm">Jessica Davis</div>
                <div className="text-xs text-gray-400">Product Manager · Landed role at Atlassian</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - consistent with landing page */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            Ready to take control of your job search?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of job seekers who have transformed their job search.
          </p>
          <Link to="/register">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors">
              Start your free trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - minimal */}
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
                <li><Link to="/demo" className="text-xs text-gray-400 hover:text-gray-600">Demo</Link></li>
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

// Helper component for stars
function StarIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.714.436 1.599-.207 1.405-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.753-.382-1.831-4.401z" clipRule="evenodd" />
    </svg>
  )
}