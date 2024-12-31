import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEvent,
  updateEvent,
  RECURRENCE_PATTERNS,
  REMINDER_TYPES,
  PRIORITY_LEVELS,
  setNotification,
  clearNotification
} from '../../store/slices/calendarSlice';
import { format, parseISO } from 'date-fns';
import './EventForm.css';

const EventForm = ({ event, onClose, companies, methods }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    companyId: '',
    methodId: '',
    title: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    notes: '',
    priority: PRIORITY_LEVELS.MEDIUM,
    category: '',
    color: '#3B82F6',
    recurrence: {
      pattern: RECURRENCE_PATTERNS.NONE,
      interval: 1,
      endDate: '',
      daysOfWeek: [],
    },
    reminders: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: format(parseISO(event.date), "yyyy-MM-dd'T'HH:mm"),
        recurrence: {
          ...event.recurrence,
          endDate: event.recurrence?.endDate
            ? format(parseISO(event.recurrence.endDate), 'yyyy-MM-dd')
            : ''
        }
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyId) newErrors.companyId = 'Please select a company';
    if (!formData.methodId) newErrors.methodId = 'Please select a communication method';
    if (!formData.date) newErrors.date = 'Please select a date and time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [name]: value
      }
    }));
  };

  const handleAddReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        {
          id: Date.now().toString(),
          type: REMINDER_TYPES.NOTIFICATION,
          minutesBefore: 30
        }
      ]
    }));
  };

  const handleRemoveReminder = (reminderId) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== reminderId)
    }));
  };

  const handleReminderChange = (reminderId, field, value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === reminderId ? { ...r, [field]: value } : r
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedCompany = companies.find(c => c.id === formData.companyId);
    const selectedMethod = methods.find(m => m.id === formData.methodId);

    const eventData = {
      ...formData,
      id: event?.id || Date.now().toString(),
      companyName: selectedCompany?.name || '',
      methodName: selectedMethod?.name || '',
      date: new Date(formData.date).toISOString(),
      recurrence: {
        ...formData.recurrence,
        endDate: formData.recurrence.endDate
          ? new Date(formData.recurrence.endDate).toISOString()
          : null
      }
    };

    try {
      if (event) {
        dispatch(updateEvent({ id: event.id, event: eventData }));
        dispatch(setNotification({ type: 'success', message: 'Event updated successfully' }));
      } else {
        dispatch(addEvent(eventData));
        dispatch(setNotification({ type: 'success', message: 'Event created successfully' }));
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      dispatch(setNotification({ type: 'error', message: 'Error saving event' }));
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyId">Company*</label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                className={errors.companyId ? 'error' : ''}
              >
                <option value="">Select a company</option>
                {companies?.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && <span className="error-message">{errors.companyId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="methodId">Communication Method*</label>
              <select
                id="methodId"
                name="methodId"
                value={formData.methodId}
                onChange={handleInputChange}
                className={errors.methodId ? 'error' : ''}
              >
                <option value="">Select a method</option>
                {methods?.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              {errors.methodId && <span className="error-message">{errors.methodId}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add notes here..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <div className="reminders-header">
              <label>Reminders</label>
              <button
                type="button"
                onClick={handleAddReminder}
                className="add-reminder-button"
              >
                + Add Reminder
              </button>
            </div>
            <div className="reminders-list">
              {formData.reminders.map((reminder) => (
                <div key={reminder.id} className="reminder-item">
                  <select
                    value={reminder.type}
                    onChange={(e) => handleReminderChange(reminder.id, 'type', e.target.value)}
                  >
                    {Object.entries(REMINDER_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={reminder.minutesBefore}
                    onChange={(e) => handleReminderChange(reminder.id, 'minutesBefore', e.target.value)}
                    min="1"
                  />
                  <span>minutes before</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReminder(reminder.id)}
                    className="remove-reminder-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pattern">Recurrence</label>
            <select
              id="pattern"
              name="pattern"
              value={formData.recurrence.pattern}
              onChange={handleRecurrenceChange}
            >
              <option value={RECURRENCE_PATTERNS.NONE}>None</option>
              <option value={RECURRENCE_PATTERNS.DAILY}>Daily</option>
              <option value={RECURRENCE_PATTERNS.WEEKLY}>Weekly</option>
              <option value={RECURRENCE_PATTERNS.MONTHLY}>Monthly</option>
              <option value={RECURRENCE_PATTERNS.YEARLY}>Yearly</option>
            </select>
          </div>

          {formData.recurrence.pattern !== RECURRENCE_PATTERNS.NONE && (
            <div className="form-group">
              <label htmlFor="recurrence-end">Recurrence End Date</label>
              <input
                type="date"
                id="recurrence-end"
                name="endDate"
                value={formData.recurrence.endDate}
                onChange={handleRecurrenceChange}
              />
            </div>
          )}
        </div>

        <div className="form-footer">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
