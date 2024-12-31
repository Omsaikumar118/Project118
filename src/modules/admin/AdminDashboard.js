/**
 * AdminDashboard Component
 * 
 * Purpose: Main container component for the admin module that manages
 * the tab navigation between different admin features.
 * 
 * Features:
 * - Tab-based navigation
 * - Company Management
 * - Communication Method Management
 */

import React, { useState } from 'react';
import { BsBuilding, BsChatDots, BsCalendarCheck, BsGraphUp } from 'react-icons/bs';
import CompanyManagement from './CompanyManagement';
import CommunicationMethodManagement from './CommunicationMethodManagement';
import './AdminPage.css';

const AdminDashboard = () => {
  // State management for active tab
  const [activeTab, setActiveTab] = useState('companies');

  // Mock statistics data
  const stats = {
    totalCompanies: 25,
    activeCommunications: 42,
    pendingFollowUps: 15,
    completedFollowUps: 128
  };

  return (
    <div className="admin-dashboard">
      {/* Statistics Section */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <BsBuilding />
          </div>
          <div className="stat-content">
            <h3>Total Companies</h3>
            <p className="stat-number">{stats.totalCompanies}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <BsChatDots />
          </div>
          <div className="stat-content">
            <h3>Active Communications</h3>
            <p className="stat-number">{stats.activeCommunications}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <BsCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>Pending Follow-ups</h3>
            <p className="stat-number">{stats.pendingFollowUps}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BsGraphUp />
          </div>
          <div className="stat-content">
            <h3>Completed Follow-ups</h3>
            <p className="stat-number">{stats.completedFollowUps}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            <BsBuilding /> Company Management
          </button>
          <button
            className={`tab-button ${activeTab === 'communications' ? 'active' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            <BsChatDots /> Communication Methods
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'companies' ? (
            <CompanyManagement />
          ) : (
            <CommunicationMethodManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
