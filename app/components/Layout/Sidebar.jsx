import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  ChevronRight,
  X,
  BarChart3,
  Zap
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: 'Products',
    icon: Package,
    href: '/products',
    items: [
      { title: 'List', href: '/products' },
      { title: 'Create', href: '/products/new' },
    ],
  },
]
const Sidebar = () => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState(['Products'])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() =>{
    const checkMobile = () =>{
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleExpand = (title) => {
    setExpandedItems((prev) =>
    prev.includes(title)
    ? prev.filter((item) => item !== title)
    : [...prev, title]
    )
  }

  const isActive = (href) => {
    if(href === '/'){
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div>Sidebar</div>
  )
}

export default Sidebar