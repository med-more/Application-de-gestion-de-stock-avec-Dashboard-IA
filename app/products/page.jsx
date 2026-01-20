import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import DashboardLayout from "../components/Layout/DashboardLayout"
import DataTable from "../components/Table/DataTable"
import ConfirmModal from "../components/Modal/ConfirmModal"
import {
  fetchProducts as fetchProductsAction,
  deleteProduct,
} from "../store/slices/productsSlice"
import {
  selectAllProducts as selectProducts,
  selectProductsLoading,
} from "../store/selectors"
import { Plus, Edit, Trash2, Search, Filter, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState('name')
  const  [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null })
    const [filters, setFilters] = useState({
    category: 'Toutes',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    maxQuantity: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() =>{
    dispatch(fetchProductsAction())
  }, [dispatch])

  const handleDelete = async () => {
    if (deleteModal.product) {
      try {
        await dispatch(deleteProduct(deleteModal.product.id)).unwrap()
        toast.success('Produit supprimé avec succès')
        setDeleteModal({ isOpen: false, product: null })
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.category === 'Toutes' || product.category === filters.category
    const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice)
    const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice)
    const matchesMinQuantity = !filters.minQuantity || product.quantity >= parseInt(filters.minQuantity)
    const matchesMaxQuantity = !filters.maxQuantity || product.quantity <= parseInt(filters.maxQuantity)
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesMinQuantity && matchesMaxQuantity
  })

  filteredProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0
    if (filters.sortBy === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (filters.sortBy === 'quantity') {
      comparison = a.quantity - b.quantity
    } else if (filters.sortBy === 'price') {
      comparison = a.price - b.price
    }
    return filters.sortOrder === 'asc' ? comparison : -comparison
  })

  const resetFilters = () => {
    setFilters({
      category: 'Toutes',
      minPrice: '',
      maxPrice: '',
      minQuantity: '',
      maxQuantity: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setSearchTerm('')
  }

  const activeFiltersCount = () => {
    let count = 0
    if (filters.category !== 'Toutes') count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.minQuantity) count++
    if (filters.maxQuantity) count++
    if (filters.sortBy !== 'name') count++
    if (filters.sortOrder !== 'asc') count++
    return count
  }

  const categories = ['Toutes', ...new Set(products.map((product) => product.category))]

  const productsWithSales = filteredProducts.map((product) => ({
    ...product,
    sales: Math.floor(Math.random() * 500) + 100,
  }))

  const totalPages = Math.ceil(productsWithSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = productsWithSales.slice(startIndex, endIndex)

   useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }
    return (
    <></>
  )
}