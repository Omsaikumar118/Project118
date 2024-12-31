/**
 * Main App Component
 * 
 * Purpose: Configure routing and layout for the application
 * Features:
 * - Route configuration for different modules
 * - Navigation layout with responsive design
 * 
 * @module App
 * @category Core
 * @requires React
 * @requires React Router
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Calendar from './modules/calendar/Calendar';
import EventDetails from './modules/calendar/EventDetails';
import CommunicationTracker from './modules/communication/CommunicationTracker';
import CommunicationHistory from './modules/communication/CommunicationHistory';
import CommunicationAnalytics from './modules/communication/CommunicationAnalytics';
import AdminDashboard from './modules/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/calendar" replace />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar/event/:eventId" element={<EventDetails />} />
            <Route path="/communications" element={<CommunicationTracker />} />
            <Route path="/history" element={<CommunicationHistory />} />
            <Route path="/analytics" element={<CommunicationAnalytics />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
