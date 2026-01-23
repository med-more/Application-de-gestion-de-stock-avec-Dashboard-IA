import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import salesReducer from './slices/salesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    sales: salesReducer,
  },
})

