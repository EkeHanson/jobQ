import DashboardLayout from '../components/layout/DashboardLayout'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import jobService from '../services/jobs'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { formatDate, formatSalaryRange } from '../utils/formatters'

const DUMMY_JOBS = {
  1: {
    id: 1,
    title: 'Senior Frontend Developer',
    company: { name: 'Tech Innovations Inc' },
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced Frontend Developer with expertise in React and modern web technologies. You will be responsible for building responsive user interfaces, optimizing performance, and collaborating with our design and backend teams.\n\nRequirements:\n• 5+ years of experience with React\n• Strong knowledge of JavaScript/TypeScript\n• Experience with state management (Redux, Context)\n• Understanding of responsive design and accessibility\n• Experience with testing frameworks (Jest, React Testing Library)\n\nResponsibilities:\n• Develop and maintain front-end applications\n• Collaborate with designers and backend developers\n• Optimize application performance\n• Write clean, maintainable code\n• Participate in code reviews',
    salary_min: 120000,
    salary_max: 150000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Senior',
    status: 'active',
    posted_date: '2026-02-15',
    deadline: '2026-03-30',
    application_url: 'https://techinnovations.com/careers/apply/frontend-dev',
  },
  2: {
    id: 2,
    title: 'Backend Engineer',
    company: { name: 'Cloud Solutions Ltd' },
    location: 'New York, NY',
    description: 'Join our team to build scalable backend systems using Node.js and microservices architecture. You will work on API development, database optimization, and cloud infrastructure.\n\nRequirements:\n• 4+ years of backend development experience\n• Proficiency in Node.js or similar backend frameworks\n• Experience with databases (PostgreSQL, MongoDB)\n• Knowledge of microservices architecture\n• Experience with Docker and Kubernetes is a plus\n\nResponsibilities:\n• Design and implement scalable APIs\n• Optimize database queries and performance\n• Work with DevOps team on deployment\n• Write comprehensive unit tests\n• Troubleshoot and resolve production issues',
    salary_min: 110000,
    salary_max: 140000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    status: 'active',
    posted_date: '2026-02-20',
    deadline: '2026-03-25',
    application_email: 'careers@cloudsolutions.com',
  },
  3: {
    id: 3,
    title: 'DevOps Engineer',
    company: { name: 'Digital Platforms Co' },
    location: 'Austin, TX',
    description: 'Seeking a DevOps specialist to manage cloud infrastructure, CI/CD pipelines, and Kubernetes deployments. You will ensure system reliability, scalability, and security.\n\nRequirements:\n• 3+ years of DevOps experience\n• Strong knowledge of AWS/GCP/Azure\n• Experience with Kubernetes and Docker\n• Proficiency with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)\n• Infrastructure as Code (Terraform, CloudFormation)\n\nResponsibilities:\n• Manage cloud infrastructure and deployments\n• Build and maintain CI/CD pipelines\n• Monitor system performance and security\n• Automate deployment processes\n• Collaborate with development teams',
    salary_min: 100000,
    salary_max: 130000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    status: 'active',
    posted_date: '2026-02-18',
    deadline: '2026-04-01',
    application_url: 'https://jobs.digitalplatforms.io/devops-engineer',
  },
  4: {
    id: 4,
    title: 'Full Stack Developer',
    company: { name: 'StartUp Ventures' },
    location: 'Remote',
    description: 'Build end-to-end web applications using React, Node.js, and PostgreSQL in a fast-paced startup environment. You will work on all aspects of the application stack.\n\nRequirements:\n• 3+ years of full-stack development experience\n• Proficiency in React and Node.js\n• Database design and optimization\n• RESTful API development\n• Git version control and agile methodologies\n\nResponsibilities:\n• Develop features across the entire stack\n• Contribute to UI/UX improvements\n• Maintain and optimize databases\n• Participate in architecture decisions\n• Mentor junior developers',
    salary_min: 90000,
    salary_max: 120000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    status: 'active',
    posted_date: '2026-02-22',
    deadline: '2026-03-20',
    application_email: 'hr@startupventures.io',
  },
  5: {
    id: 5,
    title: 'Mobile App Developer',
    company: { name: 'AppWorks Studios' },
    location: 'Seattle, WA',
    description: 'Develop iOS and Android applications using React Native and latest mobile technologies. Create engaging, performant mobile experiences for millions of users.\n\nRequirements:\n• 4+ years of mobile development experience\n• Proficiency in React Native\n• Experience with iOS and Android platforms\n• API integration and data management\n• Testing and debugging mobile applications\n\nResponsibilities:\n• Develop cross-platform mobile applications\n• Optimize app performance and battery usage\n• Collaborate with product and design teams\n• Write and maintain unit tests\n• Debug and resolve mobile-specific issues',
    salary_min: 95000,
    salary_max: 125000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    status: 'active',
    posted_date: '2026-02-19',
    deadline: '2026-03-28',
    application_url: 'https://appworks-studios.com/apply/mobile-developer',
  },
  6: {
    id: 6,
    title: 'Data Scientist',
    company: { name: 'Analytics Pro' },
    location: 'Boston, MA',
    description: 'Work with machine learning models, data analysis, and AI solutions to drive business insights. Build predictive models and data pipelines for analytics.\n\nRequirements:\n• 3+ years of data science experience\n• Strong Python and SQL skills\n• Experience with machine learning frameworks (TensorFlow, scikit-learn)\n• Data visualization and storytelling\n• Statistical analysis and hypothesis testing\n\nResponsibilities:\n• Develop machine learning models\n• Analyze large datasets and extract insights\n• Build data pipelines and ETL processes\n• Create data visualizations and reports\n• Collaborate with business stakeholders',
    salary_min: 105000,
    salary_max: 145000,
    salary_currency: 'USD',
    jobType: 'Full-time',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    status: 'active',
    posted_date: '2026-02-21',
    deadline: '2026-03-22',
    application_email: 'recruitment@analyticspro.com',
  },
}

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJob(id)
        setJob(res)
      } catch (e) {
        console.error(e)
        // Fallback to dummy data
        const dummyJob = DUMMY_JOBS[id]
        if (dummyJob) {
          setJob(dummyJob)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchJob()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">{job.company?.name}</span>
          <Badge status={job.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description || 'No description provided.'}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Details</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Location:</strong> {job.location || 'N/A'}
              </li>
              <li>
                <strong>Type:</strong> {job.employment_type}
              </li>
              <li>
                <strong>Experience:</strong> {job.experience_level}
              </li>
              <li>
                <strong>Salary:</strong>{' '}
                {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
              </li>
              <li>
                <strong>Deadline:</strong>{' '}
                {job.deadline ? formatDate(job.deadline) : 'N/A'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          {job.application_url ? (
            <>
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block"
              >
                Apply Now
              </a>
              <Button variant="secondary">Save Job</Button>
            </>
          ) : job.application_email ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
              <p className="text-sm text-gray-700 mb-2">
                <strong>To apply for this position, please send your resume and application to:</strong>
              </p>
              <a
                href={`mailto:${job.application_email}`}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg block mb-3"
              >
                {job.application_email}
              </a>
              <p className="text-sm text-gray-600">
                Please include your resume, cover letter, and any relevant portfolio links in your email.
              </p>
            </div>
          ) : (
            <Button>Apply Now</Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
