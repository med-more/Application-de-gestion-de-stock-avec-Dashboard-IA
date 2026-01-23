
import productsReducer, {
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct
} from '../productsSlice'

global.fetch = jest.fn()

describe('productsSlice', () => {
    const initialState = {
        items: [],
        loading: false,
        error: null,
    }

    it('should handle initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('fetchProducts', () => {
        it('should handle pending', () => {
            const action = { type: fetchProducts.pending.type }
            const state = productsReducer(initialState, action)
            expect(state.loading).toBe(true)
            expect(state.error).toBeNull()
        })

        it('should handle fulfilled', () => {
            const mockProducts = [{ id: 1, name: 'Test' }]
            const action = { type: fetchProducts.fulfilled.type, payload: mockProducts }
            const state = productsReducer(initialState, action)
            expect(state.loading).toBe(false)
            expect(state.items).toEqual(mockProducts)
        })

        it('should handle rejected', () => {
            const error = { message: 'Failed' }
            const action = { type: fetchProducts.rejected.type, error }
            const state = productsReducer(initialState, action)
            expect(state.loading).toBe(false)
            expect(state.error).toBe('Failed')
        })
    })

    describe('addProduct', () => {
        it('should add item on fulfilled', () => {
            const newItem = { id: 2, name: 'New' }
            const action = { type: addProduct.fulfilled.type, payload: newItem }
            const state = productsReducer(initialState, action)
            expect(state.items).toContainEqual(newItem)
        })
    })

    describe('deleteProduct', () => {
        it('should remove item on fulfilled', () => {
            const startState = {
                ...initialState,
                items: [{ id: 1, name: 'Test' }]
            }
            const action = { type: deleteProduct.fulfilled.type, payload: 1 }
            const state = productsReducer(startState, action)
            expect(state.items).toHaveLength(0)
        })
    })
})
