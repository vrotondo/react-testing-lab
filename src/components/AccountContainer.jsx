import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("description")

  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then(r => r.json())
      .then(data => setTransactions(data))
  }, [])

  function postTransaction(newTransaction) {
    fetch('http://localhost:6001/transactions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
      .then(r => r.json())
      .then(data => setTransactions([...transactions, data]))
  }

  // Sort function implementation
  function onSort(sortByValue) {
    setSortBy(sortByValue)
  }

  // Filter using search and implement sort
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // If no search term, return all transactions
      if (!search) return true

      // Search in description and category (case insensitive)
      const descriptionMatch = transaction.description.toLowerCase().includes(search.toLowerCase())
      const categoryMatch = transaction.category.toLowerCase().includes(search.toLowerCase())

      // Return transactions that match either description or category
      return descriptionMatch || categoryMatch
    })
    .sort((a, b) => {
      // Sort by the selected field (sortBy)
      // Handle sorting for description or category
      if (sortBy === "description") {
        return a.description.localeCompare(b.description)
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category)
      }
      return 0 // Default case
    })

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      <TransactionsList transactions={filteredAndSortedTransactions} />
    </div>
  );
}

export default AccountContainer;