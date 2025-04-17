import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddTransactionForm from '../../components/AddTransactionForm'
import AccountContainer from '../../components/AccountContainer'

describe('AddTransactionForm Component', () => {
    test('calls postTransaction with form data when submitted', () => {
        // Create a mock function
        const mockPostTransaction = vi.fn()

        // Render the component with the mock function
        render(<AddTransactionForm postTransaction={mockPostTransaction} />)

        // Fill in the form
        const dateInput = screen.getByDisplayValue('')
        const descriptionInput = screen.getByPlaceholderText('Description')
        const categoryInput = screen.getByPlaceholderText('Category')
        const amountInput = screen.getByPlaceholderText('Amount')

        fireEvent.change(dateInput, { target: { value: '2023-01-01' } })
        fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } })
        fireEvent.change(categoryInput, { target: { value: 'Test Category' } })
        fireEvent.change(amountInput, { target: { value: '100' } })

        // Submit the form
        const form = screen.getByRole('button', { name: /add transaction/i })
        fireEvent.click(form)

        // Check if postTransaction was called with the correct data
        expect(mockPostTransaction).toHaveBeenCalledWith({
            date: '2023-01-01',
            description: 'Test Transaction',
            category: 'Test Category',
            amount: '100'
        })
    })
})

describe('AccountContainer Add Transaction', () => {
    beforeEach(() => {
        // Mock initial fetch
        global.setFetchResponse([])
    })

    test('adds a new transaction to the UI and makes a POST request', async () => {
        // Render the component
        render(<AccountContainer />)

        // Mock the POST response
        global.fetch = vi.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                id: "99",
                date: "2023-01-01",
                description: "New Test Transaction",
                category: "New Category",
                amount: "200"
            }),
            ok: true,
            status: 200
        }))

        // Fill in the form
        const dateInput = screen.getByDisplayValue('')
        const descriptionInput = screen.getByPlaceholderText('Description')
        const categoryInput = screen.getByPlaceholderText('Category')
        const amountInput = screen.getByPlaceholderText('Amount')

        fireEvent.change(dateInput, { target: { value: '2023-01-01' } })
        fireEvent.change(descriptionInput, { target: { value: 'New Test Transaction' } })
        fireEvent.change(categoryInput, { target: { value: 'New Category' } })
        fireEvent.change(amountInput, { target: { value: '200' } })

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /add transaction/i })
        fireEvent.click(submitButton)

        // Check if fetch was called correctly for POST
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:6001/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: '2023-01-01',
                description: 'New Test Transaction',
                category: 'New Category',
                amount: '200'
            })
        })

        // Check if new transaction appears in the UI
        const newTransaction = await screen.findByText('New Test Transaction')
        expect(newTransaction).toBeInTheDocument()
        expect(await screen.findByText('New Category')).toBeInTheDocument()
        expect(await screen.findByText('200')).toBeInTheDocument()
    })
})