import React, { useState, useEffect } from 'react';
import { Wallet, PiggyBank, FileText, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getExpenses, getBudget, CATEGORY_COLORS } from '../utils/storage';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

const Dashboard = ({ onNavigate }) => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget, setBudget] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [topCategory, setTopCategory] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const expenses = getExpenses();
    const currentBudget = getBudget();
    
    setBudget(currentBudget);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const spent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalSpent(spent);
    setTotalTransactions(currentMonthExpenses.length);

    const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    let topCat = '';
    let maxSpent = 0;
    const catData = [];
    
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxSpent) {
        maxSpent = amount;
        topCat = cat;
      }
      catData.push({ name: cat, value: amount });
    });

    setTopCategory(topCat);
    setCategoryData(catData);

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    setRecentExpenses(sortedExpenses);

  }, []);

  const remaining = budget - totalSpent;
  const budgetPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  let progressColor = '#22c55e'; // green
  if (budgetPercent >= 60 && budgetPercent <= 85) progressColor = '#f59e0b'; // warning/yellow
  else if (budgetPercent > 85) progressColor = '#ef4444'; // red

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Dashboard</h1>
            <p>Your financial overview</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Monthly Spending" 
          value={`₹${totalSpent.toLocaleString('en-IN')}`} 
          icon={Wallet} 
          color="#6366f1" 
          subtitle={`of ₹${budget.toLocaleString('en-IN')} budget`} 
        />
        <StatCard 
          title="Remaining" 
          value={`₹${remaining.toLocaleString('en-IN')}`} 
          icon={PiggyBank} 
          color={remaining >= 0 ? '#22c55e' : '#ef4444'} 
          subtitle={`${budget > 0 ? (100 - budgetPercent).toFixed(0) : 0}% of budget left`} 
        />
        <StatCard 
          title="Transactions" 
          value={totalTransactions} 
          icon={FileText} 
          color="#3b82f6" 
          subtitle="this month" 
        />
        <StatCard 
          title="Top Category" 
          value={topCategory || 'N/A'} 
          icon={TrendingUp} 
          color="#f97316" 
          subtitle="highest spending" 
        />
      </div>

      <div className="budget-progress-section card">
        <div className="budget-progress-header">
          <h3>Budget Usage</h3>
          <span>{budgetPercent.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${budgetPercent}%`, backgroundColor: progressColor }}
          ></div>
        </div>
        <div className="budget-progress-stats">
          <span>Spent: <strong>₹{totalSpent.toLocaleString('en-IN')}</strong></span>
          <span>Budget: <strong>₹{budget.toLocaleString('en-IN')}</strong></span>
          <span>Remaining: <strong>₹{remaining.toLocaleString('en-IN')}</strong></span>
        </div>
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Spending by Category">
          {categoryData.length > 0 ? (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No spending data for this month.</p>
            </div>
          )}
        </ChartCard>

        <div className="card">
          <div className="recent-expenses-header">
            <h3>Recent Expenses</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('expenses')}>
              View all
            </button>
          </div>
          <div className="recent-expenses-list">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="recent-expense-item">
                  <div className="expense-info">
                    <span className="expense-title">{expense.title}</span>
                    <div className="expense-meta">
                      <span 
                        className="category-badge" 
                        style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#94a3b8' }}
                      >
                        {expense.category}
                      </span>
                      <span>{new Date(expense.date).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="expense-amount">
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="empty-state-text">No recent expenses.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('expenses')}>
                  Add Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
