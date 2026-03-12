import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { APP_NAME } from '../utils/config'
import {
  LockClosedIcon,
  ShieldCheckIcon,
  KeyIcon,
  ChartBarIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

export default function Security() {
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
            Security <span className="text-gradient">Commitment</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your data security is our top priority. Learn how we protect your information.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <LockClosedIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Encryption</h3>
              <p className="text-gray-600">
                All data is encrypted using industry-standard AES-256 encryption, both in transit and at rest.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <ShieldCheckIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Infrastructure</h3>
              <p className="text-gray-600">
                Our servers are hosted in secure data centers with 24/7 monitoring and intrusion detection.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <KeyIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Access Controls</h3>
              <p className="text-gray-600">
                We implement strict access controls and role-based permissions to protect your data.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <CheckIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Audits</h3>
              <p className="text-gray-600">
                Our security practices are regularly audited by third-party security experts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <KeyIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600">
                We use secure authentication methods including JWT tokens and optional two-factor authentication.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <ChartBarIcon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Backups</h3>
              <p className="text-gray-600">
                Your data is regularly backed up to ensure business continuity and disaster recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Security Practices</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">SSL/TLS Encryption</h3>
                <p className="text-gray-600">All communications between your browser and our servers are encrypted using HTTPS.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Input Validation</h3>
                <p className="text-gray-600">All user inputs are validated and sanitized to prevent injection attacks.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Security Headers</h3>
                <p className="text-gray-600">We implement modern security headers including CSP, HSTS, and X-Frame-Options.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Privacy by Design</h3>
                <p className="text-gray-600">We collect only the data necessary for our service and never sell your personal information.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Report a Security Issue</h2>
          <p className="text-xl text-gray-300 mb-8">
            If you discover a security vulnerability, please report it to us immediately.
          </p>
          <a 
            href="mailto:security@jobtrackai.com" 
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Contact Security Team
          </a>
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
    </div>
  )
}
