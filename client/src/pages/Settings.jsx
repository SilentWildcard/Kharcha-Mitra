import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';
import { 
  getBudget, saveBudget, clearAllExpenses, clearAllGroups, clearAllData, loadDemoData 
} from '../utils/storage';

const Settings = () => {
  const [budget, setBudgetState] = useState('');
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null); // 'expenses' | 'groups' | 'all'

  useEffect(() => {
    setBudgetState(getBudget().toString());
  }, []);

  const handleSaveBudget = () => {
    const val = parseFloat(budget);
    if (!isNaN(val) && val >= 0) {
      saveBudget(val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleConfirmAction = () => {
    if (showConfirm === 'expenses') clearAllExpenses();
    else if (showConfirm === 'groups') clearAllGroups();
    else if (showConfirm === 'all') clearAllData();
    
    setShowConfirm(null);
    window.location.reload();
  };

  const handleLoadDemo = () => {
    if (window.confirm("This will load demo data alongside your current data. Continue?")) {
      loadDemoData(true);
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <h3>Monthly Budget</h3>
          <p>Set your overall monthly budget target to track your spending progress.</p>
          <div className="settings-budget-input">
            <input 
              type="number" 
              className="form-input" 
              min="0" 
              value={budget} 
              onChange={(e) => setBudgetState(e.target.value)} 
            />
            <button className="btn btn-primary" onClick={handleSaveBudget}>Save</button>
          </div>
          {saved && <div className="budget-saved">✓ Budget saved!</div>}
        </div>

        <div className="card settings-card">
          <h3>Data Management</h3>
          <p>Manage your application data. Warning: these actions cannot be undone.</p>
          <div className="danger-zone">
            <div className="danger-zone-item">
              <div>
                <div className="label">Clear All Expenses</div>
                <div className="description">Delete all your recorded personal expenses</div>
              </div>
              <button className="btn btn-danger" onClick={() => setShowConfirm('expenses')}>Clear</button>
            </div>
            <div className="danger-zone-item">
              <div>
                <div className="label">Clear All Groups</div>
                <div className="description">Delete all groups and shared expenses</div>
              </div>
              <button className="btn btn-danger" onClick={() => setShowConfirm('groups')}>Clear</button>
            </div>
            <div className="danger-zone-item">
              <div>
                <div className="label">Reset All Data</div>
                <div className="description">Wipe everything and start fresh</div>
              </div>
              <button className="btn btn-danger" onClick={() => setShowConfirm('all')}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card settings-card">
          <h3>Demo Data</h3>
          <p>Populate the app with sample data to explore features.</p>
          <button className="btn btn-secondary" onClick={handleLoadDemo}>Load Demo Data</button>
        </div>

        <div className="card settings-card settings-about">
          <h3>Kharcha Mitra</h3>
          <p>Version 1.0</p>
          <p>Your friendly expense tracker</p>
        </div>
      </div>

      <Modal isOpen={!!showConfirm} onClose={() => setShowConfirm(null)} title="Confirm Action">
        <div className="confirm-modal-content">
          <AlertTriangle size={48} className="warning-icon" />
          <p>Are you sure you want to proceed?</p>
          <p><strong>This action cannot be undone.</strong></p>
          <div className="confirm-actions">
            <button className="btn btn-secondary" onClick={() => setShowConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleConfirmAction}>Yes, I'm sure</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
