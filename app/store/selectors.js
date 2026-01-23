export const selectAllProducts = (state) => state.products.items
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

export const selectProductById = (state, productId) =>
  state.products.items.find((product) => product.id === parseInt(productId))

export const selectProductsByCategory = (state, category) =>
  state.products.items.filter((product) => product.category === category)


export const selectAllSales = (state) => state.sales.items
export const selectSalesLoading = (state) => state.sales.loading
export const selectSalesError = (state) => state.sales.error


export const selectTotalStock = (state) => {
  return state.products.items.reduce((total, product) => total + product.quantity, 0)
}

export const selectTotalStockValue = (state) => {
  return state.products.items.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  )
}

export const selectTotalProductsSold = (state) => {
  return state.sales.items.reduce((total, sale) => total + sale.quantity, 0)
}

export const selectTotalSalesValue = (state) => {
  return state.sales.items.reduce((total, sale) => total + sale.totalPrice, 0)
}

export const selectSalesByCategory = (state, category) =>
  state.sales.items.filter((sale) => sale.category === category)

