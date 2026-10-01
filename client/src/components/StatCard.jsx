import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: `${color}33`, color: color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <div className="stat-card-value">{value}</div>
        {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
