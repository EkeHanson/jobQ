import DashboardLayout from '../components/layout/DashboardLayout'
import AICareerTools from '../components/ai/AICareerTools'

export default function JobMatch() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <AICareerTools />
      </div>
    </DashboardLayout>
  )
}
