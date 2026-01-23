import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../ProductForm'
import { act } from 'react-dom/test-utils'


jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn(),
}))


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'http://example.com/image.jpg' }),
    })
)

describe('ProductForm', () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders empty form correctly', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        expect(screen.getByLabelText(/Nom du produit/i)).toHaveValue('')
        expect(screen.getByLabelText(/Prix/i)).toHaveValue(0)
        expect(screen.getByText('Ajouter le produit')).toBeInTheDocument()
    })

    it('validates required fields', async () => {
        const user = userEvent.setup()
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)


        const submitBtn = screen.getByRole('button', { name: /Ajouter le produit/i })
        await user.click(submitBtn)

        
        
        expect(screen.getByLabelText(/Nom du produit/i)).toBeInvalid()
    })

    it('validates logical constraints (price > 0)', async () => {
        const user = userEvent.setup()
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)


        await user.type(screen.getByLabelText(/Nom du produit/i), 'Test Item')
        await user.selectOptions(screen.getByLabelText(/Catégorie/i), 'Mobilier')

        
        const submitBtn = screen.getByRole('button', { name: /Ajouter le produit/i })
        await user.click(submitBtn)

        expect(mockOnSubmit).not.toHaveBeenCalled()
        const toast = require('react-hot-toast')
        expect(toast.error).toHaveBeenCalledWith('Le prix doit être supérieur à 0')
    })

    it('fills form with product data in edit mode', () => {
        const product = {
            name: 'Test Product',
            category: 'Mobilier',
            quantity: 10,
            price: 99.99,
            description: 'A test description',
            image: 'test-image.jpg'
        }

        render(<ProductForm product={product} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        expect(screen.getByLabelText(/Nom du produit/i)).toHaveValue('Test Product')
        expect(screen.getByLabelText(/Catégorie/i)).toHaveValue('Mobilier')
        expect(screen.getByLabelText(/Prix/i)).toHaveValue(99.99)
        expect(screen.getByText('Modifier le produit')).toBeInTheDocument()
    })

    it('calls onSubmit with form data when valid', async () => {
        const user = userEvent.setup()
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        await user.type(screen.getByLabelText(/Nom du produit/i), 'New Item')
        await user.selectOptions(screen.getByLabelText(/Catégorie/i), 'Électronique')
        await user.clear(screen.getByLabelText(/Prix/i))
        await user.type(screen.getByLabelText(/Prix/i), '50')
        await user.clear(screen.getByLabelText(/Quantité/i))
        await user.type(screen.getByLabelText(/Quantité/i), '5')

        await user.click(screen.getByRole('button', { name: /Ajouter le produit/i }))

        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Item',
            category: 'Électronique',
            price: 50,
            quantity: 5
        }))
    })

    it('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        await user.click(screen.getByRole('button', { name: /Annuler/i }))
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
})
