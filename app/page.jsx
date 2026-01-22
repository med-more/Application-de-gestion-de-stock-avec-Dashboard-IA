'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import DashboardLayout from './components/Layout/DashboardLayout'
import StatCard from './components/Cards/StatCard'
import SalesChart from './components/Charts/SalesChart'
import DataTable from './components/Table/DataTable'
import {
  selectAllProducts,
  selectAllSales,
  selectTotalStock,
  selectTotalStockValue,
  selectTotalProductsSold,
  selectTotalSalesValue,
} from './store/selectors'
import { fetchProducts as fetchProductsAction } from './store/slices/productsSlice'
import { fetchSales as fetchSalesActionFromSlice } from './store/slices/salesSlice'
import { DollarSign, ShoppingCart, Eye, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { generateSalesAnalysis } from './services/aiService'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const sales = useSelector(selectAllSales)
  const totalStock = useSelector(selectTotalStock)
  const totalStockValue = useSelector(selectTotalStockValue)
  const totalProductsSold = useSelector(selectTotalProductsSold)
  const totalSalesValue = useSelector(selectTotalSalesValue)
  
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    dispatch(fetchProductsAction())
    dispatch(fetchSalesActionFromSlice())
  }, [dispatch])

  useEffect(() => {
    if (sales.length > 0) {
      generateAnalysis()
    }
  }, [sales])

  const generateAnalysis = async () => {
    setIsLoadingAI(true)
    try {
      const analysis = await generateSalesAnalysis(sales)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('Erreur détaillée:', error)
      const errorMessage = error.message || 'Erreur lors de la génération de l\'analyse IA'
      toast.error(errorMessage, { duration: 5000 })
    } finally {
      setIsLoadingAI(false)
    }
  }


  const filteredSales = selectedCategory === 'Toutes'
    ? sales
    : sales.filter((sale) => sale.category === selectedCategory)


    const sortedSales = [...filteredSales].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === 'quantity') {
      return b.quantity - a.quantity
    }
    return 0
  })


  const salesWithStatus = sortedSales.map((sale, index) => ({
    ...sale,
    status: index % 3 === 0 ? 'Paid' : index % 3 === 1 ? 'Pending' : 'Failed',
    customerName: sale.productName || 'Customer',
  }))


  const salesColumns = [
    { header: 'ORDER', accessor: 'id' },
    { header: 'STATUS', accessor: 'status' },
    { header: 'DATE', accessor: 'date' },
    { header: 'CUSTOMER', accessor: 'customerName' },
    {
      header: 'AMOUNT SPENT',
      accessor: 'totalPrice',
      render: (row) => `$${((row.totalPrice || row.quantity * row.unitPrice) || 0).toFixed(2)}`,
    },
  ]

  const categories = ['Toutes', ...new Set(sales.map((sale) => sale.category))]


  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >



            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    Overview
                  </h2>
                  <p className="text-sm text-gray-600">Bienvenue sur votre tableau de bord</p>
                </div>
                <select className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>




              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <StatCard
                  title="Total profit"
                  value={`$${totalSalesValue.toFixed(2)}`}
                  icon={DollarSign}
                  color="green"
                  change="3.4%"
                  changeType="positive"
                />
                <StatCard
                  title="Total order"
                  value={totalProductsSold.toString()}
                  icon={ShoppingCart}
                  color="blue"
                  change="2.8%"
                  changeType="negative"
                />
                <StatCard
                  title="Impression"
                  value="3.1M"
                  icon={Eye}
                  color="orange"
                  change="4.6%"
                  changeType="positive"
                />
              </div>



              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 7 days</span>
                </div>
                <SalesChart sales={sales} type="line" />
              </motion.div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Top Products</h3>
                  <Link
                    href="/products"
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Stock: {product.quantity || 0} units</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0 bg-gray-100 px-3 py-1 rounded-lg">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>



              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Sales Target</h3>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🎯</span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {totalProductsSold} / 1.8K
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Units sold this month</p>
                </div>
                <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalProductsSold / 1800) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-lg"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-4 flex items-center gap-2">
                  <span className="text-lg">{Math.round((totalProductsSold / 1800) * 100)}%</span>
                  <span className="text-gray-500">Complete</span>
                </p>
              </motion.div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group"
              >

                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
                
                {isLoadingAI ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center shadow-lg">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">Analyse en cours...</h4>
                      <p className="text-sm text-gray-500">L'IA génère votre analyse</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">

                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Analyse IA</h3>
                        <p className="text-xs text-gray-500 font-medium">Intelligence artificielle • Insights automatiques</p>
                      </div>
                    </div>


                    <div className="pt-2">
                      {aiAnalysis ? (
                        <div className="space-y-3">
                          <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-blue-50/50 rounded-xl p-4 border border-purple-100/50">
                            <p className="text-sm leading-relaxed text-gray-700 line-clamp-6">
                              {aiAnalysis}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Analyse générée par IA</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">En attente de données pour l'analyse</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>


              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h3>
                  <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200">
                    View Orders →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <DataTable columns={salesColumns} data={salesWithStatus.slice(0, 5)} />
                </div>
              </motion.div>
            </div>
          </motion.div>
    </DashboardLayout>
  )
}
