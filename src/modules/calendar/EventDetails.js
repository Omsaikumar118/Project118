import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateEvent, deleteEvent } from '../../store/slices/calendarSlice';
import { format } from 'date-fns';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get event and related data from Redux store
  const event = useSelector(state => 
    state.calendar.events.find(e => e.id === eventId)
  );
  const companies = useSelector(state => state.companies.companies);
  const methods = useSelector(state => state.communicationMethods.methods);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    methodId: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        companyId: event.companyId,
        methodId: event.methodId,
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
        notes: event.notes || ''
      });
    }
  }, [event]);

  if (!event) {
    return (
      <div className="event-details-container">
        <div className="event-card">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn’t exist.</p>
          <button 
            className="btn btn-back"
            onClick={() => navigate('/calendar')}
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  const company = companies.find(c => c.id === event.companyId);
  const method = methods.find(m => m.id === event.methodId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEvent({
      ...event,
      ...formData,
      date: new Date(formData.date).toISOString()
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent({ id: eventId }));
      navigate('/calendar');
    }
  };

  return (
    <div className="event-details-container">
      <div className="event-card">
        <div className="event-header">
          <div className="header-content">
            <h2 className="event-title">
              {company ? company.name : 'Unknown Company'}
            </h2>
            <div className="event-actions">
              <button 
                className="btn btn-back"
                onClick={() => navigate('/calendar')}
              >
                Back
              </button>
              <button 
                className="btn btn-edit"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button 
                className="btn btn-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label className="form-label">Company</label>
              <select
                className="form-input"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Communication Method</label>
              <select
                className="form-input"
                name="methodId"
                value={formData.methodId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Method</option>
                {methods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input form-textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-save">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="event-info">
            <div className="info-section">
              <h3 className="section-title">Details</h3>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Company:</span>
                  <span className="info-value">{company ? company.name : 'Unknown Company'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Method:</span>
                  <span className="info-value">{method ? method.name : 'Unknown Method'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {format(new Date(event.date), 'PPpp')}
                  </span>
                </div>
              </div>
            </div>

            {event.notes && (
              <div className="info-section">
                <h3 className="section-title">Notes</h3>
                <div className="info-content">
                  <p>{event.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
