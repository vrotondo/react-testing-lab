import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionsList from '../../components/TransactionsList'
import AccountContainer from '../../components/AccountContainer'

const mockTransactions = [
    {
        id: "1",
        date: "2022-01-01",
        description: "Test Transaction",
        category: "Test",
        amount: 100
    },
    {
        id: "2",
        date: "2022-01-02",
        description: "Another Transaction",
        category: "Food",
        amount: 50
    }
]

describe('TransactionsList Component', () => {
    test('renders transactions passed as props', () => {
        render(<TransactionsList transactions={mockTransactions} />)

        // Check if the transaction details are displayed
        expect(screen.getByText('Test Transaction')).toBeInTheDocument()
        expect(screen.getByText('Another Transaction')).toBeInTheDocument()
        expect(screen.getByText('Test')).toBeInTheDocument()
        expect(screen.getByText('Food')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
    })
})

describe('AccountContainer Component', () => {
    beforeEach(() => {
        // Mock the fetch response
        global.setFetchResponse(mockTransactions)
    })

    test('fetches and displays transactions on load', async () => {
        render(<AccountContainer />)

        // Check if the fetch was called
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:6001/transactions')

        // Wait for transactions to be displayed
        const testTransaction = await screen.findByText('Test Transaction')
        expect(testTransaction).toBeInTheDocument()

        // Check other transaction details
        expect(await screen.findByText('Another Transaction')).toBeInTheDocument()
        expect(await screen.findByText('Test')).toBeInTheDocument()
        expect(await screen.findByText('Food')).toBeInTheDocument()
    })
})