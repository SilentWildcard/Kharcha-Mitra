export const CATEGORIES = ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Other'];
export const CATEGORY_COLORS = {
  Food: '#f97316', Transport: '#3b82f6', Education: '#8b5cf6',
  Shopping: '#ec4899', Entertainment: '#22c55e', Bills: '#eab308', Other: '#6b7280'
};
const KEYS = { EXPENSES: 'kharcha_expenses', GROUPS: 'kharcha_groups', BUDGET: 'kharcha_budget', DEMO_LOADED: 'kharcha_demo_loaded' };

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export const getExpenses = () => safeGet(KEYS.EXPENSES, []);
export const saveExpenses = (expenses) => safeSet(KEYS.EXPENSES, expenses);
export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = { ...expense, id: generateId() };
  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
};
export const updateExpense = (id, updates) => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    saveExpenses(expenses);
  }
};
export const deleteExpense = (id) => {
  const expenses = getExpenses();
  saveExpenses(expenses.filter(e => e.id !== id));
};

export const getGroups = () => safeGet(KEYS.GROUPS, []);
export const saveGroups = (groups) => safeSet(KEYS.GROUPS, groups);
export const addGroup = (group) => {
  const groups = getGroups();
  const newGroup = { ...group, id: generateId(), expenses: group.expenses || [] };
  groups.push(newGroup);
  saveGroups(groups);
  return newGroup;
};
export const updateGroup = (id, updates) => {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updates };
    saveGroups(groups);
  }
};
export const deleteGroup = (id) => {
  const groups = getGroups();
  saveGroups(groups.filter(g => g.id !== id));
};
export const addGroupExpense = (groupId, expense) => {
  const groups = getGroups();
  const group = groups.find(g => g.id === groupId);
  if (group) {
    const newExpense = { ...expense, id: generateId() };
    if (!group.expenses) group.expenses = [];
    group.expenses.push(newExpense);
    saveGroups(groups);
    return newExpense;
  }
};
export const deleteGroupExpense = (groupId, expenseId) => {
  const groups = getGroups();
  const group = groups.find(g => g.id === groupId);
  if (group && group.expenses) {
    group.expenses = group.expenses.filter(e => e.id !== expenseId);
    saveGroups(groups);
  }
};

export const getBudget = () => safeGet(KEYS.BUDGET, 10000);
export const saveBudget = (amount) => safeSet(KEYS.BUDGET, amount);

/**
 * Calculates settlements for a group of members based on shared expenses.
 * 
 * 1. Calculates net balances for each member across all group expenses.
 * 2. For each expense, paidBy gets +amount, participants get -(amount/participants.length).
 * 3. Separates members into creditors (positive balance) and debtors (negative balance).
 * 4. Sorts both lists by absolute value descending.
 * 5. Greedy matching: transfers min(|debt|, credit) from top debtor to top creditor.
 * 6. Returns an array of settlement transactions.
 * 
 * @param {Object} group - The group containing members and expenses
 * @returns {Array} List of settlement transactions { from, to, amount }
 */
export const calculateSettlements = (group) => {
  if (!group || !group.expenses || group.expenses.length === 0) return [];
  
  // 1. Calculate net balances for each member
  const balances = {};
  group.members.forEach(member => {
    balances[member] = 0;
  });

  // 2. Distribute expense amounts
  group.expenses.forEach(expense => {
    const { amount, paidBy } = expense;
    const participants = expense.participants || expense.splitBetween || [];
    if (balances[paidBy] === undefined) balances[paidBy] = 0;
    balances[paidBy] += amount;
    
    if (participants && participants.length > 0) {
      const splitAmount = amount / participants.length;
      participants.forEach(p => {
        if (balances[p] === undefined) balances[p] = 0;
        balances[p] -= splitAmount;
      });
    }
  });

  // 3. Separate into creditors and debtors
  const creditors = [];
  const debtors = [];
  for (const [member, balance] of Object.entries(balances)) {
    if (balance > 0.01) creditors.push({ member, amount: balance });
    else if (balance < -0.01) debtors.push({ member, amount: -balance });
  }

  // 4. Sort both by absolute value descending
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // 5. Greedy matching
  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const settledAmount = Math.min(debtor.amount, creditor.amount);
    
    settlements.push({
      from: debtor.member,
      to: creditor.member,
      amount: parseFloat(settledAmount.toFixed(2))
    });
    
    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;
    
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  // 6. Return array of settlements
  return settlements;
};

export const clearAllExpenses = () => localStorage.removeItem(KEYS.EXPENSES);
export const clearAllGroups = () => localStorage.removeItem(KEYS.GROUPS);
export const clearAllData = () => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};

export const isDemoDataLoaded = () => safeGet(KEYS.DEMO_LOADED, false);
export const loadDemoData = (force = false) => {
  if (isDemoDataLoaded() && !force) return;

  const demoExpenses = [
    { title: 'College Canteen Lunch', amount: 120, category: 'Food', date: '2026-09-02', note: 'Regular lunch' },
    { title: 'Metro Card Recharge', amount: 500, category: 'Transport', date: '2026-09-03', note: 'Monthly recharge' },
    { title: 'Programming Textbook', amount: 450, category: 'Education', date: '2026-09-05', note: 'DSA book' },
    { title: 'Movie Night', amount: 350, category: 'Entertainment', date: '2026-09-07', note: 'With friends' },
    { title: 'New Earphones', amount: 1200, category: 'Shopping', date: '2026-09-08', note: 'Bluetooth earphones' },
    { title: 'Chai & Samosa', amount: 60, category: 'Food', date: '2026-09-10', note: 'Evening snack' },
    { title: 'Auto Rickshaw', amount: 150, category: 'Transport', date: '2026-09-12', note: 'College to home' },
    { title: 'Electricity Bill', amount: 800, category: 'Bills', date: '2026-09-14', note: 'Shared bill' },
    { title: 'Stationery', amount: 250, category: 'Education', date: '2026-09-15', note: 'Notebooks and pens' },
    { title: 'Street Food', amount: 180, category: 'Food', date: '2026-09-18', note: 'Pani puri' },
    { title: 'T-shirt', amount: 599, category: 'Shopping', date: '2026-09-20', note: 'Online sale' },
    { title: 'Netflix Subscription', amount: 199, category: 'Entertainment', date: '2026-09-21', note: 'Monthly plan' },
    { title: 'Bus Pass', amount: 300, category: 'Transport', date: '2026-09-22', note: 'Weekly pass' },
    { title: 'Dinner with Friends', amount: 420, category: 'Food', date: '2026-09-23', note: 'Birthday celebration' },
    { title: 'Phone Recharge', amount: 299, category: 'Bills', date: '2026-09-24', note: 'Monthly plan' }
  ].map(e => ({ ...e, id: generateId() }));

  saveExpenses(demoExpenses);

  const demoGroup = {
    name: 'Flatmates',
    members: ['You', 'Rahul', 'Aryan', 'Riya'],
    expenses: [
      { id: generateId(), title: 'Dinner', amount: 1200, paidBy: 'Rahul', participants: ['You', 'Rahul', 'Aryan', 'Riya'], date: '2026-09-15' },
      { id: generateId(), title: 'Groceries', amount: 800, paidBy: 'You', participants: ['You', 'Rahul', 'Aryan', 'Riya'], date: '2026-09-18' }
    ]
  };

  saveGroups([{ ...demoGroup, id: generateId() }]);
  saveBudget(10000);
  safeSet(KEYS.DEMO_LOADED, true);
};
