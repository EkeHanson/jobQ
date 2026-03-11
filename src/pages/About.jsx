import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { APP_NAME } from '../utils/config'

export default function About() {
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
            About <span className="text-gradient">{APP_NAME}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to help job seekers land their dream jobs faster and more efficiently.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              {APP_NAME} was born from a simple frustration: the job search process is broken. 
              Job seekers spend countless hours applying to jobs, tracking applications, and following up - 
              often without any systematic approach.
            </p>
            <p className="text-gray-600 mb-6">
              We built {APP_NAME} to solve this problem. Our AI-powered platform helps you track every 
              application, extract job details automatically, and prepare for interviews - all in one place.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To democratize access to job search tools and help everyone, regardless of their background 
              or experience, land their dream job.
            </p>
          </div>
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
                <span className="font-bold text-lg">{APP_NAME}</span>
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
            <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
