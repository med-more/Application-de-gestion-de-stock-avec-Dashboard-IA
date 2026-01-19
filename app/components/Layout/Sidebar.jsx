import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar