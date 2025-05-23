import React, { createContext, useState } from 'react';

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now().toString() }; // Generate a unique ID
    setBalance((prevBalance) => prevBalance - parseFloat(expense.amount));
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    console.log("Attempting to delete expense with ID:", id); // Debug log
    const expenseToDelete = expenses.find((exp) => exp.id === id);
    if (!expenseToDelete) {
      console.log("Expense not found"); // Debug log if not found
      return;
    }

    setBalance((prev) => prev + parseFloat(expenseToDelete.amount));
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const updateExpense = (updatedExpense) => {
    const prevExpense = expenses.find((exp) => exp.id === updatedExpense.id);
    if (!prevExpense) return;

    const updatedAmount = parseFloat(updatedExpense.amount);
    const oldAmount = parseFloat(prevExpense.amount);

    // Update balance with the difference
    setBalance((prev) => prev + oldAmount - updatedAmount);

    setExpenses((prev) =>
      prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    );

    // Clear the editingExpense after update
    setEditingExpense(null);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        editingExpense,
        setEditingExpense,
        balance,
        setBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

