import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import ConfirmModal from '../../components/Modal/ConfirmModal'
import {
  fetchProducts as fetchProductsAction,
  updateProduct,
  deleteProduct,
} from '../../store/slices/productsSlice'
import {
  selectProductById,
  selectProductsLoading,
} from '../../store/selectors'
import { ArrowLeft, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page