import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState(['Products'])
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const checkMobile = () => {
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
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const sidebarWidth = isOpen ? 'w-64' : 'w-20'

  return (
    <>
    
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}


      <aside
        className={`fixed left-0 top-0 h-full glass-effect border-r border-gray-200/50 z-50 transition-all duration-300 ease-in-out shadow-xl ${
          isMobile
            ? isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        } ${sidebarWidth}`}
      >
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl">

          <div className="p-4 sm:p-6 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-100'
              }`}>
                <div className="relative group">

                  <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/40 group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">

                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"></div>

                    <BarChart3 className="w-6 h-6 text-white relative z-10 drop-shadow-md" />

                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Zap className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300 tracking-tight">
                      DashPro
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Business Intelligence</span>
                  </div>
                )}
              </div>
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>


          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                if (item.items) {
                  const isExpanded = expandedItems.includes(item.title)
                  const hasActiveChild = item.items.some((subItem) =>
                    isActive(subItem.href)
                  )

                  return (
                    <div key={index} className="mb-1">
                      <button
                        onClick={() => {
                          if (!isOpen && !isMobile) {
                            onToggle()
                          }
                          toggleExpand(item.title)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                          hasActiveChild
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:shadow-sm'
                        } ${!isOpen ? 'justify-center' : ''}`}
                        title={!isOpen ? item.title : ''}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.icon && (
                            <item.icon
                              className={`w-5 h-5 flex-shrink-0 ${
                                hasActiveChild ? 'text-blue-600' : 'text-gray-500'
                              }`}
                            />
                          )}
                          {isOpen && (
                            <span className="text-sm font-medium whitespace-nowrap truncate">
                              {item.title}
                            </span>
                          )}
                        </div>
                        {isOpen && (
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        )}
                      </button>
                      {isExpanded && isOpen && (
                        <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              onClick={isMobile ? onClose : undefined}
                              className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive(subItem.href)
                                  ? 'bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100'
                                  : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    isActive(subItem.href)
                                      ? 'bg-blue-600'
                                      : 'bg-gray-300'
                                  }`}
                                />
                                <span className="whitespace-nowrap truncate">
                                  {subItem.title}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      active
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100 font-medium'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:shadow-sm'
                    } ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? item.title : ''}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          active ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      />
                    )}
                    {isOpen && (
                      <span className="text-sm font-medium whitespace-nowrap truncate">
                        {item.title}
                      </span>
                    )}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}