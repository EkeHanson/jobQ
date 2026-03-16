import Header from './Header'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'

export default function DashboardLayout({ children }) {
  const { sidebar } = useSelector((state) => state.ui)
  const isCollapsed = sidebar.isCollapsed

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 overflow-auto scrollbar-thin">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
