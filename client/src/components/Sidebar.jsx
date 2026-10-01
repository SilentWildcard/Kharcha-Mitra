import React from 'react';
import { Wallet, LayoutDashboard, Receipt, Users, BarChart3, Bot, Settings, Menu, Smartphone } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate, isOpen, onToggle }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'expenses', icon: Receipt, label: 'Expenses' },
    { id: 'splits', icon: Users, label: 'Splits & Groups' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'ai', icon: Bot, label: 'Kharcha AI' },
    { id: 'mobile', icon: Smartphone, label: 'Get Mobile App' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <button className="mobile-menu-btn" onClick={onToggle}>
        <Menu size={24} />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Wallet size={32} />
          <div>
            <h2>Kharcha Mitra</h2>
            <p>Track. Split. Understand.</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
