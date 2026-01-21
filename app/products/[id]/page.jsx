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
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </Link>

        {isEditing ? (
          <ProductForm
            product={product}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={loading}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">{product.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">Catégorie: {product.category}</p>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Modifier</span>
                  <span className="sm:hidden">Edit</span>
                </button>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Product Code</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.code || 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Category</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.category || 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Brand</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.brand || 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Tags</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.tags || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Pricing & Stock</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Price</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900">
                      ${product.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Cost Price</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.costPrice ? `$${parseFloat(product.costPrice).toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Bulk Discount Price</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.bulkPrice ? `$${parseFloat(product.bulkPrice).toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Tax Rate</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {product.taxRate ? `${product.taxRate}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Quantity in Stock</span>
                    <span className={`text-sm sm:text-base font-bold ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.quantity || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Stock Value</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900">
                      ${((product.quantity || 0) * (product.price || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm sm:text-base text-gray-700 break-words whitespace-pre-line">
                  {product.description || 'Aucune description disponible'}
                </p>
              </div>
            </div>

            {product.image && (
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Image</h3>
                <div className="w-full overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`}
      />
    </DashboardLayout>
  )
}

export default page