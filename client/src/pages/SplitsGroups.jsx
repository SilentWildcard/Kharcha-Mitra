import React, { useState, useEffect } from 'react';
import GroupCard from '../components/GroupCard';
import Modal from '../components/Modal';
import { getGroups, addGroup, deleteGroup, addGroupExpense, deleteGroupExpense } from '../utils/storage';

const SplitsGroups = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(null); // groupId
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');

  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('You');
  const [expSplitBetween, setExpSplitBetween] = useState([]);
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expError, setExpError] = useState('');

  const loadGroups = () => {
    setGroups(getGroups());
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    let membersList = newGroupMembers.split(',').map(m => m.trim()).filter(m => m);
    if (!membersList.includes('You')) {
      membersList.unshift('You');
    }

    if (membersList.length < 2) {
      alert("Please add at least one other member besides 'You'.");
      return;
    }

    addGroup({ name: newGroupName, members: membersList });
    loadGroups();
    setShowCreateGroup(false);
    setNewGroupName('');
    setNewGroupMembers('');
  };

  const openAddExpenseModal = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setExpTitle('');
      setExpAmount('');
      setExpPaidBy('You');
      setExpSplitBetween([...group.members]);
      setExpDate(new Date().toISOString().split('T')[0]);
      setExpError('');
      setShowAddExpense(groupId);
    }
  };

  const handleAddGroupExpense = (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount || expSplitBetween.length === 0) {
      setExpError('Please fill all required fields and select at least one person to split.');
      return;
    }

    addGroupExpense(showAddExpense, {
      title: expTitle,
      amount: parseFloat(expAmount),
      paidBy: expPaidBy,
      participants: expSplitBetween,
      splitBetween: expSplitBetween,
      date: expDate
    });

    loadGroups();
    setShowAddExpense(null);
  };

  const handleSplitCheckboxChange = (member) => {
    setExpSplitBetween(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group? All expenses will be lost.')) {
      deleteGroup(groupId);
      loadGroups();
    }
  };

  const handleDeleteExpense = (groupId, expenseId) => {
    deleteGroupExpense(groupId, expenseId);
    loadGroups();
  };

  return (
    <div className="splits-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Splits & Groups</h1>
            <p>Manage shared expenses with friends and family</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
            Create Group
          </button>
        </div>
      </div>

      <div className="groups-grid">
        {groups.length > 0 ? (
          groups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onAddExpense={() => openAddExpenseModal(group.id)}
              onDeleteGroup={() => handleDeleteGroup(group.id)}
              onDeleteExpense={(expId) => handleDeleteExpense(group.id, expId)}
            />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <p className="empty-state-text">No groups created yet.</p>
            <button className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
              Create Your First Group
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <Modal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} title="Create New Group">
        <form className="create-group-form" onSubmit={handleCreateGroup}>
          <div className="form-group">
            <label className="form-label">Group Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={newGroupName} 
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="e.g. Goa Trip, Apartment"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Members (comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              value={newGroupMembers} 
              onChange={e => setNewGroupMembers(e.target.value)}
              placeholder="e.g. Rahul, Aryan, Riya"
            />
            <p className="members-note">'You' will be automatically added as a member.</p>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateGroup(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Group</button>
          </div>
        </form>
      </Modal>

      {/* Add Group Expense Modal */}
      <Modal isOpen={!!showAddExpense} onClose={() => setShowAddExpense(null)} title="Add Group Expense">
        <form onSubmit={handleAddGroupExpense}>
          {expError && <div className="form-error">{expError}</div>}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input 
              type="text" 
              className="form-input" 
              value={expTitle} 
              onChange={e => setExpTitle(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input 
              type="number" 
              className="form-input" 
              min="0" 
              step="0.01" 
              value={expAmount} 
              onChange={e => setExpAmount(e.target.value)}
              required 
            />
          </div>
          
          {showAddExpense && (() => {
            const group = groups.find(g => g.id === showAddExpense);
            return (
              <>
                <div className="form-group">
                  <label className="form-label">Paid By</label>
                  <select 
                    className="form-select" 
                    value={expPaidBy} 
                    onChange={e => setExpPaidBy(e.target.value)}
                  >
                    {group.members.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Split Between</label>
                  <div className="checkbox-group">
                    {group.members.map(m => (
                      <label key={m} className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={expSplitBetween.includes(m)}
                          onChange={() => handleSplitCheckboxChange(m)}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
          
          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={expDate} 
              onChange={e => setExpDate(e.target.value)}
              required 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpense(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SplitsGroups;
