import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Modal from '../components/Modal';
import { getExpenses, addExpense, updateExpense, deleteExpense, CATEGORIES } from '../utils/storage';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('date-desc');

  const loadExpenses = () => {
    setExpenses(getExpenses());
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = (expenseData) => {
    addExpense(expenseData);
    loadExpenses();
    setShowForm(false);
  };

  const handleEdit = (expenseData) => {
    updateExpense(editingExpense.id, expenseData);
    loadExpenses();
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      loadExpenses();
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Filter and Sort
  let filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  filteredExpenses.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.amount - a.amount;
    if (sortBy === 'amount-low') return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Expenses</h1>
            <p>Manage your daily transactions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search expenses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="form-select filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All Categories">All Categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select 
          className="form-select filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-high">Amount (High)</option>
          <option value="amount-low">Amount (Low)</option>
        </select>
      </div>

      <ExpenseList 
        expenses={filteredExpenses} 
        onEdit={openEditModal} 
        onDelete={handleDelete} 
      />

      <Modal 
        isOpen={showForm} 
        onClose={() => { setShowForm(false); setEditingExpense(null); }}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm 
          initialData={editingExpense} 
          onSubmit={editingExpense ? handleEdit : handleAdd} 
          onCancel={() => { setShowForm(false); setEditingExpense(null); }}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
