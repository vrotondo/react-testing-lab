import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

/**
 * AccountContainer component
 * 
 * This component serves as the main container for the banking application.
 * It manages state for transactions, search, and sorting, as well as
 * handling API calls for fetching and posting transactions.
 */
function AccountContainer() {
  // State for storing transactions fetched from the API
  const [transactions, setTransactions] = useState([]);
  // State for storing the current search term
  const [search, setSearch] = useState("");
  // State for storing the current sort criteria
  const [sortBy, setSortBy] = useState("description");

  /**
   * Effect hook to fetch transactions from the API when the component mounts
   */
  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then(r => r.json())
      .then(data => setTransactions(data))
      .catch(error => console.error("Error fetching transactions:", error));
  }, []);

  /**
   * Posts a new transaction to the API and updates the local state
   * 
   * @param {Object} newTransaction - The transaction to be added
   */
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
      .catch(error => console.error("Error adding transaction:", error));
  }

  /**
   * Handler for when the sort criteria changes
   * 
   * @param {string} sortByValue - The field to sort by ("description" or "category")
   */
  function onSort(sortByValue) {
    setSortBy(sortByValue);
  }

  /**
   * Filter and sort transactions based on search term and sort criteria
   * 
   * This creates a filtered and sorted version of the transactions array
   * that is passed to the TransactionsList component
   */
  const filteredAndSortedTransactions = transactions
    // First filter transactions based on search term
    .filter(transaction => {
      // If no search term, return all transactions
      if (!search) return true;

      // Search in description and category (case insensitive)
      const descriptionMatch = transaction.description.toLowerCase().includes(search.toLowerCase());
      const categoryMatch = transaction.category.toLowerCase().includes(search.toLowerCase());

      // Return transactions that match either description or category
      return descriptionMatch || categoryMatch;
    })
    // Then sort the filtered transactions
    .sort((a, b) => {
      // Sort by the selected field
      if (sortBy === "description") {
        return a.description.localeCompare(b.description);
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0; // Default case
    });

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