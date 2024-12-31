import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { selectCompletedEvents } from '../../store/slices/calendarSlice';
import { selectCompanies } from '../../store/slices/companySlice';
import { selectMethods } from '../../store/slices/communicationMethodSlice';
import './CommunicationHistory.css';

const CommunicationHistory = () => {
  const completedEvents = useSelector(selectCompletedEvents);
  const companies = useSelector(selectCompanies);
  const methods = useSelector(selectMethods);

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    let filtered = [...completedEvents];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply company filter
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(event => event.companyId === selectedCompany);
    }

    // Apply method filter
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(event => event.methodId === selectedMethod);
    }

    // Apply date range filter
    if (dateRange.startDate) {
      filtered = filtered.filter(event => 
        new Date(event.date) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(event => 
        new Date(event.date) <= new Date(dateRange.endDate)
      );
    }

    // Sort by completion date
    filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    setFilteredEvents(filtered);
  }, [completedEvents, searchTerm, selectedCompany, selectedMethod, dateRange]);

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Company', 'Method', 'Date', 'Completed At', 'Notes'],
      ...filteredEvents.map(event => [
        event.title,
        companies.find(c => c.id === event.companyId)?.name || 'Unknown',
        methods.find(m => m.id === event.methodId)?.name || 'Unknown',
        format(new Date(event.date), 'yyyy-MM-dd HH:mm'),
        format(new Date(event.completedAt), 'yyyy-MM-dd HH:mm'),
        event.notes
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `communication-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Communication History</h1>
        <button className="export-button" onClick={handleExport}>
          <i className="fas fa-download"></i>
          Export to CSV
        </button>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Company</label>
            <select
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
            <label>Method</label>
            <select
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
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                endDate: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      <div className="history-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <i className="far fa-folder-open"></i>
            <p>No completed communications found</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const company = companies.find(c => c.id === event.companyId);
            const method = methods.find(m => m.id === event.methodId);

            return (
              <div key={event.id} className="history-card">
                <div className="card-header">
                  <span className="company-name">{company?.name || 'Unknown Company'}</span>
                  <span className="completion-date">
                    Completed {format(new Date(event.completedAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <h3 className="communication-title">{event.title}</h3>
                <div className="method-info">
                  <i className={method?.icon || 'far fa-comment-alt'}></i>
                  {method?.name || 'Unknown Method'}
                </div>
                <div className="date-info">
                  <i className="far fa-calendar"></i>
                  {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                </div>
                <div className="notes">
                  <i className="far fa-sticky-note"></i>
                  {event.notes}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunicationHistory;
