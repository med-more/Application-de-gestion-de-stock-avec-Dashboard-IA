import { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"


const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() =>{
    const checkMobile = () =>{
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if(!mobile){
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () =>{
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () =>{
    setSidebarOpen(false)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isMobile ? 'ml-0' : sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout