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
    return (
    <></>
  )
}