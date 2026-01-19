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
    <div>Header</div>
  )
}

export default Header