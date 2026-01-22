'use client'

import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductForm({ product, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    description: '',
    image: '',
  })

  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        description: product.description || '',
        image: product.image || '',
      })
      setImagePreview(product.image || '')
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)

    try {
      const formDataToUpload = new FormData()
      formDataToUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload')
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
      toast.success('Image uploadée avec succès')
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }))
    setImagePreview('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Le nom du produit est requis')
      return
    }
    if (!formData.category.trim()) {
      toast.error('La catégorie est requise')
      return
    }
    if (formData.price <= 0) {
      toast.error('Le prix doit être supérieur à 0')
      return
    }
    if (formData.quantity < 0) {
      toast.error('La quantité ne peut pas être négative')
      return
    }

    onSubmit(formData)
  }

  const categories = ['Électronique', 'Mobilier', 'Accessoires', 'Vêtements', 'Alimentation', 'Autre']

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8">
      <div className="space-y-6 sm:space-y-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-gray-400"
              placeholder="Ex: Ordinateur Portable"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Prix ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>
        </div>


        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 resize-none placeholder:text-gray-400"
            placeholder="Description du produit..."
          />
        </div>


        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            Image du produit
          </label>
          {imagePreview ? (
            <div className="relative inline-block group">
              <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  <span className="text-blue-600">Cliquer pour uploader</span> ou glisser-déposer
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
          {uploading && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-600 font-medium">Upload en cours...</p>
            </div>
          )}
        </div>


        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200/50">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            disabled={isLoading || uploading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                {product ? 'Modifier le produit' : 'Ajouter le produit'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
