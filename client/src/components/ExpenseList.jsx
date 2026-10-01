import React from 'react';
import { Receipt, Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/storage';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <Receipt size={48} />
        <h3>No expenses found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <div key={expense.id || expense.title + expense.date} className="expense-item">
          <div className="expense-info">
            <div className="expense-title">{expense.title}</div>
            <div className="expense-meta">
              <span 
                className="category-badge" 
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other }}
              >
                {expense.category}
              </span>
              <span>
                {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {expense.note && <div className="expense-note">{expense.note}</div>}
          </div>
          <div className="expense-right">
            <div className="expense-amount">
              ₹{expense.amount.toLocaleString('en-IN')}
            </div>
            <div className="expense-actions">
              <button className="btn-icon" onClick={() => onEdit(expense)}>
                <Pencil size={16} />
              </button>
              <button className="btn-icon" onClick={() => onDelete(expense.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
