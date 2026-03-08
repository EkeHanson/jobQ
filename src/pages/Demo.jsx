import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../components/common/Button'

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const steps = [
    {
      title: 'Welcome to JobTrack AI',
      description: 'Your intelligent job search companion that helps you land your dream job faster than ever before.',
      icon: '🎯'
    },
    {
      title: 'Paste Job Listings',
      description: 'Simply paste any job description from any website. Our AI automatically extracts key requirements, skills, and qualifications.',
      icon: '📋'
    },
    {
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI analyzes the job posting and generates interview questions, skill assessments, and personalized recommendations.',
      icon: '🤖'
    },
    {
      title: 'Track All Applications',
      description: 'Keep all your job applications organized in one place. Track status, deadlines, and follow-ups effortlessly.',
      icon: '📊'
    },
    {
      title: 'Interview Preparation',
      description: 'Get AI-generated practice questions and answers tailored to each job. Prepare confidently for every interview.',
      icon: '💼'
    },
    {
      title: 'Analytics & Insights',
      description: 'Track your job search progress with detailed analytics. Identify patterns and optimize your approach.',
      icon: '📈'
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 4000)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <span className="font-bold text-xl text-gray-900">JobTrack<span className="text-gradient">AI</span></span>
            </Link>
            <Link to="/register">
              <Button className="btn-gradient px-5 py-2.5 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See <span className="text-gradient">JobTrack AI</span> in Action
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how easy it is to transform your job search with our intelligent platform.
            </p>
          </div>

          {/* Main Demo Display */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-1 shadow-2xl mb-12">
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                {/* Animated Icon */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl text-5xl animate-bounce">
                    {steps[currentStep].icon}
                  </div>
                </div>

                {/* Step Content */}
                <div className="animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-12">
                  <div className="flex justify-center gap-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-primary-500 w-8'
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevStep}
              className="p-4 rounded-full bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 rounded-full bg-primary-600 hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25"
            >
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={nextStep}
              className="p-4 rounded-full bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="text-center text-gray-500 mt-4">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Extraction',
                description: 'Paste any job posting and let AI do the heavy lifting',
                icon: '🔍'
              },
              {
                title: 'Application Tracking',
                description: 'Never lose track of where you\'ve applied',
                icon: '📁'
              },
              {
                title: 'Interview Ready',
                description: 'Be prepared for every interview with AI-generated questions',
                icon: '✅'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of job seekers who have landed their dream jobs with JobTrack AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
                Start Free Trial
              </button>
            </Link>
            <Link to="/features">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
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
