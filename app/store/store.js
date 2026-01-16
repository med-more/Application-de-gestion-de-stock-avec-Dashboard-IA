export const selectAllProducts = (state) => state.products.items
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

export const selectProductById = (state, productId) =>
    state.products.items.find((product) => product.id === parseInt(productId))

export const selectProductsByCategory = (state, categoy) => 
    state.products.items.filter((product) => product.categoy === categoy)

export const selectAllSales = (state) => state.sales.items
export const selectSalesLoading = (state) => state.sales.loading
export const selectSalesError = (state) => state.sales.error

export const selectTotalStock = (state) => {
    return state.products.items.reduce((total, product) => total + product.quantity, 0)
}