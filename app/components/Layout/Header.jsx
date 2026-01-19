import { User } from "lucide-react"
import { useState, useEffect } from "react"
const Header = ({ onMenuClick ,sidebarOpen = false }) => {
  const[isOpen, setIsOpen] = useState(sidebarOpen)

  useEffect(() => {
    setIsOpen(sidebarOpen)
  }, [sidebarOpen])

  const handleToggle = () =>{
    setIsOpen(!isOpen)
    onMenuClick()
  }
  return (
    <header className="glass-effect border-b border-gray-200/50 sticky top-0 z-30 shadow-sm backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">

          <button
            onClick={handleToggle}
            className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
            aria-label="Toggle sidebar"
            aria-expanded={isOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center">
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>


          <div className="flex-1" />


          <div className="flex items-center gap-2 sm:gap-3">

            <button
              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
              aria-label="Profile"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header