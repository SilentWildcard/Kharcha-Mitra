import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';

const ExpenseForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const parsedAmount = parseFloat(amount);
    
    if (!trimmedTitle) {
      setError('Title cannot be empty');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!category) {
      setError('Category must be selected');
      return;
    }

    setError('');
    onSubmit({
      title: trimmedTitle,
      amount: parsedAmount,
      category,
      date,
      note: note.trim()
    });

    if (!initialData) {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-group">
        <label className="form-label">Title</label>
        <input 
          type="text" 
          className="form-input" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Amount (₹)</label>
        <input 
          type="number" 
          className="form-input" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          min="0.01" 
          step="0.01" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Category</label>
        <select 
          className="form-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select category</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Date</label>
        <input 
          type="date" 
          className="form-input" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Note</label>
        <textarea 
          className="form-textarea" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={16} />
          {initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
