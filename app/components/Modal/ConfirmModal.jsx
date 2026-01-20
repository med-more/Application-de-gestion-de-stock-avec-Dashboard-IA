import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if(!isOpen) return null
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


export default ConfirmModal