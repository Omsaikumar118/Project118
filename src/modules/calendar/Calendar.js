/**
 * Calendar Component
 * 
 * Purpose: Display and manage calendar events
 * Features:
 * - Multiple calendar views
 * - Drag and drop support
 * - Advanced recurring events
 * - Event reminders and notifications
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DroppableCell from './DroppableCell';
import EventForm from './EventForm';
import NotificationService from '../../services/NotificationService';
import {
  addEvent,
  setFilters,
  clearFilters,
  selectFilteredEvents,
  selectFilters,
  selectNotification,
  selectUpcomingReminders,
  markEventCompleted,
  deleteEvent,
  updateEvent
} from '../../store/slices/calendarSlice';
import { selectCompanies } from '../../store/slices/companySlice';
import { selectMethods } from '../../store/slices/communicationMethodSlice';
import './Calendar.css';
import { format } from 'date-fns';

const Calendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get event and related data from Redux store
  const events = useSelector(selectFilteredEvents);
  const companies = useSelector(selectCompanies);
  const methods = useSelector(selectMethods);
  const filters = useSelector(selectFilters);
  const notification = useSelector(selectNotification);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('view') || 'month';
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Update URL when view changes
    navigate(`/calendar?view=${view}`, { replace: true });
  }, [view, navigate]);

  useEffect(() => {
    const { start, end } = getViewDates();
    dispatch(setFilters({
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }));
  }, [selectedDate, view, dispatch]);

  const handleEventClick = (event) => {
    navigate(`/calendar/event/${event.id}`);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleEventDrop = (eventId, date) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      dispatch(updateEvent({
        ...event,
        date: date.toISOString()
      }));
    }
  };

  const renderEvent = (event) => {
    const company = companies.find(c => c.id === event.companyId);
    const method = methods.find(m => m.id === event.methodId);
    
    return (
      <div 
        key={event.id}
        className={`calendar-event ${event.completed ? 'completed' : ''}`}
        onClick={() => handleEventClick(event)}
        style={{
          backgroundColor: method?.color || '#3B82F6',
          borderLeft: `4px solid ${method?.color || '#2563EB'}`
        }}
      >
        <div className="event-time">
          {format(new Date(event.date), 'HH:mm')}
        </div>
        <div className="event-title">
          {company?.name || 'Unknown Company'}
        </div>
        <div className="event-method">
          <i className={method?.icon || 'fas fa-calendar'}></i>
        </div>
      </div>
    );
  };

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(selectedDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(selectedDate.getDate() - 7);
    } else {
      newDate.setDate(selectedDate.getDate() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(selectedDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(selectedDate.getDate() + 7);
    } else {
      newDate.setDate(selectedDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Export calendar data
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = events.map(event => ({
        company: event.companyName,
        method: event.methodName,
        date: new Date(event.date).toLocaleDateString(),
        status: event.status,
        notes: event.notes
      }));

      const csvContent = 'data:text/csv;charset=utf-8,' + 
        'Company,Method,Date,Status,Notes\n' +
        exportData.map(row => 
          Object.values(row).map(val => `"${val}"`).join(',')
        ).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `calendar_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Print calendar
  const handlePrint = () => {
    window.print();
  };

  // Get start and end dates for current view
  const getViewDates = () => {
    const currentDate = new Date(selectedDate);
    switch (view) {
      case 'month':
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return { start, end };
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return { start: weekStart, end: weekEnd };
      case 'day':
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        return { start: dayStart, end: dayEnd };
      default:
        return { start: currentDate, end: currentDate };
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const { start, end } = getViewDates();
    const grid = [];
    const current = new Date(start);

    while (current <= end) {
      const dayStart = new Date(current);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(current);
      dayEnd.setHours(23, 59, 59, 999);

      grid.push({
        date: new Date(current),
        events: events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= dayStart && eventDate <= dayEnd;
        })
      });
      current.setDate(current.getDate() + 1);
    }

    return grid;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="header-left">
            <h2 className="calendar-title">Calendar</h2>
            <div className="navigation-controls">
              <button className="nav-button" onClick={handleToday}>Today</button>
              <button className="nav-button" onClick={handlePrevious}>←</button>
              <button className="nav-button" onClick={handleNext}>→</button>
              <span className="current-date">
                {selectedDate.toLocaleString('default', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <button 
              className="action-button add-event"
              onClick={() => setShowEventForm(true)}
            >
              + Add Event
            </button>
          </div>
          <div className="header-right">
            <div className="view-controls">
              <button 
                className={`view-button ${view === 'month' ? 'active' : ''}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button 
                className={`view-button ${view === 'week' ? 'active' : ''}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button 
                className={`view-button ${view === 'day' ? 'active' : ''}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
              <button
                className="action-button export"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
              <button
                className="action-button print"
                onClick={handlePrint}
              >
                Print
              </button>
            </div>
          </div>
        </div>

        <div className={`calendar-grid ${view}-view`}>
          {generateCalendarGrid().map((cell, index) => (
            <DroppableCell
              key={cell.date.toISOString()}
              date={cell.date}
              events={cell.events}
              onEventClick={handleEventClick}
              isToday={cell.date.toDateString() === new Date().toDateString()}
              isCurrentMonth={cell.date.getMonth() === selectedDate.getMonth()}
              view={view}
            />
          ))}
        </div>

        {showEventForm && (
          <EventForm
            selectedDate={selectedDate}
            onClose={() => {
              setShowEventForm(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            companies={companies}
            methods={methods}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Calendar;
