export const selectAllProducts = (state) => state.products.items
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

export const selectProductById = (state, productId) =>
    state.products.items.find((product) => product.id === parseInt(productId))

export const selectProductsByCategory = (state, categoy) => 
    state.products.items.filter((product) => product.categoy === categoy)