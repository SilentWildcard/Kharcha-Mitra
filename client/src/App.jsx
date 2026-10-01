import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import SplitsGroups from './pages/SplitsGroups';
import Insights from './pages/Insights';
import KharchaAI from './pages/KharchaAI';
import MobileApp from './pages/MobileApp';
import Settings from './pages/Settings';
import { loadDemoData, isDemoDataLoaded } from './utils/storage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load demo data on first launch
  useEffect(() => {
    if (!isDemoDataLoaded()) {
      loadDemoData();
    }
  }, []);

  const handleNavigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'expenses': return <Expenses />;
      case 'splits': return <SplitsGroups />;
      case 'insights': return <Insights />;
      case 'ai': return <KharchaAI />;
      case 'mobile': return <MobileApp />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
