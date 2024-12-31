import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { selectFilteredEvents, markEventCompleted } from '../../store/slices/calendarSlice';
import { selectCompanies } from '../../store/slices/companySlice';
import { selectMethods } from '../../store/slices/communicationMethodSlice';
import './CommunicationTracker.css';

const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  ALL: 'all'
};

const CommunicationTracker = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const events = useSelector(selectFilteredEvents);
  const companies = useSelector(selectCompanies);
  const methods = useSelector(selectMethods);

  // Local state
  const [overdueCommunications, setOverdueCommunications] = useState([]);
  const [upcomingCommunications, setUpcomingCommunications] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateRange, setDateRange] = useState(DATE_RANGES.WEEK);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [completedCount, setCompletedCount] = useState(0);

  // Filter and sort communications
  useEffect(() => {
    const now = new Date('2024-12-29T15:49:35+05:30'); // Using the provided current time
    const filtered = events.filter(event => {
      if (!event.companyId || !event.methodId || event.completed) return false;
      
      if (selectedCompany !== 'all' && event.companyId !== selectedCompany) return false;
      if (selectedMethod !== 'all' && event.methodId !== selectedMethod) return false;
      
      const eventDate = new Date(event.date);
      switch (dateRange) {
        case DATE_RANGES.TODAY:
          return eventDate.toDateString() === now.toDateString();
        case DATE_RANGES.WEEK:
          const weekAhead = new Date(now);
          weekAhead.setDate(now.getDate() + 7);
          return eventDate <= weekAhead;
        case DATE_RANGES.MONTH:
          const monthAhead = new Date(now);
          monthAhead.setMonth(now.getMonth() + 1);
          return eventDate <= monthAhead;
        default:
          return true;
      }
    });

    const overdue = filtered.filter(event => 
      new Date(event.date) < now && !event.completed
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcoming = filtered.filter(event => 
      new Date(event.date) >= now && !event.completed
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    setOverdueCommunications(overdue);
    setUpcomingCommunications(upcoming);
    
    // Debug log
    console.log('Filtered Events:', {
      all: filtered.length,
      overdue: overdue.length,
      upcoming: upcoming.length,
      now: now.toISOString()
    });
  }, [events, selectedCompany, selectedMethod, dateRange]);

  const handleMarkCompleted = (id) => {
    dispatch(markEventCompleted({ id }));
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleEventSelection = (eventId) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleBulkComplete = () => {
    selectedEvents.forEach(eventId => {
      dispatch(markEventCompleted({ id: eventId }));
    });
    setSelectedEvents(new Set());
  };

  const clearSelection = () => {
    setSelectedEvents(new Set());
  };

  const renderCommunicationCard = (event, type = 'upcoming') => {
    const company = companies.find(c => c.id === event.companyId);
    const method = methods.find(m => m.id === event.methodId);

    return (
      <div key={event.id} className={`communication-card ${type}`}>
        <div className="checkbox-container">
          <div 
            className={`custom-checkbox ${selectedEvents.has(event.id) ? 'checked' : ''}`}
            onClick={() => toggleEventSelection(event.id)}
          />
        </div>
        <div className="card-header">
          <span className="company-name">{company?.name || 'Unknown Company'}</span>
          <span className="communication-date">
            <i className="far fa-clock"></i>
            {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>
        <div className="communication-method">
          <i className="far fa-comment-alt"></i>
          {method?.name || 'Unknown Method'}
        </div>
        <div className="card-actions">
          <button 
            className="action-button complete-button"
            onClick={() => handleMarkCompleted(event.id)}
          >
            <i className="far fa-check-circle"></i>
            Mark Complete
          </button>
          <button 
            className="action-button view-button"
            onClick={() => window.location.href = `/event/${event.id}`}
          >
            <i className="far fa-eye"></i>
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="communication-container">
      <div className="header-section">
        <div className="header-content">
          <h1 className="header-title">Communication Tracker</h1>
          <div className="bulk-actions">
            <button 
              className="bulk-action-button"
              onClick={handleBulkComplete}
              disabled={selectedEvents.size === 0}
            >
              <i className="far fa-check-circle"></i>
              Complete Selected ({selectedEvents.size})
            </button>
            {selectedEvents.size > 0 && (
              <button 
                className="bulk-action-button"
                onClick={clearSelection}
              >
                <i className="far fa-times-circle"></i>
                Clear Selection
              </button>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card overdue">
            <div className="stat-value">{overdueCommunications.length}</div>
            <div className="stat-label">Overdue Communications</div>
          </div>
          <div className="stat-card upcoming">
            <div className="stat-value">{upcomingCommunications.length}</div>
            <div className="stat-label">Upcoming Communications</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Completed This Period</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Company</label>
            <select 
              className="filter-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Method</label>
            <select 
              className="filter-select"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              {methods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <select 
              className="filter-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value={DATE_RANGES.TODAY}>Today</option>
              <option value={DATE_RANGES.WEEK}>Next 7 Days</option>
              <option value={DATE_RANGES.MONTH}>Next 30 Days</option>
              <option value={DATE_RANGES.ALL}>All</option>
            </select>
          </div>
        </div>
      </div>

      <div className="communications-grid">
        <div className="communications-section">
          <div className="section-header">
            <h2 className="section-title overdue">
              <i className="fas fa-exclamation-circle"></i>
              Overdue Communications
            </h2>
            <span className="section-count">{overdueCommunications.length}</span>
          </div>
          {overdueCommunications.map(event => renderCommunicationCard(event, 'overdue'))}
          {overdueCommunications.length === 0 && (
            <div className="empty-state">No overdue communications</div>
          )}
        </div>

        <div className="communications-section">
          <div className="section-header">
            <h2 className="section-title upcoming">
              <i className="far fa-calendar-alt"></i>
              Upcoming Communications
            </h2>
            <span className="section-count">{upcomingCommunications.length}</span>
          </div>
          {upcomingCommunications.map(event => renderCommunicationCard(event, 'upcoming'))}
          {upcomingCommunications.length === 0 && (
            <div className="empty-state">No upcoming communications</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationTracker;
