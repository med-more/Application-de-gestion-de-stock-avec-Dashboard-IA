import { render, screen } from '@testing-library/react'
import StatCard from '../StatCard'
import { TrendingUp } from 'lucide-react'



describe('StatCard', () => {
    const defaultProps = {
        title: 'Total Stock',
        value: '150',
        icon: TrendingUp,
        color: 'blue',
        change: '+12%',
        changeType: 'positive'
    }

    it('renders the title and value correctly', () => {
        render(<StatCard {...defaultProps} />)

        expect(screen.getByText('Total Stock')).toBeInTheDocument()
        expect(screen.getByText('150')).toBeInTheDocument()
    })

    it('renders the change percentage and icon correctly', () => {
        render(<StatCard {...defaultProps} />)

        expect(screen.getByText('+12%')).toBeInTheDocument()
        const icon = document.querySelector('svg')
        expect(icon).toBeInTheDocument()
    })

    it('applies the correct color classes', () => {
        const { container } = render(<StatCard {...defaultProps} color="green" />)

        expect(screen.getByText('150')).toHaveClass('from-green-500')
    })

    it('displays negative change correctly', () => {
        render(<StatCard {...defaultProps} change="-5%" changeType="negative" />)

        expect(screen.getByText('-5%')).toBeInTheDocument()
        const changeBadge = screen.getByText('-5%').closest('div')
        expect(changeBadge).toHaveClass('bg-red-50 text-red-700')
    })
})
