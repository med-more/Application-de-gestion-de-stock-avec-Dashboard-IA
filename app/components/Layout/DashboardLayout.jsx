import { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"


const DashboardLayout = () => {
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
  return (
    <div>DashboardLayout</div>
  )
}

export default DashboardLayout