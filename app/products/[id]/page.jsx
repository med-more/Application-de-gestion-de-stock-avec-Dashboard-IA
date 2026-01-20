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

  useEffect(() => {
    dispatch(fetchProductsAction())
  }, [dispatch])

  const handleUpdate = async (formData) =>{
    try {
      await dispatch(updateProduct({ id: parseInt(productId), ...formData })).unwrap()
      toast.success('Produit modifié avec succès')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erreur lors de la modification')
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(parseInt(productId))).unwrap()
      toast.success('Produit supprimé avec succès')
      router.push('/products')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading && !product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Produit non trouvé</p>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retour à la liste
          </Link>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <div>page</div>
  )
}

export default page