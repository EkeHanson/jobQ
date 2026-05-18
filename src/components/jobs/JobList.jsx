import JobCard from './JobCard'

export default function JobList({ jobs = [], columns = 1, className = '' }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No jobs available</p>
      </div>
    )
  }

  const containerClass = columns > 1
    ? `grid gap-6 sm:grid-cols-2 ${className}`
    : `space-y-2 ${className}`

  return (
    <div className={containerClass}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
