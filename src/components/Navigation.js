import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import Notifications from './Notifications';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <i className="far fa-calendar-alt"></i>
        <span>Calendar App</span>
      </div>
      
      <div className="nav-links">
        <Link to="/calendar" className={isActive('/calendar')}>
          <i className="far fa-calendar"></i>
          Calendar
        </Link>
        
        <Link to="/communications" className={isActive('/communications')}>
          <i className="far fa-comments"></i>
          Communications
        </Link>
        
        <Link to="/history" className={isActive('/history')}>
          <i className="fas fa-history"></i>
          History
        </Link>
        
        <Link to="/analytics" className={isActive('/analytics')}>
          <i className="fas fa-chart-line"></i>
          Analytics
        </Link>
        
        <Link to="/admin" className={isActive('/admin')}>
          <i className="fas fa-cog"></i>
          Admin
        </Link>
      </div>
      
      <div className="nav-right">
        <div className="notification-icon-container">
          <Notifications />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
