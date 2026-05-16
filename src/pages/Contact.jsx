import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { useState } from 'react'
import { useToast } from '../components/common/Toast'
import contactService from '../services/contact'
import { APP_NAME, SOCIAL_GITHUB, SOCIAL_LINKEDIN } from '../utils/config'
import {
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      await contactService.sendMessage(formData)
      addToast('Message sent! We will get back to you soon.', 'success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      addToast(
        err?.response?.data?.detail || 'Failed to send your message. Please try again.',
        'error'
      )
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              <Link to="/insights" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Insights</Link>
            </div>

            <Link to="/register">
              <Button className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - minimal, left-aligned, intentional */}
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-6">
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Get in touch</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.2]">
              We'd love to hear from you
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Have questions about JobTrack AI? Our team is here to help. Send us a message and we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - asymmetrical layout */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form - intentional spacing, minimal styling */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border border-gray-100 rounded-xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200 outline-none transition-all text-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200 outline-none transition-all text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200 outline-none transition-all text-sm"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200 outline-none transition-all text-sm resize-none"
                      placeholder="Tell us what you'd like to know..."
                      required
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2" 
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : 'Send message'}
                    {!sending && <ChevronRightIcon className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info - editorial, metric-driven */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                {/* Response time highlight */}
                <div className="bg-gray-50/40 border border-gray-100 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Fast responses</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">Under 24 hours</div>
                      <p className="text-sm text-gray-500 mt-1">Average response time for all inquiries</p>
                    </div>
                  </div>
                </div>

                {/* Contact methods - clean, minimal */}
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email us</p>
                        <p className="text-sm text-gray-900">support@jobtrackai.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm text-gray-900">Lagos, Nigeria</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Business hours</p>
                        <p className="text-sm text-gray-900">Mon–Fri, 9AM–6PM WAT</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social links - minimal, no hover scaling */}
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Community</h3>
                  <div className="flex gap-3">
                    <a
                      href={SOCIAL_GITHUB}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <FaGithub className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={SOCIAL_LINKEDIN}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <FaLinkedin className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                {/* FAQ teaser - subtle CTA */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Quick answers</p>
                      <p className="text-xs text-gray-400 mt-0.5">Check our help center</p>
                    </div>
                    <Link to="/faq" className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
                      View FAQs
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - consistent with landing page redesign */}
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