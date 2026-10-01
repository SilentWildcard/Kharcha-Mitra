import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getExpenses, getBudget, CATEGORY_COLORS } from '../utils/storage';
import ChartCard from '../components/ChartCard';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ budget: 0, spent: 0, remaining: 0, count: 0 });

  useEffect(() => {
    const expenses = getExpenses();
    const budget = getBudget();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const catChartData = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount, fill: CATEGORY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.amount - a.amount);

    setChartData(catChartData);
    setStats({
      budget,
      spent: totalSpent,
      remaining: budget - totalSpent,
      count: currentMonthExpenses.length
    });

    const generatedInsights = [];
    if (currentMonthExpenses.length > 0) {
      generatedInsights.push(`You have spent ₹${totalSpent.toLocaleString('en-IN')} this month across ${currentMonthExpenses.length} transactions.`);
      
      const budgetPercent = budget > 0 ? ((totalSpent / budget) * 100).toFixed(1) : 0;
      if (budget > 0) {
        generatedInsights.push(`Your monthly budget is ₹${budget.toLocaleString('en-IN')}. You have used ${budgetPercent}% of it.`);
        
        if (budgetPercent > 80) {
          generatedInsights.push('⚠️ You have used more than 80% of your monthly budget. Consider reducing discretionary spending.');
        } else if (budgetPercent < 50) {
          generatedInsights.push('✅ Great job! You are well within your budget this month.');
        }
      }

      if (catChartData.length > 0) {
        const topCat = catChartData[0];
        const topCatPercent = ((topCat.amount / totalSpent) * 100).toFixed(1);
        generatedInsights.push(`${topCat.name} is your highest spending category at ₹${topCat.amount.toLocaleString('en-IN')} (${topCatPercent}% of total spending).`);
        
        catChartData.forEach(cat => {
          const percent = ((cat.amount / totalSpent) * 100).toFixed(1);
          if (percent > 30 && cat.name !== topCat.name) {
            generatedInsights.push(`${cat.name} takes up ${percent}% of your spending. Consider if this aligns with your priorities.`);
          }
        });
      }
    }

    setInsights(generatedInsights);
  }, []);

  return (
    <div className="insights-page">
      <div className="page-header">
        <h1>Insights</h1>
        <p>Understand your spending patterns</p>
      </div>

      <div className="card insight-overview">
        <div className="insight-overview-grid">
          <div className="insight-mini-stat">
            <div className="label">Budget</div>
            <div className="value">₹{stats.budget.toLocaleString('en-IN')}</div>
          </div>
          <div className="insight-mini-stat">
            <div className="label">Spent</div>
            <div className="value">₹{stats.spent.toLocaleString('en-IN')}</div>
          </div>
          <div className="insight-mini-stat">
            <div className="label">Remaining</div>
            <div className="value" style={{ color: stats.remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              ₹{stats.remaining.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="insight-mini-stat">
            <div className="label">Transactions</div>
            <div className="value">{stats.count}</div>
          </div>
        </div>
      </div>

      <ChartCard title="Category Breakdown">
        {chartData.length > 0 ? (
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">No data to display. Add some expenses first.</p>
          </div>
        )}
      </ChartCard>

      <div className="insights-section">
        <h2>Spending Insights</h2>
        {insights.length > 0 ? (
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className="insight-card">
                <Lightbulb size={24} className="insight-card-icon" />
                <p>{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">Not enough data to generate insights yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
