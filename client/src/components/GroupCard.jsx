import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { calculateSettlements } from '../utils/storage';

const GroupCard = ({ group, onAddExpense, onDeleteGroup, onDeleteExpense }) => {
  const settlements = calculateSettlements(group);

  return (
    <div className="group-card">
      <div className="group-header">
        <h3>{group.name}</h3>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => onAddExpense(group.id)}>
            <Plus size={16} /> Add expense
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => onDeleteGroup(group.id)}>
            <Trash2 size={16} /> Delete group
          </button>
        </div>
      </div>
      
      <div className="group-members">
        <span>Members:</span>
        {group.members && group.members.map(member => (
          <span key={member} className="member-badge">{member}</span>
        ))}
      </div>
      
      {group.expenses && group.expenses.length > 0 && (
        <div className="group-expenses">
          {group.expenses.map(expense => (
            <div key={expense.id} className="group-expense-item">
              <div>
                <div>{expense.title} - ₹{expense.amount}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Paid by {expense.paidBy} | Split between {expense.participants?.length || 0} people
                </div>
              </div>
              <button className="btn-icon btn-icon-sm" onClick={() => onDeleteExpense(group.id, expense.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="group-settlements">
        {settlements && settlements.length > 0 ? (
          <>
            <h4>Settlements</h4>
            {settlements.map((settlement, idx) => (
              <div key={idx} className="settlement-item">
                <span>{settlement.from} owes {settlement.to}</span>
                <span>₹{settlement.amount}</span>
              </div>
            ))}
          </>
        ) : (
          group.expenses && group.expenses.length > 0 ? (
            <div>All settled up! ✓</div>
          ) : (
            <div>No expenses yet</div>
          )
        )}
      </div>
    </div>
  );
};

export default GroupCard;
