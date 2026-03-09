import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

export default function Features() {
  const features = [
    {
      title: 'AI-Powered Job Extraction',
      description: 'Our advanced AI automatically parses job descriptions from any website, extracting key requirements, skills, and qualifications in seconds.',
      icon: BoltIcon,
    },
    {
      title: 'Application Tracking',
      description: 'Track every job application in one place. Never lose track of where you\'ve applied or the status of your applications.',
      icon: ClipboardDocumentListIcon,
    },
    {
      title: 'Smart Reminders',
      description: 'Never miss a follow-up deadline. Get intelligent reminders based on company response times and application timelines.',
      icon: ClockIcon,
    },
    {
      title: 'Interview Preparation',
      description: 'AI-generated interview questions and answers based on the job description and your profile.',
      icon: SparklesIcon,
    },
    {
      title: 'Analytics Dashboard',
      description: 'Get insights into your job search. Track response rates, identify patterns, and optimize your approach.',
      icon: ChartBarIcon,
    },
    {
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your personal information with third parties.',
      icon: LockClosedIcon,
    }
  ]

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

      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Your <span className="text-gradient">Job Search</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to land your dream job, all in one intelligent platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
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
          <Link to="/register">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
              Get Started for Free
            </button>
          </Link>
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
