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
  const dispatch = useDispatch()
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  const product = useSelector((state) => selectProductById(state, productId))
  const loading = useSelector(selectProductsLoading)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  
  return (
    <div>page</div>
  )
}

export default page