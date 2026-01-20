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
    const columns = [
    {
      header: 'PRODUCT',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-xs sm:text-sm">
              {row.name?.charAt(0).toUpperCase() || 'P'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{row.name}</div>
            <div className="text-xs text-gray-500 hidden sm:block">ID: {String(row.id).padStart(8, '0')}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'PRICE',
      accessor: 'price',
      render: (row) => (
        <span className="font-semibold text-gray-900 text-xs sm:text-sm">${row.price.toFixed(2)}</span>
      ),
    },
    {
      header: 'QUANTITY',
      accessor: 'quantity',
      render: (row) => (
        <span className={`text-xs sm:text-sm ${row.quantity < 10 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
          {row.quantity}
        </span>
      ),
    },
    {
      header: 'SALES',
      accessor: 'sales',
      render: (row) => {
        const sales = row.sales || 0
        const maxSales = 500
        const percentage = (sales / maxSales) * 100
        const color = percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-orange-500' : 'bg-red-500'
        
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{sales} Sales</span>
            <div className="flex-1 max-w-[60px] sm:max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
              <div
                className={`h-full ${color} rounded-full transition-all`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'ACTIONS',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-1 sm:gap-2">
          <Link
            href={`/products/${row.id}`}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteModal({ isOpen: true, product: row })
            }}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex gap-3">
            <Link
              href="/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add products</span>
            </Link>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterOpen || activeFiltersCount() > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <Filter className={`w-4 h-4 ${filterOpen || activeFiltersCount() > 0 ? 'text-white' : 'text-blue-600'}`} />
                <span>Filter</span>
                {activeFiltersCount() > 0 && (
                  <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount()}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>


              <AnimatePresence>
                {filterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setFilterOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            Filters
                          </h3>
                          <button
                            onClick={() => setFilterOpen(false)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                          >
                            <option value="Toutes">All Categories</option>
                            {categories.filter(cat => cat !== 'Toutes').map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={filters.minPrice}
                                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                  className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                  type="number"
                                  placeholder="∞"
                                  value={filters.maxPrice}
                                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                  className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity Range
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Min Quantity</label>
                              <input
                                type="number"
                                placeholder="0"
                                value={filters.minQuantity}
                                onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Max Quantity</label>
                              <input
                                type="number"
                                placeholder="∞"
                                value={filters.maxQuantity}
                                onChange={(e) => handleFilterChange('maxQuantity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <div className="space-y-2">
                            <select
                              value={filters.sortBy}
                              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            >
                              <option value="name">Name</option>
                              <option value="price">Price</option>
                              <option value="quantity">Quantity</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFilterChange('sortOrder', 'asc')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  filters.sortOrder === 'asc'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Ascending
                              </button>
                              <button
                                onClick={() => handleFilterChange('sortOrder', 'desc')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  filters.sortOrder === 'desc'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Descending
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                        <button
                          onClick={resetFilters}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors text-sm font-medium"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setFilterOpen(false)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : (
            <DataTable
              columns={columns}
              data={paginatedProducts}
              onRowClick={(row) => router.push(`/products/${row.id}`)}
            />
          )}
        </div>


        {!loading && productsWithSales.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Affichage de {startIndex + 1} à {Math.min(endIndex, productsWithSales.length)} sur {productsWithSales.length}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                &lt;
              </button>
              

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {

                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>
                }
                return null
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                &gt;
              </button>
              
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.product?.name}" ?`}
      />
    </DashboardLayout>
  )
}